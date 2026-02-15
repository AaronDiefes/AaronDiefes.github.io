/**
 * InstructionList - Clickable program instruction list with jump-to-frame navigation
 *
 * Renders program instructions as an ordered list. Clicking an instruction jumps
 * animation to that instruction's first IF frame. Active instruction highlighted
 * during playback. Auto-scrolls to active instruction when paused.
 *
 * Usage:
 *   const list = new InstructionList(containerElement, animationEngine);
 *   list.loadProgram(program, frameSequence);
 */
(function() {
  'use strict';

  class InstructionList {
    /**
     * Creates an InstructionList instance
     * @param {HTMLElement} container - DOM element to render instruction list into
     * @param {AnimationEngine} engine - AnimationEngine instance for jump-to-frame navigation
     */
    constructor(container, engine) {
      this.container = container;
      this.engine = engine;
      this.instructions = [];
      this.instructionToFrameMap = new Map();  // instruction index -> first IF frame index
      this.initializeView();
      this._setupEventListeners();
    }

    /**
     * Creates the instruction list structure
     */
    initializeView() {
      this.container.className = 'instruction-list-container';

      // Add heading
      const heading = document.createElement('h3');
      heading.textContent = 'Program Instructions';
      this.container.appendChild(heading);

      // Create ordered list (will be populated by loadProgram)
      const ol = document.createElement('ol');
      ol.className = 'instruction-list';
      this.container.appendChild(ol);
    }

    /**
     * Set up event listeners for frame changes
     * @private
     */
    _setupEventListeners() {
      // Listen for frame change events to update active instruction
      window.addEventListener('cpu:framechange', () => {
        this._updateCurrentInstruction();
      });
    }

    /**
     * Loads a program and builds instruction-to-frame mapping
     * @param {object} program - Program object with instructions array
     * @param {object} frameSequence - Frame sequence with frames array
     */
    loadProgram(program, frameSequence) {
      // Store program instructions
      this.instructions = program.instructions || [];

      // Build instruction-to-frame map
      // Map each instruction index to its first IF frame
      this.instructionToFrameMap.clear();

      frameSequence.frames.forEach((frame, frameIndex) => {
        if (frame.pipeline?.IF?.active) {
          const pc = frame.pipeline.IF.pc;
          const instructionIndex = pc / 4;  // Convert byte address to instruction index

          // Only record the first IF frame for each instruction
          if (!this.instructionToFrameMap.has(instructionIndex)) {
            this.instructionToFrameMap.set(instructionIndex, frameIndex);
          }
        }
      });

      // Render the instruction list
      this._renderInstructions();
    }

    /**
     * Renders the instruction list HTML
     * @private
     */
    _renderInstructions() {
      const ol = this.container.querySelector('.instruction-list');

      if (this.instructions.length === 0) {
        ol.innerHTML = '<li class="empty-state">No instructions loaded</li>';
        return;
      }

      let html = '';
      this.instructions.forEach((instruction, index) => {
        const hasFrameMapping = this.instructionToFrameMap.has(index);
        const tabindex = hasFrameMapping ? '0' : '';
        const clickableClass = hasFrameMapping ? ' clickable' : '';

        html += `
          <li class="instruction-item${clickableClass}"
              data-instruction-index="${index}"
              ${tabindex ? `tabindex="${tabindex}"` : ''}>
            <span class="inst-mnemonic">${instruction.mnemonic}</span>
            <span class="inst-operands">${this._formatOperands(instruction)}</span>
            ${instruction.comment ? `<span class="inst-comment">// ${instruction.comment}</span>` : ''}
          </li>
        `;
      });

      ol.innerHTML = html;

      // Wire click and keyboard handlers
      this._wireHandlers();
    }

    /**
     * Wires click and keyboard handlers to instruction items
     * @private
     */
    _wireHandlers() {
      const items = this.container.querySelectorAll('.instruction-item.clickable');

      items.forEach(item => {
        const instructionIndex = parseInt(item.dataset.instructionIndex, 10);
        const frameIndex = this.instructionToFrameMap.get(instructionIndex);

        if (frameIndex !== undefined) {
          // Click handler
          item.addEventListener('click', () => {
            this.engine.jumpToFrame(frameIndex);
          });

          // Keyboard handler (Enter or Space)
          item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();  // Prevent page scroll on Space
              this.engine.jumpToFrame(frameIndex);
            }
          });
        }
      });
    }

    /**
     * Formats instruction operands for display
     * @param {object} instruction - Instruction object
     * @returns {string} Formatted operands string
     * @private
     */
    _formatOperands(instruction) {
      const { type, mnemonic, rs, rt, rd, immediate } = instruction;

      switch (type) {
        case 'R':
          // R-type: ADD $rd, $rs, $rt
          return `$${rd}, $${rs}, $${rt}`;

        case 'I':
          if (mnemonic === 'ADDI') {
            // ADDI $rt, $rs, imm
            return `$${rt}, $${rs}, ${immediate}`;
          } else if (mnemonic === 'LW') {
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

    /**
     * Updates which instruction is currently active
     * Called on 'cpu:framechange' event
     * @private
     */
    _updateCurrentInstruction() {
      const state = this.engine.getCurrentState();
      if (!state) return;

      // Determine current instruction from IF stage PC
      const currentPC = state.pipeline?.IF?.pc;
      if (currentPC === undefined) return;

      const currentInstructionIndex = currentPC / 4;

      // Remove 'active' class from all items
      const items = this.container.querySelectorAll('.instruction-item');
      items.forEach(item => item.classList.remove('active'));

      // Add 'active' class to current instruction
      const currentItem = this.container.querySelector(
        `.instruction-item[data-instruction-index="${currentInstructionIndex}"]`
      );

      if (currentItem) {
        currentItem.classList.add('active');

        // Auto-scroll into view only when engine is NOT playing
        // (avoid scroll jank during playback)
        if (!this.engine.isPlaying) {
          currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.InstructionList = InstructionList;
  } else if (typeof global !== 'undefined') {
    global.InstructionList = InstructionList;
  }
})();
