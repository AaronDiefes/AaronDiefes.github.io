/**
 * CPUState - Core data structure for CPU simulation
 *
 * Represents the complete state of a pipelined RISC CPU including:
 * - 5 pipeline stages (IF, ID, EX, MEM, WB)
 * - 32 general-purpose registers (register $0 hardwired to zero)
 * - 256-word data memory
 * - Program counter and cycle counters
 * - Visualization metadata for animation framework
 *
 * This class is the foundational unit of the animation system.
 * Every animation frame is a complete, immutable CPUState snapshot.
 */
(function() {
  'use strict';

  class CPUState {
    constructor() {
      // Pipeline stages with stage-specific fields
      this.pipeline = {
        IF: {
          instruction: null,
          pc: 0,
          active: false
        },
        ID: {
          instruction: null,
          opcode: '',
          rs: 0,
          rt: 0,
          rd: 0,
          imm: 0,
          rsVal: 0,
          rtVal: 0,
          active: false
        },
        EX: {
          aluResult: 0,
          writeData: 0,
          writeReg: 0,
          zero: false,
          active: false
        },
        MEM: {
          memData: 0,
          writeData: 0,
          writeReg: 0,
          memRead: false,
          memWrite: false,
          active: false
        },
        WB: {
          writeData: 0,
          writeReg: 0,
          regWrite: false,
          active: false
        }
      };

      // Registers: 32 general-purpose registers (Uint32Array for 32-bit unsigned)
      // Register $0 is hardwired to zero
      this.registers = new Uint32Array(32);

      // Memory: 256-word data memory (1KB for demo purposes)
      this.memory = new Uint32Array(256);

      // Control state
      this.pc = 0;  // Program counter (word-aligned, increments by 4)
      this.cycleCount = 0;  // Total clock cycles executed
      this.instructionCount = 0;  // Total instructions completed (written back)

      // Visualization metadata (for Phase 10+ animation)
      this.changedRegisters = new Set();  // Which registers changed this cycle
      this.changedMemory = new Set();  // Which memory addresses changed this cycle
      this.activeStages = new Set();  // Which pipeline stages are active this cycle
      this.hazards = [];  // Active hazards (forward compatibility for Phase 12)
      this.stalls = [];  // Active stalls (forward compatibility for Phase 12)
    }

    /**
     * Creates a fresh CPUState with all defaults
     * @returns {CPUState} A new CPUState instance
     */
    static createInitial() {
      const state = new CPUState();
      // Explicitly ensure register $0 is zero
      state.registers[0] = 0;
      return state;
    }

    /**
     * Creates a deep copy of this state
     * Uses structuredClone for complete independence
     * @returns {CPUState} A deep copy of this state
     */
    clone() {
      // structuredClone handles typed arrays and Sets natively
      const cloned = structuredClone(this);

      // Restore prototype chain (structuredClone creates plain objects)
      Object.setPrototypeOf(cloned, CPUState.prototype);

      // structuredClone handles Sets correctly, but ensure they're Sets not arrays
      if (Array.isArray(cloned.changedRegisters)) {
        cloned.changedRegisters = new Set(cloned.changedRegisters);
      }
      if (Array.isArray(cloned.changedMemory)) {
        cloned.changedMemory = new Set(cloned.changedMemory);
      }
      if (Array.isArray(cloned.activeStages)) {
        cloned.activeStages = new Set(cloned.activeStages);
      }

      return cloned;
    }

    /**
     * Gets a register value
     * Register $0 always returns 0
     * @param {number} index - Register index (0-31)
     * @returns {number} Register value
     */
    getRegister(index) {
      if (index === 0) {
        return 0;  // Register $0 is hardwired to zero
      }
      return this.registers[index];
    }

    /**
     * Sets a register value
     * Register $0 writes are ignored (hardwired to zero)
     * @param {number} index - Register index (0-31)
     * @param {number} value - Value to set
     */
    setRegister(index, value) {
      if (index === 0) {
        return;  // Cannot write to register $0
      }

      // Track change only if value actually changed
      const oldValue = this.registers[index];
      if (oldValue !== value) {
        this.registers[index] = value >>> 0;  // Ensure 32-bit unsigned
        this.changedRegisters.add(index);
      }
    }

    /**
     * Gets a word from memory
     * @param {number} address - Byte address (must be word-aligned)
     * @returns {number} Memory value
     */
    getMemory(address) {
      const wordIndex = address >> 2;  // Convert byte address to word index
      return this.memory[wordIndex];
    }

    /**
     * Sets a word in memory
     * @param {number} address - Byte address (must be word-aligned)
     * @param {number} value - Value to set
     */
    setMemory(address, value) {
      const wordIndex = address >> 2;  // Convert byte address to word index

      // Track change only if value actually changed
      const oldValue = this.memory[wordIndex];
      if (oldValue !== value) {
        this.memory[wordIndex] = value >>> 0;  // Ensure 32-bit unsigned
        this.changedMemory.add(address);
      }
    }
  }

  // Export to global scope (no module bundler - vanilla JS)
  if (typeof window !== 'undefined') {
    window.CPUState = CPUState;
  } else if (typeof global !== 'undefined') {
    global.CPUState = CPUState;
  }
})();
