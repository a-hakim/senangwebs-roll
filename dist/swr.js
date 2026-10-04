(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SWR"] = factory();
	else
		root["SWR"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 943
(module) {

/**
 * EventManager - Handles custom event emission and subscription
 */
class EventManager {
  constructor() {
    this.listeners = Object.create(null);
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (typeof callback !== 'function') throw new TypeError('Event callback must be a function');
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);

    // Clean up empty event listeners
    if (this.listeners[event].length === 0) {
      delete this.listeners[event];
    }
  }

  /**
   * Emit an event with data
   * @param {string} event - Event name
   * @param {any} data - Data to pass to listeners
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    [...this.listeners[event]].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  clearEvent(event) {
    if (this.listeners[event]) {
      delete this.listeners[event];
    }
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners = Object.create(null);
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  getListenerCount(event) {
    return this.listeners[event] ? this.listeners[event].length : 0;
  }
}
if ( true && module.exports) {
  module.exports = EventManager;
}

/***/ },

/***/ 979
(module) {

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
  addItem(item) {
    let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let emit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (!this.validateItem(item)) {
      console.warn('Invalid item:', item);
      return false;
    }
    const actualIndex = this.resolveInsertionIndex(index);
    this.items.splice(actualIndex, 0, {
      ...item
    });
    if (emit) this.eventManager.emit('itemAdded', {
      item: this.items[actualIndex],
      index: actualIndex
    });
    return true;
  }

  /**
   * Remove an item by index
   * @param {number} index - Index of item to remove
   * @returns {Object|null} Removed item or null if invalid index
   */
  removeItem(index) {
    let emit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      console.warn('Invalid item index:', index);
      return null;
    }
    const removed = this.items.splice(index, 1)[0];
    if (emit) this.eventManager.emit('itemRemoved', {
      item: removed,
      index
    });
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
    const item = {
      ...this.items[index],
      ...updates
    };
    if (!this.validateItem(item)) return false;
    this.items[index] = item;
    this.eventManager.emit('itemUpdated', {
      item: this.items[index],
      index
    });
    return true;
  }

  /**
   * Clear all items
   */
  clear() {
    let emit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
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
    const {
      type
    } = item;
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
if ( true && module.exports) {
  module.exports = MediaManager;
}

/***/ },

/***/ 70
(module) {

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
    let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    this.totalItems = totalItems;
    this.currentIndex = Math.max(0, Math.min(index, totalItems - 1));
  }

  /**
   * Go to next item
   * @returns {Object} Navigation result {index, isWrapping, direction}
   */
  next() {
    if (this.totalItems === 0) return {
      index: this.currentIndex,
      isWrapping: false,
      direction: 'up'
    };
    let nextIndex = this.currentIndex + 1;
    let isWrapping = false;
    if (nextIndex >= this.totalItems) {
      if (this.config.loop) {
        nextIndex = 0;
        isWrapping = true;
      } else {
        nextIndex = this.totalItems - 1;
      }
    }
    const result = this.goTo(nextIndex);
    return {
      index: result,
      isWrapping: isWrapping,
      direction: 'up'
    };
  }

  /**
   * Go to previous item
   * @returns {Object} Navigation result {index, isWrapping, direction}
   */
  prev() {
    if (this.totalItems === 0) return {
      index: this.currentIndex,
      isWrapping: false,
      direction: 'down'
    };
    let prevIndex = this.currentIndex - 1;
    let isWrapping = false;
    if (prevIndex < 0) {
      if (this.config.loop) {
        prevIndex = this.totalItems - 1;
        isWrapping = true;
      } else {
        prevIndex = 0;
      }
    }
    const result = this.goTo(prevIndex);
    return {
      index: result,
      isWrapping: isWrapping,
      direction: 'down'
    };
  }

  /**
   * Jump to specific index
   * @param {number} index - Target index
   * @returns {number} New index (clamped to valid range)
   */
  goTo(index) {
    if (!Number.isInteger(index) || this.totalItems === 0) {
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
      totalItems: this.totalItems
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
    return this.totalItems > 1 && (this.config.loop || !this.isAtEnd());
  }

  /**
   * Check if can go to previous
   * @returns {boolean}
   */
  canGoPrev() {
    return this.totalItems > 1 && (this.config.loop || !this.isAtStart());
  }
}
if ( true && module.exports) {
  module.exports = Navigation;
}

/***/ },

/***/ 43
(module) {

/** Owns slide DOM and cancellable transitions; never clones consumer nodes. */
class Roll {
  constructor(element, eventManager, config) {
    Object.assign(this, {
      element,
      eventManager,
      config,
      currentIndex: 0,
      container: null,
      viewport: null,
      itemElements: [],
      isAnimating: false,
      transitionId: null,
      generation: 0,
      wrapItem: null,
      wrapTransform: null
    });
  }
  initialize() {
    let elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const doc = this.element.ownerDocument;
    this.viewport = doc.createElement('div');
    this.viewport.className = 'swr-viewport';
    this.container = doc.createElement('div');
    this.container.className = 'swr-container';
    elements.forEach(item => this.container.appendChild(item));
    this.viewport.appendChild(this.container);
    this.element.replaceChildren(this.viewport);
    this.element.classList.add('swr');
    this.updateItemElements();
    this.setupStyles();
  }
  setupStyles() {
    const [width, height] = this.config.aspectRatio.split(':').map(Number);
    Object.assign(this.viewport.style, {
      position: 'relative',
      width: '100%',
      aspectRatio: width + ' / ' + height,
      overflow: 'hidden'
    });
    Object.assign(this.container.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform ' + this.config.transitionDuration + 'ms ease-in-out',
      transform: 'translateY(0%)'
    });
  }
  parseAspectRatio(ratio) {
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }
  updateItemElements() {
    this.itemElements = this.container ? Array.from(this.container.children).filter(item => item.hasAttribute('data-swr-item')) : [];
  }
  addItemElement() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const element = this.element.ownerDocument.createElement('div');
    element.setAttribute('data-swr-item', '');
    if (Number.isInteger(index) && index >= 0 && index < this.itemElements.length) {
      this.container.insertBefore(element, this.itemElements[index]);
    } else this.container.appendChild(element);
    this.updateItemElements();
    return element;
  }
  renderItem(index, renderer, item) {
    if (!Number.isInteger(index) || index < 0 || !renderer || !this.container) return;
    while (index >= this.itemElements.length) this.addItemElement();
    const element = this.itemElements[index];
    this.eventManager.emit('beforeRender', {
      index,
      item
    });
    if (!this.container) return;
    element.replaceChildren(renderer.render(item));
    this.eventManager.emit('afterRender', {
      index,
      item
    });
  }
  slideTo(index) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!this.container || this.isAnimating || !Number.isInteger(index) || index < 0 || index >= this.itemElements.length || index === this.currentIndex) return false;
    const fromIndex = this.currentIndex;
    this.currentIndex = index;
    this.isAnimating = true;
    const generation = ++this.generation;
    const duration = options.immediate ? 0 : this.config.transitionDuration;
    this.container.style.transition = duration ? 'transform ' + duration + 'ms ease-in-out' : 'none';
    if (duration && options.isWrapping && this.itemElements.length > 1) {
      this.handleWrapAnimation(fromIndex, index, options.direction);
    } else this.container.style.transform = 'translateY(' + -index * 100 + '%)';
    const complete = () => {
      if (!this.container || generation !== this.generation) return;
      this.transitionId = null;
      this.resetWrap();
      this.snapTo(this.currentIndex);
      this.isAnimating = false;
      this.eventManager.emit('slideCompleted', {
        index: this.currentIndex
      });
    };
    if (duration) this.transitionId = setTimeout(complete, duration);else Promise.resolve().then(complete);
    if (!options.silent) this.eventManager.emit('slideStarted', {
      index
    });
    return true;
  }
  handleWrapAnimation(fromIndex, toIndex, direction) {
    const total = this.itemElements.length;
    if (fromIndex === total - 1 && toIndex === 0 && direction === 'up') {
      this.wrapItem = this.itemElements[0];
      this.wrapTransform = this.wrapItem.style.transform;
      this.wrapItem.style.transform = 'translateY(' + total * 100 + '%)';
      this.container.style.transform = 'translateY(' + -total * 100 + '%)';
    } else if (fromIndex === 0 && toIndex === total - 1 && direction === 'down') {
      this.wrapItem = this.itemElements[total - 1];
      this.wrapTransform = this.wrapItem.style.transform;
      this.wrapItem.style.transform = 'translateY(' + -total * 100 + '%)';
      this.container.style.transform = 'translateY(100%)';
    } else this.container.style.transform = 'translateY(' + -toIndex * 100 + '%)';
  }
  resetWrap() {
    if (this.wrapItem) this.wrapItem.style.transform = this.wrapTransform;
    this.wrapItem = null;
    this.wrapTransform = null;
  }
  snapTo(index) {
    if (!this.container) return;
    this.currentIndex = index;
    this.container.style.transition = 'none';
    this.container.style.transform = 'translateY(' + -index * 100 + '%)';
    void this.container.offsetHeight;
    this.container.style.transition = 'transform ' + this.config.transitionDuration + 'ms ease-in-out';
  }
  cancelTransition() {
    ++this.generation;
    if (this.transitionId !== null) clearTimeout(this.transitionId);
    this.transitionId = null;
    this.resetWrap();
    this.snapTo(this.currentIndex);
    this.isAnimating = false;
  }
  getItemCount() {
    return this.itemElements.length;
  }
  getCurrentIndex() {
    return this.currentIndex;
  }
  destroy() {
    this.cancelTransition();
    this.container = null;
    this.viewport = null;
    this.itemElements = [];
  }
}
module.exports = Roll;

