const { isControl, ownsEvent } = require('./Interaction');
class WheelHandler {
  constructor(element, eventManager, config, onWheel) {
    Object.assign(this, { element, eventManager, config, onWheel, isHandlerEnabled: false, lastWheelTime: -Infinity, wheelThrottle: 500 });
    this.boundWheel = this.handleWheel.bind(this);
  }
  enable() {
    if (!this.config.enableWheel || this.isHandlerEnabled) return;
    this.isHandlerEnabled = true;
    this.element.addEventListener('wheel', this.boundWheel, { passive: false });
  }
  disable() {
    if (!this.isHandlerEnabled) return;
    this.isHandlerEnabled = false;
    this.element.removeEventListener('wheel', this.boundWheel);
  }
  handleWheel(event) {
    if (!this.isHandlerEnabled || event.ctrlKey || event.metaKey || !event.deltaY ||
      Math.abs(event.deltaX) >= Math.abs(event.deltaY) || isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    const now = Date.now();
    if (now - this.lastWheelTime < this.wheelThrottle) { if (event.cancelable) event.preventDefault(); return; }
    this.lastWheelTime = now;
    if (event.cancelable) event.preventDefault();
    const direction = event.deltaY > 0 ? 'down' : 'up';
    this.eventManager.emit('wheelDetected', { direction, deltaY: event.deltaY });
    this.onWheel?.(direction);
  }
  destroy() { this.disable(); this.onWheel = null; }
}
module.exports = WheelHandler;
