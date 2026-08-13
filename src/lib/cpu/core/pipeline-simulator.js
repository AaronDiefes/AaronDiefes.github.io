/**
 * PipelineSimulator - cycle-accurate 5-stage pipeline model
 *
 * Replaces SequenceGenerator, which emitted five frames per instruction and ran
 * strictly one instruction at a time ("NON-PIPELINED simulation", per its own
 * header). This emits ONE FRAME PER CLOCK CYCLE, with up to five instructions in
 * flight, real forwarding, real stalls and real branch flushes.
 *
 * Modelled on the actual hardware: /Users/aaron/Aaron/CPU/CPU/processor.v.
 * Where the old JS simulator and the Verilog disagreed, the Verilog wins:
 *
 *   - Word addressing. PC increments by 1, not 4. Memory is indexed by word.
 *   - Branch target is PC + 1 + N (the old code computed PC + N*4, which made
 *     Fibonacci's loop-exit branch a no-op so the program never terminated).
 *   - Branches resolve in EX, not WB, so a taken branch costs exactly 2 cycles.
 *   - Register read ports follow processor.v:135-142 -
 *       bne/blt/jr read $rd on port A; bne/blt read $rs on port B;
 *       sw reads $rs for the address and $rd for the store value.
 *     This matters well beyond decode: hazard detection is only correct if we
 *     know precisely which registers each instruction actually reads.
 *
 * ---------------------------------------------------------------------------
 * WHY THE EVALUATION ORDER IS WHAT IT IS
 *
 * Each cycle computes every stage's output from the CURRENT latch values first,
 * and only then commits the new latch values. Evaluating in reverse order
 * (WB -> MEM -> EX -> ID -> IF) and deferring the commit is what prevents an
 * instruction from being processed twice in one cycle - the classic way to get
 * this wrong is to update IF/ID before ID has read it.
 *
 * The register file writes in the first half-cycle and reads in the second, so a
 * value written by WB is visible to an ID read in the SAME cycle. That is why
 * there is no forwarding path into ID: it is not needed.
 * ---------------------------------------------------------------------------
 */
