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

      // Initialize child view components
      this.blockDiagramView = new BlockDiagramView(
        this.container.querySelector('[data-block-diagram]')
      );
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
        <section class="diagram-section">
          <div data-block-diagram></div>
        </section>
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
      this.blockDiagramView.render(state);
      this.registerView.render(state);
      this.memoryView.render(state);
      this.instructionView.render(state);
    }

    /**
     * Cleans up event listeners and DOM
     * Call this when removing the visualizer
     */
    destroy() {
      window.removeEventListener('cpu:framechange', this._handleFrameChange);
      this.container.innerHTML = '';
      this.blockDiagramView = null;
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