/***/ },

/***/ 75
(module) {

/** Explicit playback intent is independent from temporary suspension. */
class AutoplayHandler {
  constructor(eventManager, config, onAutoplayTick) {
    Object.assign(this, {
      eventManager,
      config,
      onAutoplayTick,
      isPlaying: false,
      isPaused: false,
      wantsPlayback: false,
      autoplayInterval: null,
      resumeTimer: null,
      destroyed: false
    });
    this.suspensions = new Set();
  }
  startTicker() {
    if (this.destroyed || this.isPlaying || !this.wantsPlayback || this.suspensions.size || this.resumeTimer !== null) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.autoplayInterval = setInterval(() => {
      if (this.destroyed || !this.isPlaying) return;
      this.onAutoplayTick?.();
      if (!this.destroyed) this.eventManager.emit('autoplayTick');
    }, this.config.autoplayInterval);
    this.eventManager.emit('autoplayStart');
  }
  stopTicker() {
    if (this.autoplayInterval !== null) clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
    const wasPlaying = this.isPlaying;
    this.isPlaying = false;
    if (wasPlaying) this.eventManager.emit('autoplayPause');
  }
  clearResume() {
    if (this.resumeTimer !== null) clearTimeout(this.resumeTimer);
    this.resumeTimer = null;
  }
  play() {
    if (this.destroyed) return;
    this.wantsPlayback = true;
    this.isPaused = false;
    this.clearResume();
    this.startTicker();
  }
  pause() {
    this.wantsPlayback = false;
    this.isPaused = true;
    this.clearResume();
    this.stopTicker();
  }
  pauseTemporarily() {
    let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (this.destroyed || !this.wantsPlayback) return;
    this.clearResume();
    this.stopTicker();
    if (this.destroyed || !this.wantsPlayback) return;
    const duration = delay ?? this.config.autoplayResumeDelay;
    this.resumeTimer = setTimeout(() => {
      this.resumeTimer = null;
      this.startTicker();
    }, duration);
    this.eventManager.emit('autoplayPausedTemporarily', {
      delay: duration
    });
  }
  setSuspended(reason, suspended) {
    if (this.destroyed) return;
    if (suspended) {
      this.suspensions.add(reason);
      this.stopTicker();
    } else {
      this.suspensions.delete(reason);
      this.startTicker();
    }
  }
  resume() {
    if (this.wantsPlayback) this.startTicker();
  }
  isAutoplayActive() {
    return this.isPlaying;
  }
  isAutoplayPaused() {
    return this.isPaused;
  }
  isTemporarilyPaused() {
    return this.resumeTimer !== null;
  }
  destroy() {
    this.destroyed = true;
    this.pause();
    this.suspensions.clear();
    this.onAutoplayTick = null;
  }
}
module.exports = AutoplayHandler;

/***/ },

/***/ 48
(module) {

const CONTROL_SELECTOR = 'a,button,input,textarea,select,option,video[controls],audio[controls],summary,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="slider"],[data-swr-ignore]';
function isControl(target) {
  return !!target?.closest?.(CONTROL_SELECTOR);
}
// Nested rolls own their gestures.
function ownsEvent(element, target) {
  const root = element.closest('.swr') || element;
  return target?.closest?.('.swr') === root;
}
module.exports = {
  isControl,
  ownsEvent
};

/***/ },

