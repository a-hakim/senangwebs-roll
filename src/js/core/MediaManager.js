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
  addItem(item, index = null, emit = true) {
    if (!this.validateItem(item)) {
      console.warn('Invalid item:', item);
      return false;
    }

    const actualIndex = this.resolveInsertionIndex(index);
    this.items.splice(actualIndex, 0, { ...item });
    if (emit) this.eventManager.emit('itemAdded', { item: this.items[actualIndex], index: actualIndex });
    return true;
  }

  /**
   * Remove an item by index
   * @param {number} index - Index of item to remove
   * @returns {Object|null} Removed item or null if invalid index
   */
  removeItem(index, emit = true) {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      console.warn('Invalid item index:', index);
      return null;
    }

    const removed = this.items.splice(index, 1)[0];
    if (emit) this.eventManager.emit('itemRemoved', { item: removed, index });
    return removed;
  }

  /**
   * Get item by index
   * @param {number} index - Item index
   * @returns {Object|null} Item or null if invalid index
   */
  getItem(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
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
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      console.warn('Invalid item index:', index);
      return false;
    }

    const item = { ...this.items[index], ...updates };
    if (!this.validateItem(item)) return false;
    this.items[index] = item;
    this.eventManager.emit('itemUpdated', { item: this.items[index], index });
    return true;
  }

  /**
   * Clear all items
   */
  clear(emit = true) {
    this.items = [];
    if (emit) this.eventManager.emit('itemsCleared');
  }

  resolveInsertionIndex(index) {
    return Number.isInteger(index) && index >= 0 && index <= this.items.length ? index : this.items.length;
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

    for (const key of ['mimeType', 'alt', 'title']) {
      if (item[key] !== undefined && typeof item[key] !== 'string') return false;
    }
    for (const key of ['autoplay', 'muted', 'playsinline', 'loop', 'controls']) {
      if (item[key] !== undefined && typeof item[key] !== 'boolean') return false;
    }

    if (!type) {
      console.warn('Item missing "type" property');
      return false;
    }

    if (type === 'video') {
      return typeof item.src === 'string' && item.src.trim() !== '';
    }

    if (type === 'image') {
      return typeof item.src === 'string' && item.src.trim() !== '';
    }

    if (type === 'html') {
      return typeof item.content === 'string';
    }

    console.warn(`Unknown item type: ${type}`);
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaManager;
}
