/**
 * MouseDragHandler - Detects and handles mouse drag gestures (desktop support)
 */
class MouseDragHandler {
  constructor(element, eventManager, config, onDrag) {
    this.element = element;
    this.eventManager = eventManager;
    this.config = config;
    this.onDrag = onDrag;

    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.mouseEndX = 0;
    this.mouseEndY = 0;
    this.isHandlerEnabled = false;

    this.mouseStartTime = 0;
    this.isDragging = false;
    this.hasMovedSignificantly = false;
    this.dragStartedInside = false;

    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
  }

  /**
   * Enable mouse drag handler
   */
  enable() {
    if (this.config.enableMouseDrag === false) return;
    if (this.isHandlerEnabled) return;

    this.isHandlerEnabled = true;
    this.element.addEventListener('mousedown', this.boundMouseDown, { passive: false });
    // Mouse move and up are on document to track outside element
    document.addEventListener('mousemove', this.boundMouseMove, { passive: false });
    document.addEventListener('mouseup', this.boundMouseUp, { passive: false });
    this.element.addEventListener('mouseleave', this.boundMouseLeave, { passive: false });
  }

  /**
   * Disable mouse drag handler
   */
  disable() {
    if (!this.isHandlerEnabled) return;

    this.isHandlerEnabled = false;
    this.element.removeEventListener('mousedown', this.boundMouseDown);
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);
  }

  /**
   * Handle mouse down
   * @param {MouseEvent} event
   */
  handleMouseDown(event) {
    // Only handle left mouse button
    if (event.button !== 0) return;

    // Mark that drag started inside the element
    this.dragStartedInside = true;

    this.mouseStartX = event.clientX;
    this.mouseStartY = event.clientY;
    this.mouseStartTime = Date.now();
    this.isDragging = true;
    this.hasMovedSignificantly = false;

    // Prevent text selection and default drag behavior
    event.preventDefault();

    // Add dragging cursor
    this.element.style.cursor = 'grabbing';

    console.log('MouseDragHandler: Mouse down at', this.mouseStartX, this.mouseStartY);
  }

  /**
   * Handle mouse move
   * @param {MouseEvent} event
   */
  handleMouseMove(event) {
    if (!this.isDragging) return;

    this.mouseEndX = event.clientX;
    this.mouseEndY = event.clientY;

    const deltaX = Math.abs(this.mouseStartX - this.mouseEndX);
    const deltaY = Math.abs(this.mouseStartY - this.mouseEndY);

    // Check if moved significantly (at least 5px)
    if (deltaY > 5 || deltaX > 5) {
      this.hasMovedSignificantly = true;
    }

    // Prevent default to stop text selection during drag
    if (this.hasMovedSignificantly) {
      event.preventDefault();
    }

    console.log('MouseDragHandler: Dragging', { 
      deltaY: this.mouseStartY - this.mouseEndY,
      deltaX: deltaX 
    });
  }

  /**
   * Handle mouse up
   * @param {MouseEvent} event
   */
  handleMouseUp(event) {
    if (!this.isDragging) return;

    // Only process if drag started inside the element
    if (!this.dragStartedInside) {
      this.isDragging = false;
      this.dragStartedInside = false;
      return;
    }

    this.isDragging = false;
    this.dragStartedInside = false;

    // Restore cursor
    this.element.style.cursor = '';

    // Only process as drag if moved significantly
    if (!this.hasMovedSignificantly) {
      console.log('MouseDragHandler: Click detected (no drag), ignoring');
      return;
    }

    const endX = event.clientX;
    const endY = event.clientY;

    const deltaX = this.mouseStartX - endX;
    const deltaY = this.mouseStartY - endY;
    const deltaTime = Date.now() - this.mouseStartTime;

    console.log('MouseDragHandler: Mouse up', {
      startX: this.mouseStartX,
      startY: this.mouseStartY,
      endX,
      endY,
      deltaX,
      deltaY,
      deltaTime
    });

    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(deltaY) / deltaTime;

    // Prioritize vertical movement (like touch handler)
    // Only ignore if significantly more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      console.log('MouseDragHandler: Significantly horizontal drag detected, ignoring');
      return;
    }

    // Use velocity-based threshold for better responsiveness
    const minDragDistance = 30;
    const velocityThreshold = 0.3; // pixels per millisecond
    const dragThreshold = this.config.swipeThreshold || 50;

    const isValidDistance = Math.abs(deltaY) >= dragThreshold;
    const isValidVelocity = Math.abs(deltaY) >= minDragDistance && velocity >= velocityThreshold;

    if (!isValidDistance && !isValidVelocity) {
      console.log('MouseDragHandler: Drag too small or slow', {
        deltaY: Math.abs(deltaY),
        threshold: dragThreshold,
        velocity,
        velocityThreshold
      });
      return;
    }

    const direction = deltaY > 0 ? 'up' : 'down';
    console.log('MouseDragHandler: Valid drag detected:', direction, { 
      distance: Math.abs(deltaY), 
      velocity 
    });

    this.eventManager.emit('dragDetected', {
      direction,
      distance: Math.abs(deltaY),
      velocity,
    });

    if (this.onDrag) {
      this.onDrag(direction);
    }
  }

  /**
   * Handle mouse leave
   * @param {MouseEvent} event
   */
  handleMouseLeave(event) {
    // If dragging and mouse leaves the element, still allow drag completion
    // Don't cancel dragging here, let mouseup handle it
    if (this.isDragging) {
      console.log('MouseDragHandler: Mouse left element while dragging');
    }
  }

  /**
   * Destroy handler
   */
  destroy() {
    this.disable();
    this.onDrag = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MouseDragHandler;
}