/***/ 135
(module, __unused_webpack_exports, __webpack_require__) {

const {
  isControl
} = __webpack_require__(48);
const hoveredRolls = new WeakMap();
class KeyboardHandler {
  constructor(element, eventManager, config, onKeyPress) {
    Object.assign(this, {
      element,
      eventManager,
      config,
      onKeyPress,
      isHandlerAttached: false
    });
    this.document = element.ownerDocument;
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundMouseEnter = () => hoveredRolls.set(this.document, this.element);
    this.boundMouseLeave = () => {
      if (hoveredRolls.get(this.document) === this.element) {
        const parent = this.element.parentElement?.closest('.swr');
        if (parent) hoveredRolls.set(this.document, parent);else hoveredRolls.delete(this.document);
      }
    };
  }
  enable() {
    if (!this.config.enableKeyboard || this.isHandlerAttached) return;
    this.isHandlerAttached = true;
    if (!this.element.hasAttribute('tabindex')) this.element.setAttribute('tabindex', '0');
    this.document.addEventListener('keydown', this.boundKeyDown);
    this.element.addEventListener('mouseenter', this.boundMouseEnter);
    this.element.addEventListener('mouseleave', this.boundMouseLeave);
  }
  disable() {
    if (!this.isHandlerAttached) return;
    this.isHandlerAttached = false;
    this.document.removeEventListener('keydown', this.boundKeyDown);
    this.element.removeEventListener('mouseenter', this.boundMouseEnter);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);
    this.boundMouseLeave();
  }
  handleKeyDown(event) {
    if (!this.isHandlerAttached || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isControl(event.target) || isControl(this.document.activeElement)) return;
    const focusedRoll = this.document.activeElement?.closest?.('.swr');
    if (focusedRoll ? focusedRoll !== this.element : hoveredRolls.get(this.document) !== this.element) return;
    if (!focusedRoll && this.element.querySelector('.swr:hover')) return;
    const key = {
      ArrowRight: 'ArrowDown',
      ArrowLeft: 'ArrowUp',
      Spacebar: ' '
    }[event.key] || event.key;
    if (!['ArrowDown', 'ArrowUp', ' '].includes(key)) return;
    event.preventDefault();
    this.eventManager.emit('keyboardEvent', {
      key
    });
    this.onKeyPress?.(key);
  }
  destroy() {
    this.disable();
    this.onKeyPress = null;
  }
}
module.exports = KeyboardHandler;

/***/ },

/***/ 873
(module, __unused_webpack_exports, __webpack_require__) {

const {
  isControl,
  ownsEvent
} = __webpack_require__(48);
class MouseDragHandler {
  constructor(element, eventManager, config, onDrag) {
    Object.assign(this, {
      element,
      eventManager,
      config,
      onDrag,
      isHandlerEnabled: false,
      isDragging: false,
      suppressClick: false
    });
    this.document = element.ownerDocument;
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundCancel = this.cancel.bind(this);
    this.boundClick = this.handleClick.bind(this);
    this.lastTouchTime = -Infinity;
    this.touchSubscriptions = [eventManager.on('tapDetected', data => {
      if (data.pointerType === 'touch') this.lastTouchTime = Date.now();
    }), eventManager.on('swipeDetected', () => {
      this.lastTouchTime = Date.now();
    })];
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
  cancel() {
    this.isDragging = false;
    this.element.style.cursor = '';
  }
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
    if (Math.abs(dx) > Math.abs(dy) * 1.5 || Math.abs(dy) < this.config.swipeThreshold && !(Math.abs(dy) >= 30 && velocity >= 0.3)) return;
    const direction = dy > 0 ? 'up' : 'down';
    this.eventManager.emit('dragDetected', {
      direction,
      distance: Math.abs(dy),
      velocity
    });
    this.onDrag?.(direction);
  }
  handleClick(event) {
    if (isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    if (this.suppressClick) {
      this.suppressClick = false;
      event.preventDefault();
      return;
    }
    // Synthetic mouse clicks following a touch must not toggle playback twice.
    if (event.sourceCapabilities?.firesTouchEvents || Date.now() - this.lastTouchTime < 750) return;
    this.eventManager.emit('tapDetected', {
      x: event.clientX,
      y: event.clientY
    });
  }
  destroy() {
    this.disable();
    this.touchSubscriptions.forEach(unsubscribe => unsubscribe());
    this.onDrag = null;
  }
}
module.exports = MouseDragHandler;

/***/ },

/***/ 123
(module, __unused_webpack_exports, __webpack_require__) {

const {
  isControl,
  ownsEvent
} = __webpack_require__(48);
class TouchHandler {
  constructor(element, eventManager, config, onSwipe) {
    Object.assign(this, {
      element,
      eventManager,
      config,
      onSwipe,
      isHandlerEnabled: false,
      isDragging: false
    });
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    this.boundTouchCancel = this.cancel.bind(this);
  }
  enable() {
    if (!this.config.enableTouch || this.isHandlerEnabled) return;
    this.isHandlerEnabled = true;
    this.element.style.touchAction = 'auto';
    this.element.addEventListener('touchstart', this.boundTouchStart, {
      passive: true
    });
    this.element.addEventListener('touchmove', this.boundTouchMove, {
      passive: false
    });
    this.element.addEventListener('touchend', this.boundTouchEnd, {
      passive: true
    });
    this.element.addEventListener('touchcancel', this.boundTouchCancel, {
      passive: true
    });
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
  cancel() {
    this.isDragging = false;
  }
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
    if (event.touches.length !== 1) {
      this.cancel();
      return;
    }
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
      this.eventManager.emit('tapDetected', {
        x: touch.clientX,
        y: touch.clientY,
        pointerType: 'touch'
      });
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) * 1.5) return;
    const velocity = Math.abs(dy) / time;
    if (Math.abs(dy) < this.config.swipeThreshold && !(Math.abs(dy) >= 30 && velocity >= 0.3)) return;
    const direction = dy > 0 ? 'up' : 'down';
    this.eventManager.emit('swipeDetected', {
      direction,
      distance: Math.abs(dy),
      velocity
    });
    this.onSwipe?.(direction);
  }
  destroy() {
    this.disable();
    this.onSwipe = null;
  }
}
module.exports = TouchHandler;

/***/ },

/***/ 583
(module, __unused_webpack_exports, __webpack_require__) {

const {
  isControl,
  ownsEvent
} = __webpack_require__(48);
class WheelHandler {
  constructor(element, eventManager, config, onWheel) {
    Object.assign(this, {
      element,
      eventManager,
      config,
      onWheel,
      isHandlerEnabled: false,
      lastWheelTime: -Infinity,
      wheelThrottle: 500
    });
    this.boundWheel = this.handleWheel.bind(this);
  }
  enable() {
    if (!this.config.enableWheel || this.isHandlerEnabled) return;
    this.isHandlerEnabled = true;
    this.element.addEventListener('wheel', this.boundWheel, {
      passive: false
    });
  }
  disable() {
    if (!this.isHandlerEnabled) return;
    this.isHandlerEnabled = false;
    this.element.removeEventListener('wheel', this.boundWheel);
  }
  handleWheel(event) {
    if (!this.isHandlerEnabled || event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || isControl(event.target) || !ownsEvent(this.element, event.target)) return;
    const now = Date.now();
    if (now - this.lastWheelTime < this.wheelThrottle) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    this.lastWheelTime = now;
    if (event.cancelable) event.preventDefault();
    const direction = event.deltaY > 0 ? 'down' : 'up';
    this.eventManager.emit('wheelDetected', {
      direction,
      deltaY: event.deltaY
    });
    this.onWheel?.(direction);
  }
  destroy() {
    this.disable();
    this.onWheel = null;
  }
}
module.exports = WheelHandler;

/***/ },

