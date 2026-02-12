/**
 * CPUVisualizer - Coordinator component for CPU visualization
 *
 * Single entry point that:
 * - Creates the complete visualization DOM structure
 * - Initializes child view components (PipelineView, RegisterView, ExecutionView)
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
      this.pipelineView = new PipelineView(
        this.container.querySelector('[data-pipeline-view]')
      );
      this.registerView = new RegisterView(
        this.container.querySelector('[data-register-view]')
      );
      this.executionView = new ExecutionView(
        this.container.querySelector('[data-execution-view]')
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
        <section class="pipeline-section">
          <h2>Pipeline Stages</h2>
          <div class="pipeline-stages" data-pipeline-view></div>
        </section>
        <aside class="data-section">
          <section class="registers-section">
            <h2>Registers</h2>
            <div class="register-grid" data-register-view></div>
          </section>
          <section class="execution-section">
            <h2>Execution State</h2>
            <div data-execution-view aria-live="polite">
              <p>Cycle: <span data-cycle-count>0</span></p>
              <p>Instructions: <span data-instruction-count>0</span></p>
            </div>
          </section>
        </aside>
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
      this.pipelineView.render(state);
      this.registerView.render(state);
      this.executionView.render(state);
    }

    /**
     * Cleans up event listeners and DOM
     * Call this when removing the visualizer
     */
    destroy() {
      window.removeEventListener('cpu:framechange', this._handleFrameChange);
      this.container.innerHTML = '';
      this.pipelineView = null;
      this.registerView = null;
      this.executionView = null;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.CPUVisualizer = CPUVisualizer;
  } else if (typeof global !== 'undefined') {
    global.CPUVisualizer = CPUVisualizer;
  }
})();
