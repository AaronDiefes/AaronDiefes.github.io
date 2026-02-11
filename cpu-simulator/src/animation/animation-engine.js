/**
 * AnimationEngine - Frame-based animation playback controller
 *
 * Generic animation engine that manages an array of frame objects and provides:
 * - Navigation: stepForward, stepBackward, jumpToFrame
 * - Playback: play, pause, reset with requestAnimationFrame
 * - Speed control: via TimingController (0.25x to 4x)
 * - Events: CustomEvent 'cpu:framechange' on every frame change
 * - Visibility handling: auto-pause when tab hidden
 *
 * Design: Decoupled from CPU state - works with any array of frame objects.
 * This allows independent testing and potential reuse for other animations.
 */

(function() {
  'use strict';

  class AnimationEngine {
    constructor() {
      // Frame data and state
      this.frames = [];
      this.currentFrame = 0;
      this.isPlaying = false;

      // Timing controller for speed-adjusted playback
      this.timing = new window.TimingController();

      // RequestAnimationFrame tracking
      this.rafId = null;

      // Optional callback (alternative to events)
      this.onFrameChange = null;

      // Track visibility-based pausing
      this._pausedByVisibility = false;

      // Set up visibility change handler
      this._setupVisibilityHandler();
    }

    /**
     * Set up document visibility change handler
     * Prevents requestAnimationFrame throttling when tab is hidden
     */
    _setupVisibilityHandler() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // Tab became hidden - pause if playing
          if (this.isPlaying) {
            this.pause();
            this._pausedByVisibility = true;
          }
        } else {
          // Tab became visible - resume if was auto-paused
          if (this._pausedByVisibility) {
            this.play();
            this._pausedByVisibility = false;
          }
        }
      });
    }

    // ========== FRAME LOADING ==========

    /**
     * Load frame array for playback
     * @param {Array} framesArray - Array of frame objects (any structure)
     */
    loadFrames(framesArray) {
      // Validate input
      if (!Array.isArray(framesArray)) {
        framesArray = [];
      }

      // Pause playback and reset position
      this.pause();
      this.frames = framesArray;
      this.currentFrame = 0;

      // Dispatch frame change event
      this._dispatchFrameChange();
    }

    // ========== NAVIGATION METHODS ==========

    /**
     * Advance to next frame
     * @returns {boolean} - True if moved, false if already at end
     */
    stepForward() {
      if (this.currentFrame < this.frames.length - 1) {
        this.currentFrame++;
        this._dispatchFrameChange();
        return true;
      }
      return false;
    }

    /**
     * Go back to previous frame
     * @returns {boolean} - True if moved, false if already at start
     */
    stepBackward() {
      if (this.currentFrame > 0) {
        this.currentFrame--;
        this._dispatchFrameChange();
        return true;
      }
      return false;
    }

    /**
     * Jump to specific frame by index
     * @param {number} index - Target frame index (0-based)
     * @returns {boolean} - True if moved, false if index out of range
     */
    jumpToFrame(index) {
      if (index >= 0 && index < this.frames.length) {
        this.currentFrame = index;
        this._dispatchFrameChange();
        return true;
      }
      return false;
    }

    /**
     * Get current frame object
     * @returns {Object|undefined} - Current frame data
     */
    getCurrentState() {
      return this.frames[this.currentFrame];
    }

    /**
     * Get playback progress information
     * @returns {Object} - { current, total, percent }
     */
    getProgress() {
      const total = this.frames.length;
      const current = this.currentFrame;
      // Prevent division by zero; if only 1 frame, progress is 0%
      const percent = total > 1
        ? (current / (total - 1)) * 100
        : 0;

      return {
        current,
        total,
        percent
      };
    }

    // ========== PLAYBACK METHODS ==========

    /**
     * Start automatic frame advancement
     */
    play() {
      // Don't start if already playing or no frames loaded
      if (this.isPlaying || this.frames.length === 0) {
        return;
      }

      // If at end, reset to beginning
      if (this.isAtEnd()) {
        this.currentFrame = 0;
        this._dispatchFrameChange();
      }

      this.isPlaying = true;
      this.timing.reset();
      this._animate(performance.now());
    }

    /**
     * Stop automatic frame advancement
     */
    pause() {
      this.isPlaying = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    /**
     * Toggle between play and pause
     */
    togglePlayPause() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    /**
     * Stop playback and return to first frame
     */
    reset() {
      this.pause();
      this.currentFrame = 0;
      this._dispatchFrameChange();
    }

    /**
     * Check if at first frame
     * @returns {boolean}
     */
    isAtStart() {
      return this.currentFrame === 0;
    }

    /**
     * Check if at last frame
     * @returns {boolean}
     */
    isAtEnd() {
      return this.currentFrame >= this.frames.length - 1;
    }

    // ========== SPEED CONTROL ==========

    /**
     * Set playback speed
     * @param {number} multiplier - Speed multiplier (0.25x to 4x)
     * @returns {number} - Actual speed set (after clamping)
     */
    setSpeed(multiplier) {
      return this.timing.setSpeed(multiplier);
    }

    /**
     * Get current playback speed
     * @returns {number} - Speed multiplier
     */
    getSpeed() {
      return this.timing.speed;
    }

    /**
     * Get human-readable speed label
     * @returns {string} - Speed label like "1x", "2x"
     */
    getSpeedLabel() {
      return this.timing.getSpeedLabel();
    }

    // ========== PRIVATE METHODS ==========

    /**
     * RequestAnimationFrame loop for automatic playback
     * @param {number} currentTime - High-resolution timestamp
     */
    _animate(currentTime) {
      // Exit if playback stopped
      if (!this.isPlaying) {
        return;
      }

      // Check if enough time has passed for next frame
      if (this.timing.shouldAdvanceFrame(currentTime)) {
        const moved = this.stepForward();

        // If reached end, stop playback
        if (!moved && this.isAtEnd()) {
          this.pause();
          return;
        }
      }

      // Schedule next frame
      this.rafId = requestAnimationFrame((t) => this._animate(t));
    }

    /**
     * Dispatch frame change event and call callback
     */
    _dispatchFrameChange() {
      const detail = {
        frame: this.currentFrame,
        state: this.frames[this.currentFrame],
        totalFrames: this.frames.length,
        isPlaying: this.isPlaying
      };

      // Dispatch CustomEvent
      const event = new CustomEvent('cpu:framechange', { detail });
      window.dispatchEvent(event);

      // Call optional callback
      if (typeof this.onFrameChange === 'function') {
        this.onFrameChange(detail);
      }
    }
  }

  // Export to window
  window.AnimationEngine = AnimationEngine;
})();