/***/ 686
(module) {

/** Resolve configuration once, before any component captures it. */
class ConfigParser {
  static DEFAULT_CONFIG = {
    aspectRatio: '9:16',
    loop: false,
    autoplay: false,
    autoplayInterval: 5000,
    enableKeyboard: true,
    enableTouch: true,
    enableWheel: true,
    enableMouseDrag: true,
    enableAutoplayPauseOnInteraction: true,
    autoplayResumeDelay: 3000,
    transitionDuration: 350,
    swipeThreshold: 50,
    items: []
  };
  static parse() {
    let userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const input = userConfig && typeof userConfig === 'object' && !Array.isArray(userConfig) ? userConfig : {};
    const config = {
      ...this.DEFAULT_CONFIG
    };
    Object.keys(config).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(input, key)) config[key] = input[key];
    });
    this.validate(config);
    if (config.autoplay && input.loop === undefined) config.loop = true;
    config.items = Array.isArray(config.items) ? config.items.map(item => item && typeof item === 'object' ? {
      ...item
    } : item) : [];
    return config;
  }
  static validate(config) {
    if (!this.isValidAspectRatio(config.aspectRatio)) config.aspectRatio = this.DEFAULT_CONFIG.aspectRatio;
    for (const key of ['loop', 'autoplay', 'enableKeyboard', 'enableTouch', 'enableWheel', 'enableMouseDrag', 'enableAutoplayPauseOnInteraction']) {
      if (typeof config[key] !== 'boolean') config[key] = this.DEFAULT_CONFIG[key];
    }
    for (const [key, minimum] of Object.entries({
      autoplayInterval: 1000,
      autoplayResumeDelay: 0,
      transitionDuration: 0,
      swipeThreshold: 1
    })) {
      if (!Number.isFinite(config[key]) || config[key] < minimum || config[key] > 2147483647) {
        config[key] = this.DEFAULT_CONFIG[key];
      }
    }
  }
  static isValidAspectRatio(ratio) {
    if (typeof ratio !== 'string' || !/^\d+:\d+$/.test(ratio)) return false;
    return ratio.split(':').every(value => Number.isFinite(Number(value)) && Number(value) > 0);
  }
  static parseAspectRatio(ratio) {
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }
}
module.exports = ConfigParser;

/***/ },

/***/ 144
(module) {

/**
 * DataAttributeParser - Parses HTML data-swr attributes
 */
class DataAttributeParser {
  /**
   * Parse SWR data attributes from element
   * @param {HTMLElement} element - Element with data-swr attributes
   * @returns {Object} Configuration object from attributes
   */
  static parseConfig(element) {
    const config = {};

    // Parse aspect ratio
    const aspectRatio = element.getAttribute('data-swr-aspect-ratio');
    if (aspectRatio) config.aspectRatio = aspectRatio;

    // Parse boolean attributes
    const loop = element.getAttribute('data-swr-loop');
    if (loop !== null) config.loop = loop === 'true' || loop === '';
    const autoplay = element.getAttribute('data-swr-autoplay');
    if (autoplay !== null) config.autoplay = autoplay === 'true' || autoplay === '';
    const enableKeyboard = element.getAttribute('data-swr-keyboard');
    if (enableKeyboard !== null) config.enableKeyboard = enableKeyboard === 'true' || enableKeyboard === '';
    const enableTouch = element.getAttribute('data-swr-touch');
    if (enableTouch !== null) config.enableTouch = enableTouch === 'true' || enableTouch === '';
    const enableWheel = element.getAttribute('data-swr-wheel');
    if (enableWheel !== null) config.enableWheel = enableWheel === 'true' || enableWheel === '';
    const enableMouseDrag = element.getAttribute('data-swr-mouse-drag');
    if (enableMouseDrag !== null) config.enableMouseDrag = enableMouseDrag === 'true' || enableMouseDrag === '';

    // Parse numeric attributes
    const autoplayInterval = element.getAttribute('data-swr-autoplay-interval');
    if (autoplayInterval !== null) config.autoplayInterval = Number(autoplayInterval);
    const transitionDuration = element.getAttribute('data-swr-transition');
    if (transitionDuration !== null) config.transitionDuration = Number(transitionDuration);
    const swipeThreshold = element.getAttribute('data-swr-swipe-threshold');
    if (swipeThreshold !== null) config.swipeThreshold = Number(swipeThreshold);
    const pauseOnInteraction = element.getAttribute('data-swr-autoplay-pause-on-interaction');
    if (pauseOnInteraction !== null) config.enableAutoplayPauseOnInteraction = pauseOnInteraction === '' || pauseOnInteraction === 'true';
    const resumeDelay = element.getAttribute('data-swr-autoplay-resume-delay');
    if (resumeDelay !== null) config.autoplayResumeDelay = Number(resumeDelay);
    return config;
  }

  /**
   * Extract items from element with data-swr-item attributes
   * @param {HTMLElement} element - Parent element containing items
   * @returns {Array} Array of item objects
   */
  static parseItems(element) {
    const items = [];
    const itemElements = this.getItemElements(element);
    itemElements.forEach(itemEl => {
      const item = this.parseItemElement(itemEl);
      if (item) items.push(item);
    });
    return items;
  }

  /**
   * Parse a single item element
   * @param {HTMLElement} itemEl - Item element
   * @returns {Object|null} Item object or null if invalid
   */
  static getItemElements(element) {
    return Array.from(element.querySelectorAll('[data-swr-item]')).filter(item => {
      const parentItem = item.parentElement?.closest('[data-swr-item]');
      const owner = item.parentElement?.closest('[data-swr],.swr');
      return (!parentItem || !element.contains(parentItem)) && (!owner || owner === element || !element.contains(owner));
    });
  }
  static parseItemElement(itemEl) {
    // Check if item contains a video
    const videoEl = itemEl.querySelector('video');
    if (videoEl) {
      return this.parseVideoItem(videoEl);
    }

    // Check if item contains an image
    const imgEl = itemEl.querySelector('img');
    if (imgEl) {
      return this.parseImageItem(imgEl);
    }

    // Otherwise treat as HTML content
    return {
      type: 'html',
      content: itemEl.innerHTML
    };
  }

  /**
   * Parse video element to item object
   * @param {HTMLVideoElement} videoEl - Video element
   * @returns {Object} Video item object
   */
  static parseVideoItem(videoEl) {
    const sources = videoEl.querySelectorAll('source');
    let src = '';
    let type = 'video/mp4';
    if (sources.length > 0) {
      src = sources[0].getAttribute('src') || '';
      type = sources[0].getAttribute('type') || 'video/mp4';
    } else {
      src = videoEl.getAttribute('src') || '';
    }
    return {
      type: 'video',
      src,
      mimeType: type,
      autoplay: videoEl.hasAttribute('autoplay'),
      muted: videoEl.hasAttribute('muted'),
      playsinline: videoEl.hasAttribute('playsinline'),
      loop: videoEl.hasAttribute('loop'),
      controls: videoEl.hasAttribute('controls')
    };
  }

  /**
   * Parse image element to item object
   * @param {HTMLImageElement} imgEl - Image element
   * @returns {Object} Image item object
   */
  static parseImageItem(imgEl) {
    return {
      type: 'image',
      src: imgEl.getAttribute('src') || '',
      alt: imgEl.getAttribute('alt') || '',
      title: imgEl.getAttribute('title') || ''
    };
  }
}
if ( true && module.exports) {
  module.exports = DataAttributeParser;
}

/***/ },

