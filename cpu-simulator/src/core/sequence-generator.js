/**
 * SequenceGenerator - Generates animation frame sequences from instruction lists
 *
 * Produces an array of CPUState snapshots representing the frame-by-frame execution
 * of a RISC instruction sequence. Each instruction generates 5 frames (one per
 * pipeline stage: IF, ID, EX, MEM, WB) for a NON-PIPELINED simulation.
 *
 * Non-pipelined execution: Each instruction completes all 5 stages before the next
 * begins. This is Phase 9 behavior for educational clarity. Pipelined execution
 * (multiple instructions overlapping in different stages) is Phase 12.
 *
 * Requires: CPUState, InstructionSet
 */
(function() {
  'use strict';

  class SequenceGenerator {
    /**
     * Generates a sequence of CPUState frames from an instruction array
     *
     * @param {Array} instructions - Array of instruction objects from InstructionSet.createInstruction()
     * @param {CPUState|null} initialState - Optional initial CPU state (default: fresh state)
     * @returns {object} { frames: CPUState[], instructions: instruction[], metadata: { totalCycles, totalInstructions } }
     */
    static generateSequence(instructions, initialState = null) {
      // Create or use initial state
      const state = initialState ? initialState.clone() : CPUState.createInitial();
      const frames = [];

      // Frame 0: Initial state
      frames.push(state.clone());

      // Process instructions following control flow (not just array order)
      // Instructions are assumed to be at PC = index * 4 (word-aligned)
      let currentState = state.clone();
      let executedCount = 0;
      const maxInstructions = instructions.length * 3;  // Safety limit to prevent infinite loops

      while (executedCount < maxInstructions) {
        // Determine which instruction to execute based on current PC
        const instructionIndex = currentState.pc / 4;

        // Check if PC is out of bounds (beyond instruction array)
        if (instructionIndex < 0 || instructionIndex >= instructions.length || instructionIndex !== Math.floor(instructionIndex)) {
          // PC is out of bounds or misaligned - stop execution
          break;
        }

        const instruction = instructions[instructionIndex];
        const instructionDef = InstructionSet.get(instruction.mnemonic);

        if (!instructionDef) {
          console.error(`Unknown instruction: ${instruction.mnemonic}`);
          break;
        }

        executedCount++;

        // --- IF Stage (Instruction Fetch) ---
        const ifFrame = currentState.clone();
        ifFrame.changedRegisters.clear();
        ifFrame.changedMemory.clear();
        ifFrame.activeStages.clear();

        ifFrame.pipeline.IF.instruction = instruction;
        ifFrame.pipeline.IF.pc = ifFrame.pc;
        ifFrame.pipeline.IF.active = true;
        ifFrame.activeStages.add('IF');

        // Clear other stages
        ifFrame.pipeline.ID.active = false;
        ifFrame.pipeline.EX.active = false;
        ifFrame.pipeline.MEM.active = false;
        ifFrame.pipeline.WB.active = false;

        ifFrame.cycleCount++;
        frames.push(ifFrame);

        // --- ID Stage (Instruction Decode) ---
        const idFrame = frames[frames.length - 1].clone();
        idFrame.changedRegisters.clear();
        idFrame.changedMemory.clear();
        idFrame.activeStages.clear();

        idFrame.pipeline.ID.instruction = instruction;
        idFrame.pipeline.ID.opcode = instruction.mnemonic;
        idFrame.pipeline.ID.rs = instruction.rs || 0;
        idFrame.pipeline.ID.rt = instruction.rt || 0;
        idFrame.pipeline.ID.rd = instruction.rd || instruction.rt || 0;  // For I-type, rd = rt
        idFrame.pipeline.ID.imm = instruction.immediate || 0;

        // Read register values
        idFrame.pipeline.ID.rsVal = idFrame.getRegister(instruction.rs || 0);
        idFrame.pipeline.ID.rtVal = idFrame.getRegister(instruction.rt || 0);

        idFrame.pipeline.ID.active = true;
        idFrame.activeStages.add('ID');
        idFrame.pipeline.IF.active = false;

        idFrame.cycleCount++;
        frames.push(idFrame);

        // --- EX Stage (Execute) ---
        const exFrame = frames[frames.length - 1].clone();
        exFrame.changedRegisters.clear();
        exFrame.changedMemory.clear();
        exFrame.activeStages.clear();

        // Call execute function to get ALU results
        const executeResult = instructionDef.execute(exFrame, instruction);

        // Store results in EX stage
        exFrame.pipeline.EX.aluResult = executeResult.aluResult || 0;
        exFrame.pipeline.EX.writeData = executeResult.writeData || 0;
        exFrame.pipeline.EX.writeReg = executeResult.writeReg || 0;
        exFrame.pipeline.EX.zero = executeResult.zero || false;
        exFrame.pipeline.EX.branchTarget = executeResult.branchTarget || 0;
        exFrame.pipeline.EX.jumpTarget = executeResult.jumpTarget || 0;
        exFrame.pipeline.EX.memRead = executeResult.memRead || false;
        exFrame.pipeline.EX.memWrite = executeResult.memWrite || false;

        exFrame.pipeline.EX.active = true;
        exFrame.activeStages.add('EX');
        exFrame.pipeline.ID.active = false;

        exFrame.cycleCount++;
        frames.push(exFrame);

        // --- MEM Stage (Memory Access) ---
        const memFrame = frames[frames.length - 1].clone();
        memFrame.changedRegisters.clear();
        memFrame.changedMemory.clear();
        memFrame.activeStages.clear();

        // Copy EX results to MEM stage
        memFrame.pipeline.MEM.writeData = memFrame.pipeline.EX.writeData;
        memFrame.pipeline.MEM.writeReg = memFrame.pipeline.EX.writeReg;
        memFrame.pipeline.MEM.memRead = false;
        memFrame.pipeline.MEM.memWrite = false;

        // Handle memory operations
        if (instruction.mnemonic === 'LW') {
          // Load word: read from memory
          const address = memFrame.pipeline.EX.aluResult;
          const memValue = memFrame.getMemory(address);
          memFrame.pipeline.MEM.memData = memValue;
          memFrame.pipeline.MEM.memRead = true;
          memFrame.pipeline.MEM.writeData = memValue;  // Data to write back in WB
        } else if (instruction.mnemonic === 'SW') {
          // Store word: write to memory
          const address = memFrame.pipeline.EX.aluResult;
          const writeData = memFrame.pipeline.ID.rtVal;  // rt contains the data to store
          memFrame.setMemory(address, writeData);
          memFrame.pipeline.MEM.memWrite = true;
        } else {
          // Non-memory instruction: just pass through write data
          memFrame.pipeline.MEM.memData = 0;
        }

        memFrame.pipeline.MEM.active = true;
        memFrame.activeStages.add('MEM');
        memFrame.pipeline.EX.active = false;

        memFrame.cycleCount++;
        frames.push(memFrame);

        // --- WB Stage (Write Back) ---
        const wbFrame = frames[frames.length - 1].clone();
        wbFrame.changedRegisters.clear();
        wbFrame.changedMemory.clear();
        wbFrame.activeStages.clear();

        wbFrame.pipeline.WB.regWrite = false;

        // Write back to register if instruction writes to registers
        if (InstructionSet.writesToRegister(instruction.mnemonic)) {
          const writeReg = wbFrame.pipeline.MEM.writeReg;
          const writeData = wbFrame.pipeline.MEM.writeData;

          wbFrame.setRegister(writeReg, writeData);
          wbFrame.pipeline.WB.regWrite = true;
          wbFrame.pipeline.WB.writeReg = writeReg;
          wbFrame.pipeline.WB.writeData = writeData;
        }

        // Update PC
        if (instruction.mnemonic === 'BEQ') {
          // Branch: if zero flag is set, take branch
          if (wbFrame.pipeline.EX.zero) {
            wbFrame.pc = wbFrame.pipeline.EX.branchTarget;
          } else {
            wbFrame.pc += 4;  // Normal PC increment
          }
        } else if (instruction.mnemonic === 'J') {
          // Jump: unconditional jump to target
          wbFrame.pc = wbFrame.pipeline.EX.jumpTarget;
        } else {
          // Normal instruction: PC += 4
          wbFrame.pc += 4;
        }

        wbFrame.pipeline.WB.active = true;
        wbFrame.activeStages.add('WB');
        wbFrame.pipeline.MEM.active = false;

        wbFrame.cycleCount++;
        wbFrame.instructionCount++;

        frames.push(wbFrame);

        // Update currentState for next iteration (reflects PC changes from branches/jumps)
        currentState = wbFrame.clone();
      }

      // Return complete frame sequence with metadata
      return {
        frames: frames,
        instructions: instructions,
        metadata: {
          totalCycles: frames[frames.length - 1].cycleCount,
          totalInstructions: frames[frames.length - 1].instructionCount
        }
      };
    }

    /**
     * Generates a sequence asynchronously with progress callbacks
     * Useful for longer programs (Phase 11+) to avoid blocking UI
     *
     * @param {Array} instructions - Array of instruction objects
     * @param {CPUState|null} initialState - Optional initial CPU state
     * @param {Function} onProgress - Optional progress callback (percent)
     * @returns {Promise<object>} Resolves to { frames, instructions, metadata }
     */
    static generateSequenceAsync(instructions, initialState = null, onProgress = null) {
      return new Promise((resolve) => {
        const chunkSize = 10;  // Process 10 instructions at a time
        let currentIndex = 0;
        const allFrames = [];

        // Initial state
        const state = initialState ? initialState.clone() : CPUState.createInitial();
        allFrames.push(state.clone());

        function processChunk() {
          const endIndex = Math.min(currentIndex + chunkSize, instructions.length);
          const chunk = instructions.slice(currentIndex, endIndex);

          // Process this chunk synchronously
          const chunkResult = SequenceGenerator.generateSequence(
            chunk,
            allFrames[allFrames.length - 1]
          );

          // Append new frames (skip first frame which is duplicate of last)
          allFrames.push(...chunkResult.frames.slice(1));

          currentIndex = endIndex;

          // Report progress
          if (onProgress) {
            const percent = Math.round((currentIndex / instructions.length) * 100);
            onProgress(percent);
          }

          // Continue or finish
          if (currentIndex < instructions.length) {
            setTimeout(processChunk, 0);  // Yield to browser
          } else {
            // Done
            resolve({
              frames: allFrames,
              instructions: instructions,
              metadata: {
                totalCycles: allFrames[allFrames.length - 1].cycleCount,
                totalInstructions: allFrames[allFrames.length - 1].instructionCount
              }
            });
          }
        }

        // Start processing
        setTimeout(processChunk, 0);
      });
    }
  }

  // Export to global scope (no module bundler - vanilla JS)
  if (typeof window !== 'undefined') {
    window.SequenceGenerator = SequenceGenerator;
  } else if (typeof global !== 'undefined') {
    global.SequenceGenerator = SequenceGenerator;
  }
})();
