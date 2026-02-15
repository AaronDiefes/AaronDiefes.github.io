/**
 * ProgramSelector - UI component for switching between pre-scripted programs
 *
 * Manages program selection and frame generation:
 * - Dropdown menu populated from CPU_PROGRAMS registry
 * - Generates frame sequence via SequenceGenerator
 * - Loads frames into AnimationEngine
 * - Displays program description
 * - Callback mechanism for coordinating with other UI components
 *
 * This component is a thin wrapper that orchestrates program loading but does
 * NOT directly manage other UI components (uses callback pattern instead).
 *
 * Requires: AnimationEngine, SequenceGenerator, CPU_PROGRAMS (or fallback to BASIC_PROGRAM/FIBONACCI_PROGRAM)
 */
(function() {
  'use strict';

  class ProgramSelector {
    /**
     * Create a program selector
     * @param {HTMLElement} container - DOM element to render selector into
     * @param {AnimationEngine} engine - AnimationEngine instance to load frames into
     * @param {Object} options - Optional configuration
     * @param {Function} options.onProgramLoad - Callback(program, result) called after program loads
     * @param {string} options.defaultProgram - Default program key (default: 'basic')
     */
    constructor(container, engine, options = {}) {
      if (!container || !engine) {
        throw new Error('ProgramSelector requires container and engine');
      }

      this.container = container;
      this.engine = engine;
      this.onProgramLoad = options.onProgramLoad || null;
      this.defaultProgram = options.defaultProgram || 'basic';

      // Build programs map from global CPU_PROGRAMS or fallback
      this.programs = window.CPU_PROGRAMS || {
        basic: window.BASIC_PROGRAM,
        fibonacci: window.FIBONACCI_PROGRAM
      };

      // Track current program
      this.currentProgramKey = null;

      // Build DOM structure
      this._createSelector();

      // Load default program
      this._loadProgram(this.defaultProgram);
    }

    /**
     * Build HTML structure for program selector
     * Creates dropdown with program options and description display
     */
    _createSelector() {
      // Build program selector HTML
      const html = `
        <div class="program-selector">
          <label for="program-select">Program:</label>
          <select class="program-select" aria-label="Select program">
            <!-- Options will be populated by JavaScript -->
          </select>
          <p class="program-description"></p>
        </div>
      `;

      this.container.innerHTML = html;

      // Cache references
      this.selectElement = this.container.querySelector('.program-select');
      this.descriptionElement = this.container.querySelector('.program-description');

      // Populate select options from programs map
      for (const [key, program] of Object.entries(this.programs)) {
        if (program && program.name) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = program.name;
          this.selectElement.appendChild(option);
        }
      }

      // Wire up change handler
      this.selectElement.addEventListener('change', (e) => {
        this._loadProgram(e.target.value);
      });
    }

    /**
     * Load a program by key
     * @param {string} programKey - Key from programs map
     */
    _loadProgram(programKey) {
      // Get program from registry
      const program = this.programs[programKey];

      if (!program) {
        console.error(`ProgramSelector: Program not found: ${programKey}`);
        return;
      }

      // Validate program has instructions
      if (!program.instructions || !Array.isArray(program.instructions)) {
        console.error(`ProgramSelector: Invalid program structure: ${programKey}`);
        return;
      }

      try {
        // Generate frame sequence
        const result = window.SequenceGenerator.generateSequence(program.instructions);

        // Load frames into engine
        this.engine.loadFrames(result.frames);

        // Update description
        this.descriptionElement.textContent = program.description || '';

        // Update select to reflect current program
        this.selectElement.value = programKey;
        this.currentProgramKey = programKey;

        // Call onProgramLoad callback if provided
        if (typeof this.onProgramLoad === 'function') {
          this.onProgramLoad(program, result);
        }

        // Log success
        console.log(`Loaded: ${program.name} (${result.frames.length} frames)`);

      } catch (error) {
        console.error(`ProgramSelector: Failed to load program ${programKey}:`, error);
      }
    }

    /**
     * Get current program object
     * @returns {Object|null} - Current program or null if none loaded
     */
    getCurrentProgram() {
      return this.currentProgramKey ? this.programs[this.currentProgramKey] : null;
    }

    /**
     * Get current program key
     * @returns {string|null} - Current program key or null if none loaded
     */
    getCurrentProgramKey() {
      return this.currentProgramKey;
    }
  }

  // Export to global scope
  window.ProgramSelector = ProgramSelector;
})();