/***/ 145
(module) {

/**
 * HTMLRenderer - Renders HTML content items
 */
class HTMLRenderer {
  /**
   * Render HTML item
   * @param {Object} item - Item object with content property
   * @returns {HTMLElement} Rendered element
   */
  render(item) {
    const container = document.createElement('div');
    container.className = 'swr-html-item';
    container.innerHTML = item.content;
    return container;
  }
}
if ( true && module.exports) {
  module.exports = HTMLRenderer;
}

/***/ },

/***/ 825
(module) {

/**
 * ImageRenderer - Renders image items
 */
class ImageRenderer {
  /**
   * Render image item
   * @param {Object} item - Item object with src, alt, title properties
   * @returns {HTMLElement} Rendered element
   */
  render(item) {
    const container = document.createElement('div');
    container.className = 'swr-image-item';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';
    img.title = item.title || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    container.appendChild(img);
    return container;
  }
}
if ( true && module.exports) {
  module.exports = ImageRenderer;
}

/***/ },

/***/ 451
(module) {

/**
 * VideoRenderer - Renders video items
 */
class VideoRenderer {
  /**
   * Render video item
   * @param {Object} item - Item object with src and video properties
   * @returns {HTMLElement} Rendered element
   */
  render(item) {
    const container = document.createElement('div');
    container.className = 'swr-video-item';
    const video = document.createElement('video');
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';

    // Set video attributes
    // SWR owns autoplay; native autoplay would also start hidden slides.
    video.preload = 'metadata';
    video.muted = !!item.muted;
    video.defaultMuted = !!item.muted;
    if (item.playsinline) video.setAttribute('playsinline', 'playsinline');
    if (item.loop) video.setAttribute('loop', 'loop');
    if (item.controls !== false) video.setAttribute('controls', 'controls');

    // Add video source
    const source = document.createElement('source');
    source.src = item.src;
    source.type = item.mimeType || 'video/mp4';
    video.appendChild(source);

    // Fallback text
    video.appendChild(document.createTextNode('Your browser does not support the video tag.'));
    container.appendChild(video);
    return container;
  }
}
if ( true && module.exports) {
  module.exports = VideoRenderer;
}

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ swr)
});

// UNUSED EXPORTS: AutoplayHandler, ConfigParser, DataAttributeParser, EventManager, HTMLRenderer, ImageRenderer, KeyboardHandler, MediaManager, Navigation, Roll, SWR, TouchHandler, VideoRenderer, WheelHandler

;// ./src/css/swr.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ./src/js/parsers/ConfigParser.js
var ConfigParser = __webpack_require__(686);
var ConfigParser_default = /*#__PURE__*/__webpack_require__.n(ConfigParser);
// EXTERNAL MODULE: ./src/js/parsers/DataAttributeParser.js
var DataAttributeParser = __webpack_require__(144);
var DataAttributeParser_default = /*#__PURE__*/__webpack_require__.n(DataAttributeParser);
// EXTERNAL MODULE: ./src/js/core/EventManager.js
var EventManager = __webpack_require__(943);
var EventManager_default = /*#__PURE__*/__webpack_require__.n(EventManager);
// EXTERNAL MODULE: ./src/js/core/MediaManager.js
var MediaManager = __webpack_require__(979);
var MediaManager_default = /*#__PURE__*/__webpack_require__.n(MediaManager);
// EXTERNAL MODULE: ./src/js/core/Navigation.js
var Navigation = __webpack_require__(70);
var Navigation_default = /*#__PURE__*/__webpack_require__.n(Navigation);
// EXTERNAL MODULE: ./src/js/core/Roll.js
var Roll = __webpack_require__(43);
var Roll_default = /*#__PURE__*/__webpack_require__.n(Roll);
// EXTERNAL MODULE: ./src/js/handlers/TouchHandler.js
var TouchHandler = __webpack_require__(123);
var TouchHandler_default = /*#__PURE__*/__webpack_require__.n(TouchHandler);
// EXTERNAL MODULE: ./src/js/handlers/KeyboardHandler.js
var KeyboardHandler = __webpack_require__(135);
var KeyboardHandler_default = /*#__PURE__*/__webpack_require__.n(KeyboardHandler);
// EXTERNAL MODULE: ./src/js/handlers/AutoplayHandler.js
var AutoplayHandler = __webpack_require__(75);
var AutoplayHandler_default = /*#__PURE__*/__webpack_require__.n(AutoplayHandler);
// EXTERNAL MODULE: ./src/js/handlers/WheelHandler.js
var WheelHandler = __webpack_require__(583);
var WheelHandler_default = /*#__PURE__*/__webpack_require__.n(WheelHandler);
// EXTERNAL MODULE: ./src/js/renderers/HTMLRenderer.js
var HTMLRenderer = __webpack_require__(145);
var HTMLRenderer_default = /*#__PURE__*/__webpack_require__.n(HTMLRenderer);
// EXTERNAL MODULE: ./src/js/renderers/VideoRenderer.js
var VideoRenderer = __webpack_require__(451);
var VideoRenderer_default = /*#__PURE__*/__webpack_require__.n(VideoRenderer);
// EXTERNAL MODULE: ./src/js/renderers/ImageRenderer.js
var ImageRenderer = __webpack_require__(825);
var ImageRenderer_default = /*#__PURE__*/__webpack_require__.n(ImageRenderer);
// EXTERNAL MODULE: ./src/js/handlers/MouseDragHandler.js
var MouseDragHandler = __webpack_require__(873);
var MouseDragHandler_default = /*#__PURE__*/__webpack_require__.n(MouseDragHandler);
;// ./src/js/index.js














const INSTANCE = Symbol.for('senangwebs-roll.instance');
const ROOT_ATTRIBUTES = ['class', 'role', 'aria-roledescription', 'aria-label', 'tabindex', 'data-swr-initialized'];
const SLIDE_ATTRIBUTES = ['role', 'aria-roledescription', 'aria-label', 'aria-hidden', 'inert'];
const capture = (element, names) => names.map(name => [name, element.getAttribute(name)]);
const restore = (element, attributes) => attributes.forEach(_ref => {
  let [name, value] = _ref;
  if (value === null) element.removeAttribute(name);else element.setAttribute(name, value);
});
const resolveElement = selector => {
  if (typeof selector !== 'string') return selector;
  if (typeof document === 'undefined') return null;
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
};

