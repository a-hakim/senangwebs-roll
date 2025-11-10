/**
 * Navigation - Handles navigation logic (next, prev, goTo)
 */
class Navigation {
  constructor(eventManager, config) {
    this.eventManager = eventManager;
    this.config = config;
    this.currentIndex = 0;
    this.totalItems = 0;
  }

  /**
   * Initialize navigation with total items count
   * @param {number} totalItems - Total number of items
   */
  initialize(totalItems) {
    this.totalItems = totalItems;
    this.currentIndex = 0;
  }

  /**
   * Go to next item
   * @returns {number} New index
   */
  next() {
    if (this.totalItems === 0) return this.currentIndex;

    let nextIndex = this.currentIndex + 1;

    if (nextIndex >= this.totalItems) {
      if (this.config.loop) {
        nextIndex = 0;
      } else {
        nextIndex = this.totalItems - 1;
      }
    }

    return this.goTo(nextIndex);
  }

  /**
   * Go to previous item
   * @returns {number} New index
   */
  prev() {
    if (this.totalItems === 0) return this.currentIndex;

    let prevIndex = this.currentIndex - 1;

    if (prevIndex < 0) {
      if (this.config.loop) {
        prevIndex = this.totalItems - 1;
      } else {
        prevIndex = 0;
      }
    }

    return this.goTo(prevIndex);
  }

  /**
   * Jump to specific index
   * @param {number} index - Target index
   * @returns {number} New index (clamped to valid range)
   */
  goTo(index) {
    if (this.totalItems === 0) {
      console.warn('No items available for navigation');
      return this.currentIndex;
    }

    // Clamp index to valid range
    const validIndex = Math.max(0, Math.min(index, this.totalItems - 1));

    if (validIndex === this.currentIndex) {
      return this.currentIndex;
    }

    const oldIndex = this.currentIndex;
    this.currentIndex = validIndex;

    this.eventManager.emit('navigationChanged', {
      oldIndex,
      newIndex: this.currentIndex,
      totalItems: this.totalItems,
    });

    return this.currentIndex;
  }

  /**
   * Get current index
   * @returns {number} Current index
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Check if at first item
   * @returns {boolean}
   */
  isAtStart() {
    return this.currentIndex === 0;
  }

  /**
   * Check if at last item
   * @returns {boolean}
   */
  isAtEnd() {
    return this.currentIndex === this.totalItems - 1;
  }

  /**
   * Check if can go to next
   * @returns {boolean}
   */
  canGoNext() {
    return this.config.loop || !this.isAtEnd();
  }

  /**
   * Check if can go to previous
   * @returns {boolean}
   */
  canGoPrev() {
    return this.config.loop || !this.isAtStart();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
