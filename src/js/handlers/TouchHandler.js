const { isControl, ownsEvent } = require('./Interaction');
class TouchHandler {
  constructor(element, eventManager, config, onSwipe) {
    Object.assign(this, { element, eventManager, config, onSwipe, isHandlerEnabled: false, isDragging: false });
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    this.boundTouchCancel = this.cancel.bind(this);
  }
  enable() {
    if (!this.config.enableTouch || this.isHandlerEnabled) return;
    this.isHandlerEnabled = true;
    this.element.style.touchAction = 'auto';
    this.element.addEventListener('touchstart', this.boundTouchStart, { passive: true });
    this.element.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.boundTouchEnd, { passive: true });
    this.element.addEventListener('touchcancel', this.boundTouchCancel, { passive: true });
  }
  disable() {
    if (!this.isHandlerEnabled) return;
    this.isHandlerEnabled = false;
    this.cancel();
    this.element.removeEventListener('touchstart', this.boundTouchStart);
    this.element.removeEventListener('touchmove', this.boundTouchMove);
    this.element.removeEventListener('touchend', this.boundTouchEnd);
    this.element.removeEventListener('touchcancel', this.boundTouchCancel);
    this.element.style.touchAction = '';
  }
  cancel() { this.isDragging = false; }
  handleTouchStart(event) {
    this.cancel();
    if (event.touches.length !== 1 || isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    const touch = event.touches[0];
    this.touchId = touch.identifier;
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isDragging = true;
  }
  handleTouchMove(event) {
    if (!this.isDragging) return;
    if (event.touches.length !== 1) { this.cancel(); return; }
    const touch = Array.from(event.touches).find(t => t.identifier === this.touchId);
    if (!touch) return;
    const dx = this.touchStartX - touch.clientX;
    const dy = this.touchStartY - touch.clientY;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5 && event.cancelable) event.preventDefault();
  }
  handleTouchEnd(event) {
    if (!this.isDragging) return;
    const touch = Array.from(event.changedTouches).find(t => t.identifier === this.touchId);
    if (!touch) return;
    this.cancel();
    const dx = this.touchStartX - touch.clientX;
    const dy = this.touchStartY - touch.clientY;
    const time = Math.max(1, Date.now() - this.touchStartTime);
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && time < 300) {
      this.eventManager.emit('tapDetected', { x: touch.clientX, y: touch.clientY, pointerType: 'touch' });
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) * 1.5) return;
    const velocity = Math.abs(dy) / time;
    if (Math.abs(dy) < this.config.swipeThreshold && !(Math.abs(dy) >= 30 && velocity >= 0.3)) return;
    const direction = dy > 0 ? 'up' : 'down';
    this.eventManager.emit('swipeDetected', { direction, distance: Math.abs(dy), velocity });
    this.onSwipe?.(direction);
  }
  destroy() { this.disable(); this.onSwipe = null; }
}
module.exports = TouchHandler;