/** Browser-independent imports; DOM access begins only at construction/initAll. */
class SWR {
  static getInstance(selector) {
    return resolveElement(selector)?.[INSTANCE] || null;
  }
  static initAll(root) {
    const scope = root || (typeof document !== 'undefined' ? document : null);
    if (!scope?.querySelectorAll) return [];
    const elements = [...(scope.matches?.('[data-swr]') ? [scope] : []), ...scope.querySelectorAll('[data-swr]')];
    return elements.map(element => SWR.getInstance(element) || new SWR(element));
  }
  constructor(selector) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.element = resolveElement(selector);
    if (!this.element || this.element.nodeType !== 1 || !this.element.ownerDocument) {
      throw new Error('Element not found: ' + selector);
    }
    if (this.element[INSTANCE]) return this.element[INSTANCE];
    this.document = this.element.ownerDocument;
    this.window = this.document.defaultView;
    this.config = ConfigParser_default().parse({
      ...(config && typeof config === 'object' ? config : {}),
      ...DataAttributeParser_default().parseConfig(this.element)
    });
    this.eventManager = new (EventManager_default())();
    this.mediaManager = new (MediaManager_default())(this.eventManager);
    this.config.items = this.config.items.filter(item => this.mediaManager.validateItem(item));
    this.navigation = new (Navigation_default())(this.eventManager, this.config);
    this.roll = new (Roll_default())(this.element, this.eventManager, this.config);
    this.renderers = {
      html: new (HTMLRenderer_default())(),
      video: new (VideoRenderer_default())(),
      image: new (ImageRenderer_default())()
    };
    this.isInitialized = false;
    this.isDestroyed = false;
    this.isMutating = false;
    this.isNavigating = false;
    this.isVisible = true;
    this.originalFocus = this.element.contains(this.document.activeElement) ? this.document.activeElement : null;
    this.originalChildren = Array.from(this.element.childNodes);
    this.originalAttributes = capture(this.element, ROOT_ATTRIBUTES);
    this.originalItems = DataAttributeParser_default().getItemElements(this.element).map(element => ({
      element,
      parent: element.parentNode,
      next: element.nextSibling,
      attributes: capture(element, SLIDE_ATTRIBUTES)
    }));
    this.slideAttributes = new Map();
    this.videoAutoplay = new Map();
    this.mediaGeneration = 0;
    this.motionQuery = this.window?.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.boundMotion = event => {
      if ((event.matches ?? this.motionQuery.matches) && this.roll?.isAnimating) {
        const index = this.roll.currentIndex;
        this.roll.cancelTransition();
        this.eventManager.emit('slideCompleted', {
          index
        });
      }
    };
    Object.defineProperty(this.element, INSTANCE, {
      value: this,
      configurable: true
    });
    try {
      this.init();
    } catch (error) {
      this.destroy();
      throw error;
    }
  }
  init() {
    const validDOM = this.originalItems.filter(_ref2 => {
      let {
        element
      } = _ref2;
      return this.mediaManager.validateItem(DataAttributeParser_default().parseItemElement(element));
    });
    this.roll.initialize(validDOM.map(entry => entry.element));
    if (this.originalItems.length) {
      validDOM.forEach(_ref3 => {
        let {
          element
        } = _ref3;
        return this.mediaManager.addItem(DataAttributeParser_default().parseItemElement(element), null, false);
      });
    } else {
      this.config.items.forEach(item => {
        if (this.mediaManager.addItem(item, null, false)) {
          const index = this.mediaManager.getItemCount() - 1;
          this.roll.renderItem(index, this.getRenderer(item.type), item);
        }
      });
    }
    this.navigation.initialize(this.mediaManager.getItemCount());
    if (!this.element.hasAttribute('role')) this.element.setAttribute('role', 'region');
    if (!this.element.hasAttribute('aria-roledescription')) this.element.setAttribute('aria-roledescription', 'carousel');
    if (!this.element.hasAttribute('aria-label') && !this.element.hasAttribute('aria-labelledby')) {
      this.element.setAttribute('aria-label', 'Media roll');
    }
    this.liveRegion = this.document.createElement('div');
    this.liveRegion.className = 'swr-status';
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.element.appendChild(this.liveRegion);
    if (!this.element.hasAttribute('tabindex')) this.element.setAttribute('tabindex', this.config.enableKeyboard ? '0' : '-1');
    this.setupHandlers();
    this.boundVisibility = () => this.updateVisibility();
    this.document.addEventListener('visibilitychange', this.boundVisibility);
    this.boundMediaPlay = event => {
      if (event.target.tagName !== 'VIDEO' || event.target.closest('.swr') !== this.element) return;
      const active = this.roll?.itemElements[this.getCurrentIndex()];
      if (this.isDestroyed || this.document.hidden || !this.isVisible || !active?.contains(event.target)) this.pauseVideo(event.target);
    };
    this.element.addEventListener('play', this.boundMediaPlay, true);
    if (this.window?.IntersectionObserver) {
      const bounds = this.element.getBoundingClientRect();
      this.isVisible = this.element.getClientRects().length > 0 && bounds.bottom > 0 && bounds.right > 0 && bounds.top < this.window.innerHeight && bounds.left < this.window.innerWidth;
      this.visibilityObserver = new this.window.IntersectionObserver(entries => {
        if (this.isDestroyed) return;
        this.isVisible = entries[entries.length - 1].isIntersecting;
        this.updateVisibility();
      });
      this.visibilityObserver.observe(this.element);
    }
    this.motionQuery?.addEventListener?.('change', this.boundMotion);
    this.updateAccessibility();
    if (this.isDestroyed) return;
    if (this.originalFocus) {
      const active = this.roll.itemElements[this.getCurrentIndex()];
      const target = active?.contains(this.originalFocus) || this.originalFocus === this.element ? this.originalFocus : this.element;
      target.focus({
        preventScroll: true
      });
      this.originalFocus = null;
    }
    if (this.isDestroyed) return;
    this.updateVisibility();
    this.element.setAttribute('data-swr-initialized', 'true');
    this.isInitialized = true;
    if (this.config.autoplay && this.getTotalItems() > 1) this.autoplayHandler.play();
    Promise.resolve().then(() => {
      if (!this.isDestroyed) this.eventManager.emit('initialized', {
        totalItems: this.getTotalItems()
      });
    });
  }
  setupHandlers() {
    this.touchHandler = new (TouchHandler_default())(this.roll.viewport, this.eventManager, this.config, direction => this.handleSwipe(direction));
    this.keyboardHandler = new (KeyboardHandler_default())(this.element, this.eventManager, this.config, key => this.handleKeyPress(key));
    this.wheelHandler = new (WheelHandler_default())(this.roll.viewport, this.eventManager, this.config, direction => this.handleWheel(direction));
    this.mouseDragHandler = new (MouseDragHandler_default())(this.roll.viewport, this.eventManager, this.config, direction => this.handleMouseDrag(direction));
    this.autoplayHandler = new (AutoplayHandler_default())(this.eventManager, this.config, () => this.handleAutoplayTick());
    [this.touchHandler, this.keyboardHandler, this.wheelHandler, this.mouseDragHandler].forEach(handler => handler.enable());
    for (const event of ['swipeDetected', 'wheelDetected', 'dragDetected', 'keyboardEvent']) {
      this.eventManager.on(event, data => {
        if (this.isDestroyed || event === 'keyboardEvent' && data.key === ' ') return;
        if (this.config.enableAutoplayPauseOnInteraction) this.autoplayHandler.pauseTemporarily();
      });
    }
    this.eventManager.on('tapDetected', () => this.togglePlayback());
    this.eventManager.on('slideCompleted', () => {
      if (!this.isDestroyed && this.autoplayHandler.wantsPlayback && !this.config.loop && this.navigation.isAtEnd()) this.pause();
    });
  }
  getRenderer(type) {
    return this.renderers[type] || null;
  }
  renderItems() {
    this.mediaManager.getItems().forEach((item, index) => this.roll.renderItem(index, this.getRenderer(item.type), item));
  }
  handleSwipe(direction) {
    if (direction === 'up') this.next();else if (direction === 'down') this.prev();
  }
  handleMouseDrag(direction) {
    this.handleSwipe(direction);
  }
  handleWheel(direction) {
    if (direction === 'down') this.next();else if (direction === 'up') this.prev();
  }
  handleKeyPress(key) {
    if (key === 'ArrowDown') this.next();else if (key === 'ArrowUp') this.prev();else if (key === ' ') this.togglePlayback();
  }
  togglePlayback() {
    if (this.isDestroyed) return;
    if (this.autoplayHandler.wantsPlayback) this.pause();else this.play();
  }
  handleAutoplayTick() {
    if (this.isDestroyed) return;
    if (this.getTotalItems() < 2 || !this.config.loop && this.navigation.isAtEnd()) {
      this.pause();
      return;
    }
    this.navigate(this.getCurrentIndex() + 1, 'up', false);
  }
  next() {
    this.navigate(this.getCurrentIndex() + 1, 'up');
  }
  prev() {
    this.navigate(this.getCurrentIndex() - 1, 'down');
  }
  goTo(index) {
    this.navigate(index);
  }
  navigate(index, direction) {
    let manual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (this.isDestroyed || this.isMutating || this.isNavigating || this.roll.isAnimating || this.getTotalItems() < 2 || !Number.isInteger(index)) return;
    const count = this.getTotalItems();
    const oldIndex = this.getCurrentIndex();
    const isWrapping = !!direction && this.config.loop && (index < 0 || index >= count);
    const target = isWrapping ? index < 0 ? count - 1 : 0 : Math.max(0, Math.min(index, count - 1));
    if (target === oldIndex) return;
    this.isNavigating = true;
    try {
      this.navigation.currentIndex = target;
      // Query the current preference: WebKit can update a retained MediaQueryList later than a fresh query.
      const reducedMotion = !!this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      this.roll.slideTo(target, {
        isWrapping,
        direction,
        immediate: reducedMotion,
        silent: true
      });
      this.updateAccessibility();
      if (this.isDestroyed) return;
      this.syncMedia();
      if (this.isDestroyed) return;
      if (manual) this.liveRegion.textContent = 'Slide ' + (target + 1) + ' of ' + count;
      this.eventManager.emit('navigationChanged', {
        oldIndex,
        newIndex: target,
        totalItems: count
      });
      if (!this.isDestroyed) this.eventManager.emit('slideStarted', {
        index: target
      });
    } finally {
      this.isNavigating = false;
    }
  }
  addItem(item) {
    let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (this.isDestroyed || this.isMutating || this.isNavigating || !this.mediaManager.validateItem(item)) return;
    this.isMutating = true;
    try {
      this.roll.cancelTransition();
      const oldIndex = this.getCurrentIndex();
      const previousCount = this.getTotalItems();
      const actualIndex = this.mediaManager.resolveInsertionIndex(index);
      this.mediaManager.addItem(item, actualIndex, false);
      const element = this.roll.addItemElement(actualIndex);
      const nextIndex = previousCount && actualIndex <= oldIndex ? oldIndex + 1 : oldIndex;
      this.navigation.initialize(this.getTotalItems(), nextIndex);
      this.roll.snapTo(this.getCurrentIndex());
      this.updateAccessibility();
      this.eventManager.emit('beforeRender', {
        index: actualIndex,
        item
      });
      if (this.isDestroyed) return;
      element.appendChild(this.getRenderer(item.type).render(item));
      this.syncMedia();
      if (this.isDestroyed) return;
      this.eventManager.emit('afterRender', {
        index: actualIndex,
        item
      });
      if (this.isDestroyed) return;
      this.eventManager.emit('itemAdded', {
        item: this.mediaManager.getItem(actualIndex),
        index: actualIndex
      });
      if (!this.isDestroyed && oldIndex !== this.getCurrentIndex()) this.emitNavigation(oldIndex);
    } finally {
      this.isMutating = false;
    }
  }
  removeItem(index) {
    if (this.isDestroyed || this.isMutating || this.isNavigating || !Number.isInteger(index) || index < 0 || index >= this.getTotalItems()) return;
    this.isMutating = true;
    try {
      this.roll.cancelTransition();
      const oldIndex = this.getCurrentIndex();
      const element = this.roll.itemElements[index];
      const shouldFocus = element.contains(this.document.activeElement);
      element.querySelectorAll('video').forEach(video => {
        this.pauseVideo(video);
        if (!this.originalItems.some(entry => entry.element.contains(video))) this.videoAutoplay.delete(video);
      });
      const item = this.mediaManager.removeItem(index, false);
      element.remove();
      this.slideAttributes.delete(element);
      this.roll.updateItemElements();
      const target = index < oldIndex ? oldIndex - 1 : oldIndex;
      this.navigation.initialize(this.getTotalItems(), target);
      this.roll.snapTo(this.getCurrentIndex());
      if (shouldFocus) this.element.focus({
        preventScroll: true
      });
      if (this.isDestroyed) return;
      this.updateAccessibility();
      if (this.isDestroyed) return;
      this.syncMedia();
      if (this.isDestroyed) return;
      this.eventManager.emit('itemRemoved', {
        item,
        index
      });
      if (!this.isDestroyed && (oldIndex !== this.getCurrentIndex() || index === oldIndex)) this.emitNavigation(oldIndex);
      if (!this.isDestroyed && this.getTotalItems() < 2) this.pause();
    } finally {
      this.isMutating = false;
    }
  }
  emitNavigation(oldIndex) {
    this.eventManager.emit('navigationChanged', {
      oldIndex,
      newIndex: this.getCurrentIndex(),
      totalItems: this.getTotalItems()
    });
  }
  updateAccessibility() {
    const count = this.getTotalItems();
    this.roll.itemElements.forEach((element, index) => {
      if (this.isDestroyed) return;
      if (!this.slideAttributes.has(element)) this.slideAttributes.set(element, capture(element, SLIDE_ATTRIBUTES));
      const active = index === this.getCurrentIndex();
      if (!active && element.contains(this.document.activeElement)) this.element.focus({
        preventScroll: true
      });
      if (this.isDestroyed) return;
      if (!element.hasAttribute('role')) element.setAttribute('role', 'group');
      element.setAttribute('aria-roledescription', 'slide');
      // Preserve consumer labels; update only the generated positional label.
      const original = this.slideAttributes.get(element).find(_ref4 => {
        let [name] = _ref4;
        return name === 'aria-label';
      })[1];
      if (original === null) element.setAttribute('aria-label', index + 1 + ' of ' + count);
      element.setAttribute('aria-hidden', String(!active));
      element.toggleAttribute('inert', !active);
    });
  }
  updateVisibility() {
    if (this.isDestroyed) return;
    const hidden = this.document.hidden || !this.isVisible;
    this.autoplayHandler.setSuspended('visibility', hidden);
    this.syncMedia();
  }
  pauseVideo(video) {
    try {
      video.pause();
    } catch {/* Detached/unsupported media still permits cleanup. */}
  }
  syncMedia() {
    if (this.isDestroyed) return;
    const generation = ++this.mediaGeneration;
    const activeElement = this.roll.itemElements[this.getCurrentIndex()];
    const hidden = this.document.hidden || !this.isVisible;
    this.roll.itemElements.forEach((element, index) => {
      if (this.isDestroyed) return;
      element.querySelectorAll('video').forEach(video => {
        if (this.isDestroyed) return;
        if (video.closest('.swr') !== this.element) return;
        if (!this.videoAutoplay.has(video)) {
          this.videoAutoplay.set(video, video.hasAttribute('autoplay'));
          video.removeAttribute('autoplay');
        }
        const item = this.mediaManager.getItem(index);
        const requestsAutoplay = item?.type === 'video' ? item.autoplay : this.videoAutoplay.get(video);
        if (hidden || element !== activeElement) {
          this.pauseVideo(video);
          return;
        }
        if (!requestsAutoplay || !video.paused) return;
        try {
          const result = video.play();
          result?.then?.(() => {
            if (this.isDestroyed || generation !== this.mediaGeneration) {
              const current = this.roll?.itemElements[this.getCurrentIndex()];
              if (this.isDestroyed || this.document.hidden || !this.isVisible || !current?.contains(video)) this.pauseVideo(video);
            }
          }, error => {
            if (!this.isDestroyed && generation === this.mediaGeneration) {
              this.eventManager.emit('mediaPlaybackError', {
                index,
                error
              });
            }
          });
        } catch (error) {
          this.eventManager.emit('mediaPlaybackError', {
            index,
            error
          });
        }
      });
    });
  }
  getCurrentIndex() {
    return this.navigation?.getCurrentIndex() ?? 0;
  }
  getTotalItems() {
    return this.mediaManager?.getItemCount() ?? 0;
  }
  play() {
    if (!this.isDestroyed && this.getTotalItems() > 1) this.autoplayHandler.play();
  }
  pause() {
    if (!this.isDestroyed) this.autoplayHandler.pause();
  }
  isPlaying() {
    return !!this.autoplayHandler?.isAutoplayActive();
  }
  on(event, callback) {
    return this.isDestroyed ? () => {} : this.eventManager.on(event, callback);
  }
  off(event, callback) {
    this.eventManager?.off(event, callback);
  }
  getConfig() {
    return {
      ...this.config,
      items: this.config.items.map(item => item && typeof item === 'object' ? {
        ...item
      } : item)
    };
  }
  destroy() {
    if (this.isDestroyed) return;
    const focusedNode = this.element.contains(this.document.activeElement) ? this.document.activeElement : null;
    this.isDestroyed = true;
    ++this.mediaGeneration;
    this.document.removeEventListener('visibilitychange', this.boundVisibility);
    this.element.removeEventListener('play', this.boundMediaPlay, true);
    this.visibilityObserver?.disconnect();
    this.motionQuery?.removeEventListener?.('change', this.boundMotion);
    for (const key of ['touchHandler', 'keyboardHandler', 'wheelHandler', 'mouseDragHandler', 'autoplayHandler']) {
      this[key]?.destroy();
      this[key] = null;
    }
    this.videoAutoplay.forEach((autoplay, video) => {
      this.pauseVideo(video);
      if (autoplay) video.setAttribute('autoplay', '');
    });
    this.roll?.destroy();
    this.slideAttributes.forEach((attributes, element) => restore(element, attributes));
    // Reverse order restores saved nextSibling anchors before preceding nodes.
    [...this.originalItems].reverse().forEach(entry => {
      entry.parent.insertBefore(entry.element, entry.next?.parentNode === entry.parent ? entry.next : null);
      restore(entry.element, entry.attributes);
    });
    this.element.replaceChildren(...this.originalChildren);
    restore(this.element, this.originalAttributes);
    if (this.element[INSTANCE] === this) delete this.element[INSTANCE];
    this.mediaManager.clear(false);
    this.mediaManager = null;
    this.navigation = null;
    this.roll = null;
    this.isInitialized = false;
    this.eventManager.emit('itemsCleared');
    this.eventManager.emit('destroy');
    this.eventManager.clear();
    this.slideAttributes.clear();
    this.videoAutoplay.clear();
    this.originalChildren = [];
    this.originalItems = [];
    this.originalFocus = null;
    if (focusedNode && this.element.contains(focusedNode) && (this.document.activeElement === this.document.body || this.element.contains(this.document.activeElement))) {
      focusedNode.focus({
        preventScroll: true
      });
    }
  }
}
/* harmony default export */ const js = (SWR);
;// ./src/swr.js
/**
 * SenangWebs Roll (SWR) - Main Bundle Entry Point
 * This file bundles all components together for distribution
 */

// Import CSS


// Import all modules - webpack will handle the CommonJS conversion















// Make all classes globally available for browser usage
if (typeof window !== 'undefined') {
  window.SWR = js;
  window.ConfigParser = (ConfigParser_default());
  window.DataAttributeParser = (DataAttributeParser_default());
  window.EventManager = (EventManager_default());
  window.MediaManager = (MediaManager_default());
  window.Navigation = (Navigation_default());
  window.Roll = (Roll_default());
  window.TouchHandler = (TouchHandler_default());
  window.KeyboardHandler = (KeyboardHandler_default());
  window.AutoplayHandler = (AutoplayHandler_default());
  window.WheelHandler = (WheelHandler_default());
  window.HTMLRenderer = (HTMLRenderer_default());
  window.VideoRenderer = (VideoRenderer_default());
  window.ImageRenderer = (ImageRenderer_default());

  // Auto-initialize all rolls with data-swr attribute
  // This runs when DOM is ready
  const initDataAttributeRolls = () => {
    js.initAll(document);
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAttributeRolls, {
      once: true
    });
  } else {
    // DOM is already loaded
    initDataAttributeRolls();
  }
}

// Export for ES modules and UMD
/* harmony default export */ const swr = (js);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=swr.js.map