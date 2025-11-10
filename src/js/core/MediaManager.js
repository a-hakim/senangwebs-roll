/**
 * MediaManager - Manages media items (add, remove, retrieve)
 */
class MediaManager {
  constructor(eventManager) {
    this.items = [];
    this.eventManager = eventManager;
  }

  /**
   * Add a new item to the roll
   * @param {Object} item - Item object {type, src/content, ...}
   * @param {number} index - Optional index to insert at
   * @returns {boolean} Success status
   */
  addItem(item, index = null) {
    if (!this.validateItem(item)) {
      console.warn('Invalid item:', item);
      return false;
    }

    if (index !== null && index >= 0 && index <= this.items.length) {
      this.items.splice(index, 0, item);
    } else {
      this.items.push(item);
    }

    this.eventManager.emit('itemAdded', { item, index: this.items.indexOf(item) });
    return true;
  }

  /**
   * Remove an item by index
   * @param {number} index - Index of item to remove
   * @returns {Object|null} Removed item or null if invalid index
   */
  removeItem(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn('Invalid item index:', index);
      return null;
    }

    const removed = this.items.splice(index, 1)[0];
    this.eventManager.emit('itemRemoved', { item: removed, index });
    return removed;
  }

  /**
   * Get item by index
   * @param {number} index - Item index
   * @returns {Object|null} Item or null if invalid index
   */
  getItem(index) {
    if (index < 0 || index >= this.items.length) {
      return null;
    }
    return this.items[index];
  }

  /**
   * Get all items
   * @returns {Array} Array of all items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get total number of items
   * @returns {number} Total items count
   */
  getItemCount() {
    return this.items.length;
  }

  /**
   * Update an item at index
   * @param {number} index - Item index
   * @param {Object} updates - Updated properties
   * @returns {boolean} Success status
   */
  updateItem(index, updates) {
    if (index < 0 || index >= this.items.length) {
      console.warn('Invalid item index:', index);
      return false;
    }

    this.items[index] = { ...this.items[index], ...updates };
    this.eventManager.emit('itemUpdated', { item: this.items[index], index });
    return true;
  }

  /**
   * Clear all items
   */
  clear() {
    this.items = [];
    this.eventManager.emit('itemsCleared');
  }

  /**
   * Validate item object structure
   * @param {Object} item - Item to validate
   * @returns {boolean} Is valid
   */
  validateItem(item) {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const { type } = item;

    if (!type) {
      console.warn('Item missing "type" property');
      return false;
    }

    if (type === 'video') {
      return item.src !== undefined && item.src !== '';
    }

    if (type === 'image') {
      return item.src !== undefined && item.src !== '';
    }

    if (type === 'html') {
      return item.content !== undefined;
    }

    console.warn(`Unknown item type: ${type}`);
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaManager;
}
