/**
 * CPUVisualizer - Coordinator component for CPU visualization
 *
 * Single entry point that:
 * - Creates the complete visualization DOM structure
 * - Initializes child view components (BlockDiagramView, RegisterView, MemoryView, InstructionView)
 * - Listens to 'cpu:framechange' events from AnimationEngine
 * - Delegates rendering to child components
 *
 * This is the only component that needs to be instantiated by the UI.
 * Child views are managed internally.
 *
 * Usage:
 *   const container = document.getElementById('cpu-viz-container');
 *   const visualizer = new CPUVisualizer(container);
 *   // Rendering happens automatically via cpu:framechange events
 *   // Or manually: visualizer.render(cpuState);
 */
(function() {
  'use strict';

  class CPUVisualizer {
    /**
     * Creates a CPUVisualizer instance
     * @param {HTMLElement} container - DOM element to render visualization into
     */
    constructor(container) {
      this.container = container;
      this.container.className = 'cpu-visualizer';

      // Build the DOM structure
      this._createDOM();

      // The block diagram is rendered by the React PipelineDiagram component
      // mounted separately (CPUSimulatorPage.jsx). The vanilla coordinator
      // only owns the caption + register/memory/instruction views now.
      this.blockDiagramView = null;
      this.registerView = new RegisterView(
        this.container.querySelector('[data-register-view]')
      );
      this.memoryView = new MemoryView(
        this.container.querySelector('[data-memory-view]')
      );
      this.instructionView = new InstructionView(
        this.container.querySelector('[data-instruction-view]')
      );

      // Bind and register event listener for AnimationEngine events
      this._handleFrameChange = this._handleFrameChange.bind(this);
      window.addEventListener('cpu:framechange', this._handleFrameChange);
    }

    /**
     * Creates the visualization DOM structure inside the container
     * @private
     */
    _createDOM() {
      this.container.innerHTML = `
        <div class="cpu-caption" data-caption>
          <em>Press Play or Step to begin execution.</em>
        </div>
        <section class="info-section">
          <div class="info-panels">
            <section class="registers-section">
              <h2>Registers</h2>
              <div class="register-grid" data-register-view></div>
            </section>
            <section class="memory-section">
              <div data-memory-view></div>
            </section>
            <section class="instruction-detail-section">
              <div data-instruction-view></div>
            </section>
          </div>
        </section>
      `;
    }

    /**
     * Handles cpu:framechange events from AnimationEngine
     * @param {CustomEvent} event - Event with detail.state (CPUState)
     * @private
     */
    _handleFrameChange(event) {
      if (event.detail && event.detail.state) {
        this.render(event.detail.state);
      }
    }

    /**
     * Renders the current CPU state to all child views
     * Can be called manually or automatically via events
     * @param {CPUState} state - Current CPU state to render
     */
    render(state) {
      this.registerView.render(state);
      this.memoryView.render(state);
      this.instructionView.render(state);
      this._renderCaption(state);
    }

    /**
     * Updates the narration strip below the diagram with a one-line
     * description of what the active pipeline stage is doing this cycle.
     * Reads stage-specific fields from state.pipeline.{stage} and falls back
     * to an idle message when no stage is active.
     * @param {CPUState} state
     * @private
     */
    _renderCaption(state) {
      const captionEl = this.container.querySelector('[data-caption]');
      if (!captionEl) return;

      const { html, stage } = this._buildCaptionHTML(state);
      captionEl.innerHTML = html;
      if (stage) {
        captionEl.setAttribute('data-active-stage', stage);
      } else {
        captionEl.removeAttribute('data-active-stage');
      }
    }

    /**
     * Builds the caption HTML for the current state. Returns {html, stage}
     * where stage is the active stage name (used for color theming) or null.
     * @param {CPUState} state
     * @returns {{html: string, stage: string|null}}
     * @private
     */
    _buildCaptionHTML(state) {
      const pipeline = state.pipeline;
      const order = ['IF', 'ID', 'EX', 'MEM', 'WB'];
      let active = null;
      for (const s of order) {
        if (pipeline[s]?.active) active = s;
      }
      if (!active) {
        return { html: '<em>Press Play or Step to begin execution.</em>', stage: null };
      }

      const tag = (label) =>
        `<span class="cpu-caption-stage">${label}</span>`;
      const code = (text) => `<code>${text}</code>`;
      const hex = (n) => '0x' + (n >>> 0).toString(16).padStart(4, '0');

      const inst = pipeline.IF.instruction;
      const mnemonic = inst && inst.mnemonic !== 'NOP' ? inst.mnemonic : null;

      switch (active) {
        case 'IF': {
          if (!mnemonic) {
            return { html: `${tag('IF')} Fetching next instruction from instruction memory.`, stage: 'IF' };
          }
          return {
            html: `${tag('IF')} Fetching ${code(mnemonic)} from instruction memory at PC=${code(hex(pipeline.IF.pc))}.`,
            stage: 'IF',
          };
        }
        case 'ID': {
          const id = pipeline.ID;
          return {
            html: `${tag('ID')} Decoding ${code(mnemonic || '—')}. Reading ${code('$' + id.rs)} = ${id.rsVal}, ${code('$' + id.rt)} = ${id.rtVal}.`,
            stage: 'ID',
          };
        }
        case 'EX': {
          return {
            html: `${tag('EX')} ALU computes ${code(mnemonic || '—')} → ${pipeline.EX.aluResult}.`,
            stage: 'EX',
          };
        }
        case 'MEM': {
          const mem = pipeline.MEM;
          if (mem.memRead) {
            return {
              html: `${tag('MEM')} Loading from data memory at address ${code(hex(pipeline.EX.aluResult))}.`,
              stage: 'MEM',
            };
          }
          if (mem.memWrite) {
            return {
              html: `${tag('MEM')} Storing ${mem.writeData} to data memory at address ${code(hex(pipeline.EX.aluResult))}.`,
              stage: 'MEM',
            };
          }
          return { html: `${tag('MEM')} No memory access this cycle (pass-through).`, stage: 'MEM' };
        }
        case 'WB': {
          const wb = pipeline.WB;
          if (!wb.regWrite || wb.writeReg === 0) {
            return { html: `${tag('WB')} No register write this cycle.`, stage: 'WB' };
          }
          return {
            html: `${tag('WB')} Writing ${wb.writeData} → ${code('$' + wb.writeReg)} in the register file.`,
            stage: 'WB',
          };
        }
        default:
          return { html: '', stage: null };
      }
    }

    /**
     * Cleans up event listeners and DOM
     * Call this when removing the visualizer
     */
    destroy() {
      window.removeEventListener('cpu:framechange', this._handleFrameChange);
      this.container.innerHTML = '';
      this.registerView = null;
      this.memoryView = null;
      this.instructionView = null;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.CPUVisualizer = CPUVisualizer;
  } else if (typeof global !== 'undefined') {
    global.CPUVisualizer = CPUVisualizer;
  }
})();
