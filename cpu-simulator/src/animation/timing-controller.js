/**
 * TimingController - Manages playback speed and delta-time calculation
 *
 * Provides framerate-independent animation timing with configurable speed multipliers.
 * Uses delta-time accumulation to prevent frame drift on variable refresh rate displays.
 *
 * Key features:
 * - Speed range: 0.25x (quarter speed) to 4x (quadruple speed)
 * - Base FPS: 2 (educational pace for CPU pipeline visualization)
 * - Delta-time tracking prevents drift on 60Hz/120Hz/144Hz monitors
 * - Named speed presets for UI convenience
 */

(function() {
  'use strict';

  class TimingController {
    constructor() {
      // Base frames per second for educational CPU simulation
      // 2 FPS = 500ms per frame at 1x speed (time to observe each pipeline state)
      this.baseFPS = 2;

      // Current speed multiplier
      this.speed = 1.0;

      // Speed constraints
      this.minSpeed = 0.25;  // Quarter speed for detailed observation
      this.maxSpeed = 4.0;   // 4x speed for rapid demonstration

      // Named speed presets for UI
      this.speedPresets = {
        slow: 0.5,
        normal: 1.0,
        fast: 2.0,
        fastest: 4.0
      };

      // Timestamp tracking for delta-time calculation
      this.lastFrameTime = null;
    }

    /**
     * Set playback speed with clamping to valid range
     * @param {number} multiplier - Speed multiplier (will be clamped to [minSpeed, maxSpeed])
     * @returns {number} - Actual speed set (after clamping)
     */
    setSpeed(multiplier) {
      // Clamp to valid range
      this.speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, multiplier));
      return this.speed;
    }

    /**
     * Calculate frame interval in milliseconds based on current speed
     * @returns {number} - Milliseconds between frames
     *
     * Examples:
     * - baseFPS=2, speed=1.0: 500ms (1000 / 2 / 1.0)
     * - baseFPS=2, speed=2.0: 250ms (1000 / 2 / 2.0)
     * - baseFPS=2, speed=0.5: 1000ms (1000 / 2 / 0.5)
     */
    getFrameInterval() {
      return (1000 / this.baseFPS) / this.speed;
    }

    /**
     * Check if enough time has passed to advance to next frame
     * Uses delta-time accumulation to prevent drift
     *
     * @param {number} currentTime - Current timestamp from performance.now() or rAF
     * @returns {boolean} - True if frame should advance
     */
    shouldAdvanceFrame(currentTime) {
      // Initialize on first call
      if (this.lastFrameTime === null) {
        this.lastFrameTime = currentTime;
        return false;
      }

      const deltaTime = currentTime - this.lastFrameTime;
      const frameInterval = this.getFrameInterval();

      // Check if enough time has passed
      if (deltaTime >= frameInterval) {
        // Update lastFrameTime with leftover accumulation to prevent drift
        // If deltaTime=520ms and frameInterval=500ms, carry forward 20ms
        this.lastFrameTime = currentTime - (deltaTime % frameInterval);
        return true;
      }

      return false;
    }

    /**
     * Reset timing state - call when starting or resuming playback
     */
    reset() {
      this.lastFrameTime = performance.now();
    }

    /**
     * Get human-readable speed label
     * @returns {string} - Speed label like "1x", "0.5x", "2x", "4x"
     */
    getSpeedLabel() {
      // Format with 'x' suffix, show decimals only if not whole number
      const speedValue = this.speed % 1 === 0 ? this.speed.toString() : this.speed.toFixed(2);
      return `${speedValue}x`;
    }

    /**
     * Apply a named speed preset
     * @param {string} presetName - One of: slow, normal, fast, fastest
     * @returns {boolean} - True if preset was applied, false if name invalid
     */
    applyPreset(presetName) {
      if (this.speedPresets.hasOwnProperty(presetName)) {
        this.setSpeed(this.speedPresets[presetName]);
        return true;
      }
      return false;
    }
  }

  // Export to window
  window.TimingController = TimingController;
})();
