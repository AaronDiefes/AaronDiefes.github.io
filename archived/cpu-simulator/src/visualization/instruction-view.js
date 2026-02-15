/**
 * InstructionView - Current instruction field breakdown visualization
 *
 * Renders the current instruction's mnemonic, active stage, and decoded fields
 * (opcode, rs, rt, rd, immediate). Shows instruction comment if present.
 *
 * Usage:
 *   const view = new InstructionView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  class InstructionView {
    /**
     * Creates an InstructionView instance
     * @param {HTMLElement} container - DOM element to render instruction breakdown into
     */
    constructor(container) {
      this.container = container;
      this.initializeView();
    }

    /**
     * Creates the instruction view structure
     */
    initializeView() {
      this.container.className = 'instruction-view';

      // Add heading
      const heading = document.createElement('h3');
      heading.textContent = 'Current Instruction';
      this.container.appendChild(heading);

      // Create instruction display container
      const display = document.createElement('div');
      display.className = 'instruction-display';
      this.container.appendChild(display);
    }

    /**
     * Determines which pipeline stage is currently active
     * Priority: WB > MEM > EX > ID > IF
     * @param {object} pipeline - Pipeline state from CPUState
     * @returns {string|null} Active stage name or null if none active
     * @private
     */
    _getActiveStage(pipeline) {
      const stages = ['WB', 'MEM', 'EX', 'ID', 'IF'];
      for (const stage of stages) {
        if (pipeline[stage]?.active) {
          return stage;
        }
      }
      return null;
    }

    /**
     * Renders the current instruction state
     * @param {CPUState} state - Current CPU state with pipeline data
     */
    render(state) {
      const display = this.container.querySelector('.instruction-display');

      // Determine active stage
      const activeStage = this._getActiveStage(state.pipeline);

      // Get current instruction (always from IF.instruction in non-pipelined mode)
      const instruction = state.pipeline.IF.instruction;

      // If no instruction or no active stage, show placeholder
      if (!instruction || !activeStage) {
        display.innerHTML = `
          <div class="instruction-placeholder">No instruction active</div>
        `;
        return;
      }

      // Get instruction definition from InstructionSet
      const definition = window.InstructionSet.get(instruction.mnemonic);
      if (!definition) {
        display.innerHTML = `
          <div class="instruction-placeholder">Unknown instruction</div>
        `;
        return;
      }

      // Build instruction display HTML
      let html = '';

      // Mnemonic with stage label
      html += `
        <div class="instruction-mnemonic">
          <span class="field-name">Instruction:</span>
          <span class="value">${instruction.mnemonic} (${activeStage} stage)</span>
        </div>
      `;

      // Instruction fields
      html += '<div class="instruction-fields">';

      // Opcode (always shown)
      html += `
        <div class="field">
          <span class="field-name">Opcode:</span>
          <span class="field-value">${instruction.mnemonic}</span>
        </div>
      `;

      // rs (if instruction has this field)
      if (definition.fields.rs) {
        html += `
          <div class="field">
            <span class="field-name">rs:</span>
            <span class="field-value">$${instruction.rs}</span>
          </div>
        `;
      }

      // rt (if instruction has this field)
      if (definition.fields.rt) {
        html += `
          <div class="field">
            <span class="field-name">rt:</span>
            <span class="field-value">$${instruction.rt}</span>
          </div>
        `;
      }

      // rd (if instruction has this field)
      if (definition.fields.rd) {
        html += `
          <div class="field">
            <span class="field-name">rd:</span>
            <span class="field-value">$${instruction.rd}</span>
          </div>
        `;
      }

      // immediate (if instruction has this field)
      if (definition.fields.immediate) {
        const immValue = instruction.immediate;
        const immHex = '0x' + (immValue >>> 0).toString(16).padStart(8, '0').toUpperCase();
        html += `
          <div class="field">
            <span class="field-name">Immediate:</span>
            <span class="field-value">${immValue} (${immHex})</span>
          </div>
        `;
      }

      html += '</div>'; // Close instruction-fields

      // Comment (if present)
      if (instruction.comment) {
        html += `
          <div class="instruction-comment">
            <span class="field-name">Comment:</span>
            <span class="value">${instruction.comment}</span>
          </div>
        `;
      }

      display.innerHTML = html;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.InstructionView = InstructionView;
  } else if (typeof global !== 'undefined') {
    global.InstructionView = InstructionView;
  }
})();
