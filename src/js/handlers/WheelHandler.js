/**
 * WheelHandler - Handles mouse wheel scrolling for desktop users
 */
class WheelHandler {
  constructor(element, eventManager, config, onWheel) {
    this.element = element;
    this.eventManager = eventManager;
    this.config = config;
    this.onWheel = onWheel;

    this.isHandlerEnabled = false;
    this.lastWheelTime = 0;
    this.wheelThrottle = 500; // Minimum time between wheel events (ms)
    this.isHovered = false;

    this.boundWheel = this.handleWheel.bind(this);
    this.boundMouseEnter = this.handleMouseEnter.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
  }

  /**
   * Enable wheel handler
   */
  enable() {
    if (!this.config.enableWheel) return;
    if (this.isHandlerEnabled) return;

    this.isHandlerEnabled = true;
    this.element.addEventListener('wheel', this.boundWheel, { passive: false });
    this.element.addEventListener('mouseenter', this.boundMouseEnter, false);
    this.element.addEventListener('mouseleave', this.boundMouseLeave, false);
    console.log('WheelHandler: Enabled');
  }

  /**
   * Disable wheel handler
   */
  disable() {
    if (!this.isEnabled) return;

    this.isEnabled = false;
    this.element.removeEventListener('wheel', this.boundWheel);
    this.element.removeEventListener('mouseenter', this.boundMouseEnter);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);
  }

  /**
   * Handle mouse enter
   */
  handleMouseEnter() {
    this.isHovered = true;
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    this.isHovered = false;
  }

  /**
   * Handle wheel event
   * @param {WheelEvent} event
   */
  handleWheel(event) {
    if (!this.isEnabled) return;

    // Only respond when mouse is hovering over the element
    if (!this.isHovered) return;

    const now = Date.now();
    
    // Throttle wheel events to prevent too rapid scrolling
    if (now - this.lastWheelTime < this.wheelThrottle) {
      event.preventDefault();
      return;
    }

    this.lastWheelTime = now;

    // Prevent default scrolling behavior
    event.preventDefault();

    // Determine scroll direction
    const direction = event.deltaY > 0 ? 'down' : 'up';

    console.log('WheelHandler: Scroll detected -', direction);

    this.eventManager.emit('wheelDetected', {
      direction,
      deltaY: event.deltaY,
    });

    if (this.onWheel) {
      this.onWheel(direction);
    }
  }

  /**
   * Destroy handler
   */
  destroy() {
    this.disable();
    this.onWheel = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WheelHandler;
}
