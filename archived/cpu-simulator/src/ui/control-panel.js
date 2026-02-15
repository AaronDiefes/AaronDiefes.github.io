/**
 * ControlPanel - UI wrapper for AnimationEngine playback controls
 *
 * Provides accessible HTML controls for frame-by-frame navigation and playback:
 * - Step forward/backward buttons
 * - Play/pause toggle button
 * - Reset to start button
 * - Speed selector (0.25x to 4x)
 * - Frame counter with aria-live announcements
 *
 * This component is a thin wrapper over AnimationEngine, delegating all
 * logic to the engine and updating UI state via cpu:framechange events.
 *
 * Requires: AnimationEngine
 */
(function() {
  'use strict';

  class ControlPanel {
    /**
     * Create a control panel for an AnimationEngine
     * @param {HTMLElement} container - DOM element to render controls into
     * @param {AnimationEngine} engine - AnimationEngine instance to control
     */
    constructor(container, engine) {
      if (!container || !engine) {
        throw new Error('ControlPanel requires container and engine');
      }

      this.container = container;
      this.engine = engine;

      // Build DOM structure
      this._createControls();

      // Listen for frame changes to update button states
      this._frameChangeHandler = this._updateButtonStates.bind(this);
      window.addEventListener('cpu:framechange', this._frameChangeHandler);

      // Initialize button states
      this._updateButtonStates();
    }

    /**
     * Build HTML structure for control panel
     * Creates buttons, speed selector, and frame status display
     */
    _createControls() {
      // Build control panel HTML
      const html = `
        <div class="control-panel">
          <div class="control-group playback-controls">
            <button class="btn-reset" aria-label="Reset to start" title="Reset (R)">Reset</button>
            <button class="btn-step-back" aria-label="Step backward" title="Step Back (Left Arrow)">Step Back</button>
            <button class="btn-play-pause" aria-label="Play" title="Play/Pause (Space)">Play</button>
            <button class="btn-step-forward" aria-label="Step forward" title="Step Forward (Right Arrow)">Step Fwd</button>
          </div>
          <div class="control-group speed-controls">
            <label for="speed-select">Speed:</label>
            <select id="speed-select" aria-label="Playback speed">
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1" selected>1x</option>
              <option value="2">2x</option>
              <option value="4">4x</option>
            </select>
          </div>
          <div class="control-group status-display">
            <span class="frame-status" aria-live="polite">Frame 0 of 0</span>
          </div>
        </div>
      `;

      this.container.innerHTML = html;

      // Cache button references (using querySelector with class selectors to avoid ID collisions)
      this.resetBtn = this.container.querySelector('.btn-reset');
      this.stepBackBtn = this.container.querySelector('.btn-step-back');
      this.playPauseBtn = this.container.querySelector('.btn-play-pause');
      this.stepForwardBtn = this.container.querySelector('.btn-step-forward');
      this.speedSelect = this.container.querySelector('#speed-select');
      this.frameStatus = this.container.querySelector('.frame-status');

      // Wire up button click handlers
      this.resetBtn.addEventListener('click', () => this.engine.reset());
      this.stepBackBtn.addEventListener('click', () => this.engine.stepBackward());
      this.playPauseBtn.addEventListener('click', () => this.engine.togglePlayPause());
      this.stepForwardBtn.addEventListener('click', () => this.engine.stepForward());
      this.speedSelect.addEventListener('change', (e) => {
        this.engine.setSpeed(parseFloat(e.target.value));
      });
    }

    /**
     * Update button states based on current engine state
     * - Disables step buttons at boundaries
     * - Updates play/pause button text and aria-label
     * - Updates frame counter display
     */
    _updateButtonStates() {
      const progress = this.engine.getProgress();

      // Update play/pause button
      if (this.engine.isPlaying) {
        this.playPauseBtn.textContent = 'Pause';
        this.playPauseBtn.setAttribute('aria-label', 'Pause');
      } else {
        this.playPauseBtn.textContent = 'Play';
        this.playPauseBtn.setAttribute('aria-label', 'Play');
      }

      // Disable step buttons at boundaries
      this.stepBackBtn.disabled = this.engine.isAtStart();
      this.stepForwardBtn.disabled = this.engine.isAtEnd();

      // Update frame status
      if (progress.total === 0) {
        this.frameStatus.textContent = 'No frames loaded';
      } else {
        this.frameStatus.textContent = `Frame ${progress.current} of ${progress.total - 1}`;
      }
    }

    /**
     * Clean up event listeners and DOM
     */
    destroy() {
      // Remove event listener
      window.removeEventListener('cpu:framechange', this._frameChangeHandler);

      // Clear container
      this.container.innerHTML = '';
    }
  }

  // Export to global scope
  window.ControlPanel = ControlPanel;
})();
