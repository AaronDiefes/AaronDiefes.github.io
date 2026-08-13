/**
 * RegisterView - 32-register grid visualization with change highlighting
 *
 * Renders 32 general-purpose registers ($0-$31) in a responsive grid.
 * Selectively updates only changed registers per frame for performance.
 * Applies CSS 'changed' class with yellow highlight for modified registers.
 * Register $0 shown with reduced opacity (hardwired to zero).
 *
 * Usage:
 *   const view = new RegisterView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  class RegisterView {
    /**
     * Creates a RegisterView instance
     * @param {HTMLElement} container - DOM element to render register grid into
     */
    constructor(container) {
      this.container = container;
      this.registerCells = [];  // Array of 32 DOM elements for O(1) access
      this._previousChanged = [];  // Track previous frame's changes for cleanup
      this._initialized = false;  // Track first render for full update
      this.initializeRegisters();
    }

    /**
     * Creates the 32 register cells in the DOM
     * Uses DocumentFragment for efficient batch insertion
     */
    initializeRegisters() {
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < 32; i++) {
        const cell = document.createElement('div');
        cell.className = 'register-cell';
        cell.dataset.register = i;

        cell.innerHTML = `
          <span class="register-label">$${i}</span>
          <span class="register-value">0x00000000</span>
        `;

        this.registerCells.push(cell);
        fragment.appendChild(cell);
      }

      // Single DOM insertion for all register cells
      this.container.appendChild(fragment);
    }

    /**
     * Renders the current register state
     * Selectively updates only changed registers (not all 32)
     * @param {CPUState} state - Current CPU state with registers and changedRegisters
     */
    render(state) {
      // First render: update all register values
      if (!this._initialized) {
        for (let i = 0; i < 32; i++) {
          const cell = this.registerCells[i];
          const valueEl = cell.querySelector('.register-value');
          const value = state.registers[i];
          valueEl.textContent = '0x' + value.toString(16).toUpperCase().padStart(8, '0');
        }
        this._initialized = true;
        return;
      }

      // Remove 'changed' class from previous frame's highlighted registers
      this._previousChanged.forEach(index => {
        this.registerCells[index].classList.remove('changed');
      });

      // Convert Set to Array for iteration
      const changed = Array.from(state.changedRegisters || []);

      // Update only changed registers
      changed.forEach(index => {
        // Defensive: register $0 should never change due to setRegister protection
        // but handle it gracefully if it somehow appears in changedRegisters
        const cell = this.registerCells[index];
        const valueEl = cell.querySelector('.register-value');
        const value = index === 0 ? 0 : state.registers[index];

        valueEl.textContent = '0x' + value.toString(16).toUpperCase().padStart(8, '0');
        cell.classList.add('changed');
      });

      // Store for cleanup on next render
      this._previousChanged = changed;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.RegisterView = RegisterView;
  } else if (typeof global !== 'undefined') {
    global.RegisterView = RegisterView;
  }
})();
