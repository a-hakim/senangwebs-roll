/**
 * KeyboardHandler - Handles keyboard navigation
 */
class KeyboardHandler {
  constructor(element, eventManager, config, onKeyPress) {
    this.element = element;
    this.eventManager = eventManager;
    this.config = config;
    this.onKeyPress = onKeyPress;

    this.isConfigEnabled = config.enableKeyboard;
    this.isHandlerAttached = false;
    this.isHovered = false;
    this.isFocused = false;
    
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundMouseEnter = this.handleMouseEnter.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
    this.boundFocus = this.handleFocus.bind(this);
    this.boundBlur = this.handleBlur.bind(this);
  }

  /**
   * Enable keyboard handler
   */
  enable() {
    if (!this.isConfigEnabled || this.isHandlerAttached) return;

    this.isHandlerAttached = true;
    
    // Make element focusable if not already
    if (!this.element.hasAttribute('tabindex')) {
      this.element.setAttribute('tabindex', '0');
    }
    
    // Listen to document for keyboard events
    document.addEventListener('keydown', this.boundKeyDown, false);
    
    // Track hover state
    this.element.addEventListener('mouseenter', this.boundMouseEnter, false);
    this.element.addEventListener('mouseleave', this.boundMouseLeave, false);
    
    // Track focus state
    this.element.addEventListener('focus', this.boundFocus, false);
    this.element.addEventListener('blur', this.boundBlur, false);
  }

  /**
   * Disable keyboard handler
   */
  disable() {
    if (!this.isHandlerAttached) return;

    this.isHandlerAttached = false;
    document.removeEventListener('keydown', this.boundKeyDown, false);
    this.element.removeEventListener('mouseenter', this.boundMouseEnter, false);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave, false);
    this.element.removeEventListener('focus', this.boundFocus, false);
    this.element.removeEventListener('blur', this.boundBlur, false);
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
   * Handle focus
   */
  handleFocus() {
    this.isFocused = true;
  }

  /**
   * Handle blur
   */
  handleBlur() {
    this.isFocused = false;
  }

  /**
   * Handle key down event
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    if (!this.isHandlerAttached) return;
    
    // Only respond to keyboard events if element is hovered or focused
    if (!this.isHovered && !this.isFocused) {
      return;
    }

    const key = event.key;

    // Arrow Down - next item (Instagram Reels style)
    if (key === 'ArrowDown') {
      event.preventDefault();
      this.eventManager.emit('keyboardEvent', { key: 'ArrowDown' });

      if (this.onKeyPress) {
        this.onKeyPress('ArrowDown');
      }
    }

    // Arrow Up - previous item (Instagram Reels style)
    if (key === 'ArrowUp') {
      event.preventDefault();
      this.eventManager.emit('keyboardEvent', { key: 'ArrowUp' });

      if (this.onKeyPress) {
        this.onKeyPress('ArrowUp');
      }
    }

    // Space - toggle autoplay
    if (key === ' ') {
      event.preventDefault();
      this.eventManager.emit('keyboardEvent', { key: ' ' });

      if (this.onKeyPress) {
        this.onKeyPress(' ');
      }
    }
  }

  /**
   * Destroy handler
   */
  destroy() {
    this.disable();
    this.onKeyPress = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeyboardHandler;
}
