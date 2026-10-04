/** Explicit playback intent is independent from temporary suspension. */
class AutoplayHandler {
  constructor(eventManager, config, onAutoplayTick) {
    Object.assign(this, { eventManager, config, onAutoplayTick,
      isPlaying: false, isPaused: false, wantsPlayback: false,
      autoplayInterval: null, resumeTimer: null, destroyed: false });
    this.suspensions = new Set();
  }
  startTicker() {
    if (this.destroyed || this.isPlaying || !this.wantsPlayback || this.suspensions.size || this.resumeTimer !== null) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.autoplayInterval = setInterval(() => {
      if (this.destroyed || !this.isPlaying) return;
      this.onAutoplayTick?.();
      if (!this.destroyed) this.eventManager.emit('autoplayTick');
    }, this.config.autoplayInterval);
    this.eventManager.emit('autoplayStart');
  }
  stopTicker() {
    if (this.autoplayInterval !== null) clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
    const wasPlaying = this.isPlaying;
    this.isPlaying = false;
    if (wasPlaying) this.eventManager.emit('autoplayPause');
  }
  clearResume() {
    if (this.resumeTimer !== null) clearTimeout(this.resumeTimer);
    this.resumeTimer = null;
  }
  play() {
    if (this.destroyed) return;
    this.wantsPlayback = true;
    this.isPaused = false;
    this.clearResume();
    this.startTicker();
  }
  pause() {
    this.wantsPlayback = false;
    this.isPaused = true;
    this.clearResume();
    this.stopTicker();
  }
  pauseTemporarily(delay = null) {
    if (this.destroyed || !this.wantsPlayback) return;
    this.clearResume();
    this.stopTicker();
    if (this.destroyed || !this.wantsPlayback) return;
    const duration = delay ?? this.config.autoplayResumeDelay;
    this.resumeTimer = setTimeout(() => {
      this.resumeTimer = null;
      this.startTicker();
    }, duration);
    this.eventManager.emit('autoplayPausedTemporarily', { delay: duration });
  }
  setSuspended(reason, suspended) {
    if (this.destroyed) return;
    if (suspended) { this.suspensions.add(reason); this.stopTicker(); }
    else { this.suspensions.delete(reason); this.startTicker(); }
  }
  resume() { if (this.wantsPlayback) this.startTicker(); }
  isAutoplayActive() { return this.isPlaying; }
  isAutoplayPaused() { return this.isPaused; }
  isTemporarilyPaused() { return this.resumeTimer !== null; }
  destroy() {
    this.destroyed = true;
    this.pause();
    this.suspensions.clear();
    this.onAutoplayTick = null;
  }
}
module.exports = AutoplayHandler;
