/**
 * TouchHandler - Detects and handles swipe gestures
 */
class TouchHandler {
  constructor(element, eventManager, config, onSwipe) {
    this.element = element;
    this.eventManager = eventManager;
    this.config = config;
    this.onSwipe = onSwipe;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.isHandlerEnabled = false;

    this.touchStartTime = 0;
    this.isDragging = false;

    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * Enable touch handler
   */
  enable() {
    if (this.config.enableTouch === false) return;
    if (this.isHandlerEnabled) return;

    this.isHandlerEnabled = true;
    // Use capture phase to intercept events before child elements - Instagram Reels behavior
    this.element.addEventListener('touchstart', this.boundTouchStart, { passive: false, capture: true });
    this.element.addEventListener('touchmove', this.boundTouchMove, { passive: false, capture: true });
    this.element.addEventListener('touchend', this.boundTouchEnd, { passive: false, capture: true });
  }

  /**
   * Disable touch handler
   */
  disable() {
    if (!this.isHandlerEnabled) return;

    this.isHandlerEnabled = false;
    this.element.removeEventListener('touchstart', this.boundTouchStart, { capture: true });
    this.element.removeEventListener('touchmove', this.boundTouchMove, { capture: true });
    this.element.removeEventListener('touchend', this.boundTouchEnd, { capture: true });
  }

  /**
   * Handle touch start
   * @param {TouchEvent} event
   */
  handleTouchStart(event) {
    if (event.touches.length !== 1) return; // Only handle single touch

    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isDragging = true;
    
    // Prevent default immediately to stop any scrolling - Instagram Reels style
    event.preventDefault();
    // Stop event from reaching child elements
    event.stopPropagation();
    
    console.log('TouchHandler: Touch start at', this.touchStartX, this.touchStartY);
  }

  /**
   * Handle touch move
   * @param {TouchEvent} event
   */
  handleTouchMove(event) {
    if (!this.isDragging || event.touches.length !== 1) return;

    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;
    
    // Always prevent default to stop page scrolling - Instagram Reels behavior
    // This ensures only our roll moves, not the page
    event.preventDefault();
    event.stopPropagation();
    
    // Optional: Could add visual feedback here (like Instagram's drag indicator)
    const deltaY = this.touchStartY - this.touchEndY;
    console.log('TouchHandler: Dragging', { deltaY });
  }

  /**
   * Handle touch end
   * @param {TouchEvent} event
   */
  handleTouchEnd(event) {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Use changedTouches to get the final position
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = this.touchStartX - endX;
    const deltaY = this.touchStartY - endY;
    const deltaTime = Date.now() - this.touchStartTime;

    console.log('TouchHandler: Touch end', {
      startX: this.touchStartX,
      startY: this.touchStartY,
      endX,
      endY,
      deltaX,
      deltaY,
      deltaTime
    });

    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(deltaY) / deltaTime;

    // Instagram Reels style: Prioritize vertical movement
    // Only ignore if it's significantly more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      console.log('TouchHandler: Significantly horizontal swipe detected, ignoring');
      return;
    }

    // Check if it's a tap (quick touch with minimal movement)
    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300;

    if (isTap) {
      console.log('TouchHandler: Tap detected');
      this.eventManager.emit('tapDetected', {
        x: endX,
        y: endY,
      });
      return; // Don't process as swipe
    }

    // Instagram Reels style: Use velocity-based threshold for better responsiveness
    // Accept swipe if either:
    // 1. Distance is above threshold, OR
    // 2. Velocity is high enough (fast swipe) - minimum 30px movement
    const minSwipeDistance = 30;
    const velocityThreshold = 0.3; // pixels per millisecond
    
    const isValidDistance = Math.abs(deltaY) >= this.config.swipeThreshold;
    const isValidVelocity = Math.abs(deltaY) >= minSwipeDistance && velocity >= velocityThreshold;

    if (!isValidDistance && !isValidVelocity) {
      console.log('TouchHandler: Swipe too small or slow', { 
        deltaY: Math.abs(deltaY), 
        threshold: this.config.swipeThreshold, 
        velocity,
        velocityThreshold
      });
      return;
    }

    const direction = deltaY > 0 ? 'up' : 'down';
    console.log('TouchHandler: Valid swipe detected:', direction, { distance: Math.abs(deltaY), velocity });

    this.eventManager.emit('swipeDetected', {
      direction,
      distance: Math.abs(deltaY),
      velocity,
    });

    if (this.onSwipe) {
      this.onSwipe(direction);
    }
  }

  /**
   * Destroy handler
   */
  destroy() {
    this.disable();
    this.onSwipe = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TouchHandler;
}
