/**
 * MemoryView - Data memory visualization component
 *
 * Renders a table of non-zero data memory addresses with hex and decimal values.
 * Highlights recently changed memory addresses with CSS 'changed' class.
 *
 * Usage:
 *   const view = new MemoryView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  class MemoryView {
    /**
     * Creates a MemoryView instance
     * @param {HTMLElement} container - DOM element to render memory table into
     */
    constructor(container) {
      this.container = container;
      this._previousChanged = [];  // Track previous frame's changes for cleanup
      this.initializeView();
    }

    /**
     * Creates the memory view structure
     */
    initializeView() {
      this.container.className = 'memory-view';

      // Add heading
      const heading = document.createElement('h3');
      heading.textContent = 'Data Memory';
      this.container.appendChild(heading);

      // Create scrollable table container
      const tableContainer = document.createElement('div');
      tableContainer.className = 'memory-table-container';

      // Create table structure
      const table = document.createElement('table');
      table.className = 'memory-table';

      // Table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Address</th>
          <th>Hex Value</th>
          <th>Decimal</th>
        </tr>
      `;
      table.appendChild(thead);

      // Table body (will be populated by render)
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);

      tableContainer.appendChild(table);
      this.container.appendChild(tableContainer);
    }

    /**
     * Formats a 32-bit value as hexadecimal with 0x prefix
     * @param {number} value - Value to format
     * @returns {string} Formatted hex string (e.g., "0x0000001E")
     * @private
     */
    _formatHex32(value) {
      return '0x' + (value >>> 0).toString(16).padStart(8, '0').toUpperCase();
    }

    /**
     * Renders the current memory state
     * Shows only non-zero memory addresses
     * @param {CPUState} state - Current CPU state with memory and changedMemory
     */
    render(state) {
      const tbody = this.container.querySelector('tbody');

      // Find all non-zero memory addresses
      const nonZeroAddresses = [];
      for (let wordIndex = 0; wordIndex < state.memory.length; wordIndex++) {
        if (state.memory[wordIndex] !== 0) {
          const byteAddress = wordIndex * 4;
          nonZeroAddresses.push({
            byteAddress,
            wordIndex,
            value: state.memory[wordIndex]
          });
        }
      }

      // If no non-zero addresses, show empty state
      if (nonZeroAddresses.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="empty-state">No memory addresses in use</td>
          </tr>
        `;
        return;
      }

      // Build table rows for non-zero addresses
      let rowsHTML = '';
      nonZeroAddresses.forEach(({ byteAddress, wordIndex, value }) => {
        const isChanged = state.changedMemory.has(byteAddress);
        const changedClass = isChanged ? ' changed' : '';

        rowsHTML += `
          <tr class="memory-row${changedClass}" data-address="${byteAddress}">
            <td class="memory-address">${this._formatHex32(byteAddress)}</td>
            <td class="memory-value">${this._formatHex32(value)}</td>
            <td class="memory-decimal">${value}</td>
          </tr>
        `;
      });

      tbody.innerHTML = rowsHTML;
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.MemoryView = MemoryView;
  } else if (typeof global !== 'undefined') {
    global.MemoryView = MemoryView;
  }
})();