(function () {
  'use strict';

  /** A latch slot holding no instruction - a bubble. */
  const BUBBLE = null;

  /**
   * Cycles a mul/div occupies the multdiv unit, taken from the real counters:
   * MultDiv/mult_32bit.v uses a 5-bit counter with RDY = q[4] (16 cycles);
   * div_32bit.v uses a 6-bit counter with RDY = q[5] (32). These are long enough
   * to be visibly instructive - the bubble train marching toward WB is the point.
   */
  const MULT_CYCLES = 16;
  const DIV_CYCLES = 32;

  /** Runaway guard. Real programs here terminate; this only catches authoring bugs. */
  const MAX_CYCLES = 2000;

  // ---- ALU ---------------------------------------------------------------
  // Pure function of (op, A, B, shamt), mirroring alu.v. The compare outputs are
  // produced unconditionally, exactly as the hardware does - `isNotEqual` and
  // `isLessThan` are separate output pins, not a side effect of a SUB.
  function alu(op, a, b, shamt) {
    const A = a >>> 0;
    const B = b >>> 0;
    let result;
    switch (op) {
      case 'ADD': result = (A + B) >>> 0; break;
      case 'SUB': result = (A - B) >>> 0; break;
      case 'AND': result = (A & B) >>> 0; break;
      case 'OR':  result = (A | B) >>> 0; break;
      case 'SLL': result = (A << (shamt & 31)) >>> 0; break;
      case 'SRA': result = ((A | 0) >> (shamt & 31)) >>> 0; break;
      case 'MUL': result = Math.imul(A | 0, B | 0) >>> 0; break;
      case 'DIV': result = B === 0 ? 0 : (((A | 0) / (B | 0)) | 0) >>> 0; break;
      default:    result = 0;
    }
    return {
      result,
      isNotEqual: A !== B,
      isLessThan: (A | 0) < (B | 0),
    };
  }

  // ---- Decode ------------------------------------------------------------
  /**
   * Control signals for one instruction.
   *
   * `readA` / `readB` are the register NUMBERS this instruction actually reads
   * (null when the port is unused). Hazard detection and forwarding both key off
   * these, so the odd cases below are load-bearing rather than pedantic.
   */
  function decode(instr) {
    const m = instr ? instr.mnemonic : 'NOP';
    const rs = instr && instr.rs != null ? instr.rs : 0;
    const rt = instr && instr.rt != null ? instr.rt : 0;
    const rd = instr && instr.rd != null ? instr.rd : 0;

    const base = {
      mnemonic: m,
      readA: null,
      readB: null,
      writeReg: 0,
      regWrite: false,
      memRead: false,
      memWrite: false,
      aluOp: 'ADD',
      aluSrcImm: false,
      isBranch: false,
      isJump: false,
      isMultDiv: false,
      usesShamt: false,
    };

    switch (m) {
      case 'ADD': case 'SUB': case 'AND': case 'OR':
        return { ...base, readA: rs, readB: rt, writeReg: rd, regWrite: true, aluOp: m };

      case 'SLL': case 'SRA':
        // Shift amount is an immediate field, so port B is unused.
        return { ...base, readA: rs, writeReg: rd, regWrite: true, aluOp: m, usesShamt: true };

      case 'MUL': case 'DIV':
        return { ...base, readA: rs, readB: rt, writeReg: rd, regWrite: true, aluOp: m, isMultDiv: true };

      case 'ADDI':
        return { ...base, readA: rs, writeReg: rd, regWrite: true, aluOp: 'ADD', aluSrcImm: true };

      case 'LW':
        return { ...base, readA: rs, writeReg: rd, regWrite: true, aluOp: 'ADD', aluSrcImm: true, memRead: true };

      case 'SW':
        // processor.v:136 - sw reads $rd on port B as the STORE VALUE, while
        // port A supplies the address base. It writes no register.
        return { ...base, readA: rs, readB: rd, aluOp: 'ADD', aluSrcImm: true, memWrite: true };

      case 'BNE': case 'BLT':
        // processor.v:135,137 - branches compare $rd (port A) against $rs (port B).
        return { ...base, readA: rd, readB: rs, aluOp: 'SUB', isBranch: true };

      case 'J':
        return { ...base, isJump: true };

      case 'JR':
        return { ...base, readA: rd, isJump: true };

      case 'JAL':
        // Links PC+1 into $r31; the link value bypasses the ALU.
        return { ...base, writeReg: 31, regWrite: true, isJump: true };

      case 'NOP':
      default:
        return base;
    }
  }

  // ---- Simulator ---------------------------------------------------------

  function simulate(program) {
    const instructions = (program && program.instructions) || [];
    const regs = new Uint32Array(32);
    const mem = new Uint32Array(256);

    // Pipeline latches. `null` means a bubble occupies that stage.
    let fd = BUBBLE; // IF/ID
    let dx = BUBBLE; // ID/EX
    let xm = BUBBLE; // EX/MEM
    let mw = BUBBLE; // MEM/WB

    let pc = 0;
    let nextInstrId = 0;
    let multdivCounter = 0;
    /**
     * Operands are captured when the multdiv unit STARTS and held for its whole
     * run, exactly as the hardware does - the unit latches its inputs and works
     * on them. Re-resolving them each cycle looks equivalent and is not: by the
     * time a 16-cycle multiply finishes, the instructions that were forwarding
     * to it have drained out of EX/MEM and MEM/WB, so the operands would quietly
     * revert to the stale values read in ID and the product would come out zero.
     */
    let multdivOperands = null;
    const frames = [];
    let retired = 0;

    // A run ends when the pipeline has fully drained and PC is past the program.
    for (let cycle = 0; cycle < MAX_CYCLES; cycle++) {
      const events = [];
      const changedRegisters = new Set();
      const changedMemory = new Set();

      const fetchable = pc >= 0 && pc < instructions.length;
      const drained = !fd && !dx && !xm && !mw;
      if (!fetchable && drained && cycle > 0) break;

      // ---- WB (first half-cycle: the register file is written here) --------
      let wbInfo = null;
      if (mw) {
        wbInfo = { instrId: mw.instrId, regWrite: mw.ctrl.regWrite, writeReg: mw.ctrl.writeReg, writeData: mw.writeData };
        if (mw.ctrl.regWrite && mw.ctrl.writeReg !== 0) {
          if (regs[mw.ctrl.writeReg] !== mw.writeData) {
            regs[mw.ctrl.writeReg] = mw.writeData >>> 0;
            changedRegisters.add(mw.ctrl.writeReg);
          }
        }
        retired++;
      }

      // ---- MEM --------------------------------------------------------------
      let memOut = BUBBLE;
      let memInfo = null;
      if (xm) {
        let memData = 0;
        const address = xm.aluResult >>> 0;
        if (xm.ctrl.memRead) {
          memData = mem[address & 255];
        } else if (xm.ctrl.memWrite) {
          // The store value may still be in flight ahead of us: WM bypass takes
          // it straight from MEM/WB rather than the (stale) latched copy.
          let storeVal = xm.storeVal;
          if (mw && mw.ctrl.regWrite && mw.ctrl.writeReg !== 0 && mw.ctrl.writeReg === xm.ctrl.readB) {
            storeVal = mw.writeData;
            events.push({ kind: 'forward', from: 'MEMWB', to: 'MEM', operand: 'store', reg: xm.ctrl.readB, value: storeVal });
          }
          if (mem[address & 255] !== storeVal) {
            mem[address & 255] = storeVal >>> 0;
            changedMemory.add(address & 255);
          }
        }
        memInfo = {
          instrId: xm.instrId, memRead: xm.ctrl.memRead, memWrite: xm.ctrl.memWrite,
          address, memData,
        };
        memOut = {
          instrId: xm.instrId, instr: xm.instr, pc: xm.pc, ctrl: xm.ctrl,
          writeData: xm.ctrl.memRead ? memData : xm.aluResult,
        };
      }

      // ---- EX ---------------------------------------------------------------
      // Forwarding priority is EX/MEM before MEM/WB before the register file,
      // because the most recent write is the correct one.
      let exOut = BUBBLE;
      let exInfo = null;
      let branchTaken = false;
      let branchTarget = 0;
      let multdivBusy = false;

      if (dx) {
        const c = dx.ctrl;

        const forward = (regNum, latched, operand) => {
          if (regNum == null || regNum === 0) return { value: latched, src: null };
          if (xm && xm.ctrl.regWrite && xm.ctrl.writeReg !== 0 && xm.ctrl.writeReg === regNum) {
            // processor.v:236 gates this path with `~mem_is_lw`, and the reason is
            // easy to miss: for a load, the EX/MEM latch holds the ADDRESS, not
            // the loaded word - the data does not exist until the end of MEM. So
            // bypassing from a load here would forward the address. The hardware
            // suppresses it and relies on the load-use stall to delay the
            // consumer far enough to take the MEM/WB path instead.
            if (xm.ctrl.memRead) {
              events.push({ kind: 'forward', from: 'EXMEM', to: 'EX', operand, reg: regNum, active: false, suppressedBy: 'lw-in-MEM' });
            } else {
              const v = xm.aluResult;
              events.push({ kind: 'forward', from: 'EXMEM', to: 'EX', operand, reg: regNum, value: v });
              return { value: v, src: 'EXMEM' };
            }
          }
          if (mw && mw.ctrl.regWrite && mw.ctrl.writeReg !== 0 && mw.ctrl.writeReg === regNum) {
            const v = mw.writeData;
            events.push({ kind: 'forward', from: 'MEMWB', to: 'EX', operand, reg: regNum, value: v });
            return { value: v, src: 'MEMWB' };
          }
          return { value: latched, src: null };
        };

        const a = forward(c.readA, dx.rsVal, 'A');
        const b = forward(c.readB, dx.rtVal, 'B');

        let operandA = a.value;
        let operandB = c.aluSrcImm ? (dx.instr.immediate | 0) : b.value;
        if (c.isMultDiv && multdivOperands) {
          // Mid-run: use the values the unit latched when it started.
          operandA = multdivOperands.a;
          operandB = multdivOperands.b;
        }

        const shamt = dx.instr && dx.instr.shamt != null ? dx.instr.shamt : (dx.instr && dx.instr.immediate) || 0;
        const res = alu(c.aluOp, operandA, operandB, shamt);

        if (c.isMultDiv) {
          if (multdivCounter === 0) {
            multdivCounter = c.mnemonic === 'DIV' ? DIV_CYCLES : MULT_CYCLES;
            multdivOperands = { a: operandA, b: operandB };
          }
          multdivCounter--;
          multdivBusy = multdivCounter > 0;
          if (multdivBusy) {
            events.push({ kind: 'stall', reason: 'multdiv', frozen: ['PC', 'IFID', 'IDEX'], bubbleInto: 'EXMEM', instrId: dx.instrId, remaining: multdivCounter });
          } else {
            // Unit is free again; release the latched operands so the next
            // mul/div captures its own rather than reusing these.
            multdivOperands = null;
          }
        }

        if (c.isBranch) {
          branchTaken = c.mnemonic === 'BNE' ? res.isNotEqual : res.isLessThan;
          branchTarget = (dx.pc + 1 + (dx.instr.immediate | 0)) >>> 0;
        } else if (c.isJump) {
          branchTaken = true;
          branchTarget = dx.instr.mnemonic === 'JR' ? (a.value >>> 0) : (dx.instr.immediate >>> 0);
        }

        const writeData = dx.instr.mnemonic === 'JAL' ? (dx.pc + 1) >>> 0 : res.result;

        exInfo = {
          instrId: dx.instrId, aluResult: res.result, operandA: a.value, operandB,
          fwdA: a.src, fwdB: b.src, branchTaken, branchTarget,
          isNotEqual: res.isNotEqual, isLessThan: res.isLessThan,
        };

        if (!multdivBusy) {
          exOut = {
            instrId: dx.instrId, instr: dx.instr, pc: dx.pc, ctrl: c,
            aluResult: writeData, storeVal: b.value,
          };
        }
      }

      // ---- ID (second half-cycle: reads see this cycle's WB write) ----------
      let idOut = BUBBLE;
      let idInfo = null;
      if (fd) {
        const c = decode(fd.instr);
        const read = (n) => (n == null ? 0 : n === 0 ? 0 : regs[n]);
        idInfo = { instrId: fd.instrId, rs: c.readA, rt: c.readB, rd: c.writeReg, rsVal: read(c.readA), rtVal: read(c.readB) };
        idOut = {
          instrId: fd.instrId, instr: fd.instr, pc: fd.pc, ctrl: c,
          rsVal: read(c.readA), rtVal: read(c.readB),
        };
      }

      // ---- Load-use hazard -------------------------------------------------
      // The one case forwarding cannot fix: a load's data does not exist until
      // MEM, but its consumer needs it in EX one cycle earlier. Detected between
      // the load (now in EX) and its consumer (now in ID).
      let loadUseStall = false;
      if (dx && dx.ctrl.memRead && dx.ctrl.writeReg !== 0 && fd) {
        const consumer = decode(fd.instr);
        if (consumer.readA === dx.ctrl.writeReg || consumer.readB === dx.ctrl.writeReg) {
          loadUseStall = true;
          events.push({
            kind: 'stall', reason: 'load-use', frozen: ['PC', 'IFID'], bubbleInto: 'IDEX',
            producer: dx.instrId, consumer: fd.instrId, reg: dx.ctrl.writeReg,
          });
        }
      }

      // ---- IF ---------------------------------------------------------------
      const ifInstr = fetchable ? instructions[pc] : null;
      const ifOut = ifInstr
        ? { instrId: nextInstrId, instr: ifInstr, pc }
        : BUBBLE;

      // ---- Frame (the machine as it stands THIS cycle) ----------------------
      frames.push(buildFrame({
        cycle, pc, regs, mem, changedRegisters, changedMemory, events, retired,
        ifSlot: ifOut, fdSlot: fd, dxSlot: dx, xmSlot: xm, mwSlot: mw,
        idInfo, exInfo, memInfo, wbInfo,
      }));

      // ---- Commit latches ---------------------------------------------------
      // Ordering note: every branch below reads the pre-commit latches computed
      // above, never each other.
      if (multdivBusy) {
        // Freeze everything behind the multdiv unit; EX/MEM takes a bubble.
        mw = memOut;
        xm = BUBBLE;
        // dx, fd, pc unchanged
      } else if (branchTaken) {
        // Resolved in EX, so the two instructions behind it are wrong-path.
        events.push({ kind: 'flush', reason: dx.ctrl.isBranch ? 'branch-taken' : 'jump', killed: [fd && fd.instrId, ifOut && ifOut.instrId].filter((x) => x != null) });
        mw = memOut;
        xm = exOut;
        dx = BUBBLE;
        fd = BUBBLE;
        pc = branchTarget;
      } else if (loadUseStall) {
        mw = memOut;
        xm = exOut;
        dx = BUBBLE;   // bubble into ID/EX
        // fd and pc frozen
      } else {
        mw = memOut;
        xm = exOut;
        dx = idOut;
        fd = ifOut;
        if (ifOut) nextInstrId++;
        pc = fetchable ? pc + 1 : pc;
      }
    }

    return {
      frames,
      instructions,
      metadata: {
        totalCycles: frames.length,
        totalInstructions: retired,
        ipc: frames.length ? retired / frames.length : 0,
      },
      finalRegisters: Array.from(regs),
      finalMemory: Array.from(mem),
    };
  }

  /**
   * Build one frame.
   *
   * Emits two shapes deliberately:
   *   `stages` - the new per-cycle model, with a stable `instrId` per slot so the
   *              timeline, the datapath and the narration can all point at the
   *              same instruction.
   *   `pipeline` - the legacy shape the existing views still read, so the core
   *              can be swapped in before the UI is rebuilt.
   */
  function buildFrame(o) {
    const slot = (latch, extra) => {
      if (!latch) return { instrId: null, instruction: null, mnemonic: null, pc: null, bubble: true };
      return {
        instrId: latch.instrId,
        instruction: latch.instr,
        mnemonic: latch.instr ? latch.instr.mnemonic : null,
        pc: latch.pc,
        bubble: false,
        ...(extra || {}),
      };
    };

    const stages = {
      IF:  slot(o.ifSlot),
      ID:  slot(o.fdSlot, o.idInfo || {}),
      EX:  slot(o.dxSlot, o.exInfo || {}),
      MEM: slot(o.xmSlot, o.memInfo || {}),
      WB:  slot(o.mwSlot, o.wbInfo || {}),
    };

    const activeStages = new Set(
      Object.keys(stages).filter((s) => !stages[s].bubble)
    );

    // Legacy-compatible view. `active` now means "this stage holds a real
    // instruction this cycle", which is true of up to five stages at once.
    const pipeline = {
      IF:  { instruction: stages.IF.instruction,  pc: stages.IF.pc || 0, active: !stages.IF.bubble },
      ID:  { instruction: stages.ID.instruction,  opcode: stages.ID.mnemonic || '', rs: stages.ID.rs || 0, rt: stages.ID.rt || 0, rd: stages.ID.rd || 0, imm: 0, rsVal: stages.ID.rsVal || 0, rtVal: stages.ID.rtVal || 0, active: !stages.ID.bubble },
      EX:  { aluResult: stages.EX.aluResult || 0, writeData: stages.EX.aluResult || 0, writeReg: 0, zero: false, active: !stages.EX.bubble },
      MEM: { memData: stages.MEM.memData || 0, writeData: 0, writeReg: 0, memRead: !!stages.MEM.memRead, memWrite: !!stages.MEM.memWrite, active: !stages.MEM.bubble },
      WB:  { writeData: stages.WB.writeData || 0, writeReg: stages.WB.writeReg || 0, regWrite: !!stages.WB.regWrite, active: !stages.WB.bubble },
    };

    return {
      cycle: o.cycle,
      cycleCount: o.cycle,
      pc: o.pc,
      instructionCount: o.retired,
      stages,
      pipeline,
      events: o.events,
      registers: Uint32Array.from(o.regs),
      memory: Uint32Array.from(o.mem),
      changedRegisters: new Set(o.changedRegisters),
      changedMemory: new Set(o.changedMemory),
      activeStages,
      // Kept so nothing that reads the old placeholder names breaks.
      hazards: o.events.filter((e) => e.kind === 'forward'),
      stalls: o.events.filter((e) => e.kind === 'stall'),
    };
  }

  const PipelineSimulator = { simulate, decode, alu, MULT_CYCLES, DIV_CYCLES };

  if (typeof window !== 'undefined') {
    window.PipelineSimulator = PipelineSimulator;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.PipelineSimulator = PipelineSimulator;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PipelineSimulator;
  }
})();
