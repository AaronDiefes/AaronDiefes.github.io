/**
 * InstructionSet - RISC instruction definitions for CPU simulation
 *
 * Defines 8 core RISC instructions with their types, field mappings, and execute functions.
 * Instruction types: R (register), I (immediate), S (store), B (branch), J (jump)
 *
 * Instructions:
 * - ADD, SUB (R-type)
 * - ADDI, LW (I-type)
 * - SW (S-type)
 * - BEQ (B-type)
 * - J (J-type)
 * - NOP (special)
 */
(function() {
  'use strict';

  /**
   * Instruction definitions with execute functions
   * Execute functions compute results but do NOT mutate state
   */
  const INSTRUCTIONS = {
    ADD: {
      mnemonic: 'ADD',
      type: 'R',
      description: 'Add two registers',
      fields: {
        rs: true,   // Source register 1
        rt: true,   // Source register 2
        rd: true,   // Destination register
        immediate: false
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const rtVal = state.getRegister(instruction.rt);
        const result = (rsVal + rtVal) >>> 0;  // 32-bit unsigned wrapping
        return {
          aluResult: result,
          writeReg: instruction.rd,
          writeData: result
        };
      }
    },

    SUB: {
      mnemonic: 'SUB',
      type: 'R',
      description: 'Subtract two registers',
      fields: {
        rs: true,
        rt: true,
        rd: true,
        immediate: false
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const rtVal = state.getRegister(instruction.rt);
        const result = (rsVal - rtVal) >>> 0;  // 32-bit unsigned wrapping
        return {
          aluResult: result,
          writeReg: instruction.rd,
          writeData: result
        };
      }
    },

    ADDI: {
      mnemonic: 'ADDI',
      type: 'I',
      description: 'Add immediate to register',
      fields: {
        rs: true,
        rt: true,   // ADDI writes to rt (not rd) in MIPS
        rd: false,
        immediate: true
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const result = (rsVal + instruction.immediate) >>> 0;  // 32-bit unsigned wrapping
        return {
          aluResult: result,
          writeReg: instruction.rt,
          writeData: result
        };
      }
    },

    LW: {
      mnemonic: 'LW',
      type: 'I',
      description: 'Load word from memory',
      fields: {
        rs: true,   // Base address register
        rt: true,   // Destination register
        rd: false,
        immediate: true  // Offset
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const address = (rsVal + instruction.immediate) >>> 0;
        return {
          aluResult: address,
          writeReg: instruction.rt,
          memRead: true
        };
      }
    },

    SW: {
      mnemonic: 'SW',
      type: 'S',
      description: 'Store word to memory',
      fields: {
        rs: true,   // Base address register
        rt: true,   // Source data register
        rd: false,
        immediate: true  // Offset
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const rtVal = state.getRegister(instruction.rt);
        const address = (rsVal + instruction.immediate) >>> 0;
        return {
          aluResult: address,
          writeData: rtVal,
          memWrite: true
        };
      }
    },

    BEQ: {
      mnemonic: 'BEQ',
      type: 'B',
      description: 'Branch if equal',
      fields: {
        rs: true,
        rt: true,
        rd: false,
        immediate: true  // Branch offset (in instructions, not bytes)
      },
      execute: function(state, instruction) {
        const rsVal = state.getRegister(instruction.rs);
        const rtVal = state.getRegister(instruction.rt);
        const zero = (rsVal === rtVal);
        const branchTarget = (state.pc + instruction.immediate * 4) >>> 0;
        return {
          zero: zero,
          branchTarget: branchTarget
        };
      }
    },

    J: {
      mnemonic: 'J',
      type: 'J',
      description: 'Jump to address',
      fields: {
        rs: false,
        rt: false,
        rd: false,
        immediate: true  // Jump target (word address)
      },
      execute: function(state, instruction) {
        const jumpTarget = (instruction.immediate * 4) >>> 0;
        return {
          jumpTarget: jumpTarget
        };
      }
    },

    NOP: {
      mnemonic: 'NOP',
      type: 'NOP',
      description: 'No operation',
      fields: {
        rs: false,
        rt: false,
        rd: false,
        immediate: false
      },
      execute: function(state, instruction) {
        return {};  // No effect
      }
    }
  };

  /**
   * InstructionSet class with helper methods
   */
  class InstructionSet {
    /**
     * Gets instruction definition by mnemonic
     * @param {string} mnemonic - Instruction mnemonic (e.g., 'ADD')
     * @returns {object|null} Instruction definition or null if not found
     */
    static get(mnemonic) {
      return INSTRUCTIONS[mnemonic.toUpperCase()] || null;
    }

    /**
     * Checks if instruction is a memory instruction
     * @param {string} mnemonic - Instruction mnemonic
     * @returns {boolean} True if LW or SW
     */
    static isMemoryInstruction(mnemonic) {
      const upper = mnemonic.toUpperCase();
      return upper === 'LW' || upper === 'SW';
    }

    /**
     * Checks if instruction is a branch/jump instruction
     * @param {string} mnemonic - Instruction mnemonic
     * @returns {boolean} True if BEQ or J
     */
    static isBranch(mnemonic) {
      const upper = mnemonic.toUpperCase();
      return upper === 'BEQ' || upper === 'J';
    }

    /**
     * Checks if instruction writes to a register
     * @param {string} mnemonic - Instruction mnemonic
     * @returns {boolean} True if instruction writes back to register file
     */
    static writesToRegister(mnemonic) {
      const upper = mnemonic.toUpperCase();
      // ADD, SUB, ADDI, LW write to registers
      // SW, BEQ, J, NOP do not
      return upper === 'ADD' || upper === 'SUB' || upper === 'ADDI' || upper === 'LW';
    }

    /**
     * Creates a concrete instruction object from mnemonic and field values
     * @param {string} mnemonic - Instruction mnemonic
     * @param {object} fields - Field values { rs, rt, rd, immediate }
     * @returns {object} Concrete instruction object
     */
    static createInstruction(mnemonic, fields = {}) {
      const def = InstructionSet.get(mnemonic);
      if (!def) {
        throw new Error(`Unknown instruction: ${mnemonic}`);
      }

      return {
        mnemonic: def.mnemonic,
        type: def.type,
        rs: fields.rs || 0,
        rt: fields.rt || 0,
        rd: fields.rd || 0,
        immediate: fields.immediate || 0
      };
    }

    /**
     * Gets all instruction mnemonics
     * @returns {string[]} Array of instruction mnemonics
     */
    static getAllMnemonics() {
      return Object.keys(INSTRUCTIONS);
    }

    /**
     * Gets all instruction definitions
     * @returns {object} Map of mnemonic -> definition
     */
    static getAll() {
      return { ...INSTRUCTIONS };
    }
  }

  // Export to global scope (no module bundler - vanilla JS)
  if (typeof window !== 'undefined') {
    window.InstructionSet = InstructionSet;
  } else if (typeof global !== 'undefined') {
    global.InstructionSet = InstructionSet;
  }
})();
