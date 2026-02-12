/**
 * PipelineView - 5-stage pipeline visualization component
 *
 * Renders IF, ID, EX, MEM, WB pipeline stages with color-coded borders.
 * Displays instruction mnemonic + formatted operands for active stages.
 * Shows 'NOP' for inactive stages.
 *
 * Usage:
 *   const view = new PipelineView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  class PipelineView {
    /**
     * Creates a PipelineView instance
     * @param {HTMLElement} container - DOM element to render pipeline stages into
     */
    constructor(container) {
      this.container = container;
      this.stageElements = new Map();  // Fast stage lookup
      this.initializeStages();
    }

    /**
     * Creates the 5 pipeline stage cards in the DOM
     * Uses DocumentFragment for efficient batch insertion
     */
    initializeStages() {
      const stageNames = ['IF', 'ID', 'EX', 'MEM', 'WB'];
      const fullNames = {
        IF: 'Instruction Fetch',
        ID: 'Instruction Decode',
        EX: 'Execute',
        MEM: 'Memory Access',
        WB: 'Write Back'
      };

      const fragment = document.createDocumentFragment();

      stageNames.forEach(stageName => {
        const stageCard = document.createElement('div');
        stageCard.className = 'pipeline-stage';
        stageCard.dataset.stage = stageName;

        stageCard.innerHTML = `
          <div class="stage-header">
            <span class="stage-label">${stageName}</span>
            <span class="stage-name">${fullNames[stageName]}</span>
          </div>
          <div class="stage-content">
            <code class="instruction-text" data-stage-instruction>NOP</code>
          </div>
        `;

        this.stageElements.set(stageName, stageCard);
        fragment.appendChild(stageCard);
      });

      // Single DOM insertion for all stages
      this.container.appendChild(fragment);
    }

    /**
     * Renders the current pipeline state
     * @param {CPUState} state - Current CPU state with pipeline data
     */
    render(state) {
      const stageNames = ['IF', 'ID', 'EX', 'MEM', 'WB'];

      stageNames.forEach(stageName => {
        const stageData = state.pipeline[stageName];
        const stageCard = this.stageElements.get(stageName);
        const instructionEl = stageCard.querySelector('[data-stage-instruction]');

        if (stageData.active) {
          // Get instruction from IF stage (in non-pipelined mode, the instruction flows through all stages)
          // IF and ID stages store the instruction directly
          const instruction = state.pipeline.IF.instruction;

          if (instruction) {
            const displayText = `${instruction.mnemonic} ${this.formatOperands(instruction)}`.trim();
            instructionEl.textContent = displayText;
          } else {
            instructionEl.textContent = 'NOP';
          }

          stageCard.classList.add('active');
        } else {
          instructionEl.textContent = 'NOP';
          stageCard.classList.remove('active');
        }
      });
    }

    /**
     * Formats instruction operands for assembly-style display
     * @param {object} instruction - Instruction object with mnemonic, type, and operand fields
     * @returns {string} Formatted operand string
     * @private
     */
    formatOperands(instruction) {
      if (!instruction || instruction.mnemonic === 'NOP') {
        return '';
      }

      const { type, rs, rt, rd, immediate } = instruction;

      switch (type) {
        case 'R':
          // R-type: ADD $rd, $rs, $rt
          return `$${rd}, $${rs}, $${rt}`;

        case 'I':
          if (instruction.mnemonic === 'ADDI') {
            // ADDI $rt, $rs, imm
            return `$${rt}, $${rs}, ${immediate}`;
          } else if (instruction.mnemonic === 'LW') {
            // LW $rt, imm($rs)
            return `$${rt}, ${immediate}($${rs})`;
          }
          break;

        case 'S':
          // SW $rt, imm($rs)
          return `$${rt}, ${immediate}($${rs})`;

        case 'B':
          // BEQ $rs, $rt, offset
          return `$${rs}, $${rt}, ${immediate}`;

        case 'J':
          // J target
          return `${immediate}`;

        case 'NOP':
          return '';

        default:
          return '';
      }

      return '';
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.PipelineView = PipelineView;
  } else if (typeof global !== 'undefined') {
    global.PipelineView = PipelineView;
  }
})();
