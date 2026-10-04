const { isControl, ownsEvent } = require('./Interaction');
class MouseDragHandler {
  constructor(element, eventManager, config, onDrag) {
    Object.assign(this, { element, eventManager, config, onDrag, isHandlerEnabled: false, isDragging: false, suppressClick: false });
    this.document = element.ownerDocument;
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundCancel = this.cancel.bind(this);
    this.boundClick = this.handleClick.bind(this);
    this.lastTouchTime = -Infinity;
    this.touchSubscriptions = [
      eventManager.on('tapDetected', data => { if (data.pointerType === 'touch') this.lastTouchTime = Date.now(); }),
      eventManager.on('swipeDetected', () => { this.lastTouchTime = Date.now(); }),
    ];
  }
  enable() {
    if (!this.config.enableMouseDrag || this.isHandlerEnabled) return;
    this.isHandlerEnabled = true;
    this.element.addEventListener('mousedown', this.boundMouseDown);
    this.document.addEventListener('mousemove', this.boundMouseMove);
    this.document.addEventListener('mouseup', this.boundMouseUp);
    this.document.defaultView.addEventListener('blur', this.boundCancel);
    this.element.addEventListener('click', this.boundClick);
  }
  disable() {
    if (!this.isHandlerEnabled) return;
    this.isHandlerEnabled = false;
    this.cancel();
    this.element.removeEventListener('mousedown', this.boundMouseDown);
    this.document.removeEventListener('mousemove', this.boundMouseMove);
    this.document.removeEventListener('mouseup', this.boundMouseUp);
    this.document.defaultView.removeEventListener('blur', this.boundCancel);
    this.element.removeEventListener('click', this.boundClick);
  }
  cancel() { this.isDragging = false; this.element.style.cursor = ''; }
  handleMouseDown(event) {
    this.suppressClick = false;
    if (event.button !== 0 || Date.now() - this.lastTouchTime < 750 || isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    this.mouseStartX = event.clientX;
    this.mouseStartY = event.clientY;
    this.mouseStartTime = Date.now();
    this.isDragging = true;
    this.hasMovedSignificantly = false;
  }
  handleMouseMove(event) {
    if (!this.isDragging) return;
    if (Math.abs(event.clientY - this.mouseStartY) > 5 || Math.abs(event.clientX - this.mouseStartX) > 5) {
      this.hasMovedSignificantly = true;
      this.element.style.cursor = 'grabbing';
      if (event.cancelable) event.preventDefault();
    }
  }
  handleMouseUp(event) {
    if (!this.isDragging) return;
    this.cancel();
    if (!this.hasMovedSignificantly) return;
    this.suppressClick = true;
    const dx = this.mouseStartX - event.clientX;
    const dy = this.mouseStartY - event.clientY;
    const velocity = Math.abs(dy) / Math.max(1, Date.now() - this.mouseStartTime);
    if (Math.abs(dx) > Math.abs(dy) * 1.5 ||
      (Math.abs(dy) < this.config.swipeThreshold && !(Math.abs(dy) >= 30 && velocity >= 0.3))) return;
    const direction = dy > 0 ? 'up' : 'down';
    this.eventManager.emit('dragDetected', { direction, distance: Math.abs(dy), velocity });
    this.onDrag?.(direction);
  }
  handleClick(event) {
    if (isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    if (this.suppressClick) { this.suppressClick = false; event.preventDefault(); return; }
    // Synthetic mouse clicks following a touch must not toggle playback twice.
    if (event.sourceCapabilities?.firesTouchEvents || Date.now() - this.lastTouchTime < 750) return;
    this.eventManager.emit('tapDetected', { x: event.clientX, y: event.clientY });
  }
  destroy() { this.disable(); this.touchSubscriptions.forEach(unsubscribe => unsubscribe()); this.onDrag = null; }
}
module.exports = MouseDragHandler;
