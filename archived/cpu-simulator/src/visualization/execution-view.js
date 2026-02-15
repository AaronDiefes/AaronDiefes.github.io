/**
 * ExecutionView - Cycle and instruction counter display
 *
 * Displays execution metrics from CPUState:
 * - cycleCount: Total clock cycles executed
 * - instructionCount: Total instructions completed (written back)
 *
 * The container element should have aria-live="polite" for screen reader announcements
 * (set by parent CPUVisualizer in Plan 02).
 *
 * Usage:
 *   const view = new ExecutionView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  class ExecutionView {
    /**
     * Creates an ExecutionView instance
     * @param {HTMLElement} container - DOM element to render execution counters into
     */
    constructor(container) {
      this.container = container;
      this.initializeElements();
    }

    /**
     * Creates or queries the counter span elements
     * If container doesn't have the expected structure, creates it
     */
    initializeElements() {
      // Check if elements already exist
      this.cycleEl = this.container.querySelector('[data-cycle-count]');
      this.instructionEl = this.container.querySelector('[data-instruction-count]');

      // Create structure if elements don't exist
      if (!this.cycleEl || !this.instructionEl) {
        this.container.innerHTML = `
          <p>Cycle: <span data-cycle-count>0</span></p>
          <p>Instructions: <span data-instruction-count>0</span></p>
        `;

        // Re-query the newly created elements
        this.cycleEl = this.container.querySelector('[data-cycle-count]');
        this.instructionEl = this.container.querySelector('[data-instruction-count]');
      }
    }

    /**
     * Renders the current execution state
     * @param {CPUState} state - Current CPU state with cycleCount and instructionCount
     */
    render(state) {
      this.cycleEl.textContent = state.cycleCount;
      this.instructionEl.textContent = state.instructionCount;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.ExecutionView = ExecutionView;
  } else if (typeof global !== 'undefined') {
    global.ExecutionView = ExecutionView;
  }
})();
