/**
 * AutoplayHandler - Manages autoplay functionality
 */
class AutoplayHandler {
  constructor(eventManager, config, onAutoplayTick) {
    this.eventManager = eventManager;
    this.config = config;
    this.onAutoplayTick = onAutoplayTick;

    this.isPlaying = false;
    this.autoplayInterval = null;
    this.resumeTimer = null;
    this.isPaused = false;
  }

  /**
   * Start autoplay
   */
  play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isPaused = false;

    this.eventManager.emit('autoplayStart');

    // Start autoplay ticker
    this.autoplayInterval = setInterval(() => {
      if (this.onAutoplayTick) {
        this.onAutoplayTick();
      }
      this.eventManager.emit('autoplayTick');
    }, this.config.autoplayInterval);
  }

  /**
   * Pause autoplay
   */
  pause() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.isPaused = true;

    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }

    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }

    this.eventManager.emit('autoplayPause');
  }

  /**
   * Temporarily pause and schedule resume
   * @param {number} delay - Delay before resume (ms)
   */
  pauseTemporarily(delay = null) {
    if (!this.isPlaying && !this.isTemporarilyPaused()) return;

    if (this.isPlaying) {
      this.pause();
    }

    // Bug Fix 2: If we are already temporarily paused, clear the old timer so the new one extends it.
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }

    delay = delay || this.config.autoplayResumeDelay;

    // Schedule resume
    this.resumeTimer = setTimeout(() => {
      this.resumeTimer = null;
      this.play();
    }, delay);

    this.eventManager.emit('autoplayPausedTemporarily', { delay });
  }

  /**
   * Resume autoplay if paused
   */
  resume() {
    if (this.isPlaying || !this.config.autoplay) return;

    this.play();
  }

  /**
   * Check if autoplay is currently playing
   * @returns {boolean}
   */
  isAutoplayActive() {
    return this.isPlaying;
  }

  /**
   * Check if autoplay is paused
   * @returns {boolean}
   */
  isAutoplayPaused() {
    return this.isPaused;
  }

  /**
   * Check if autoplay is temporarily paused waiting to resume
   * @returns {boolean}
   */
  isTemporarilyPaused() {
    return this.resumeTimer !== null;
  }

  /**
   * Destroy handler
   */
  destroy() {
    this.pause();

    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }

    this.onAutoplayTick = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoplayHandler;
}
