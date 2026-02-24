(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SWR"] = factory();
	else
		root["SWR"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/swr.css":
/*!*************************!*\
  !*** ./src/css/swr.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/core/EventManager.js":
/*!*************************************!*\
  !*** ./src/js/core/EventManager.js ***!
  \*************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * EventManager - Handles custom event emission and subscription
 */
var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    _classCallCheck(this, EventManager);
    this.listeners = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  return _createClass(EventManager, [{
    key: "on",
    value: function on(event, callback) {
      var _this = this;
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);

      // Return unsubscribe function
      return function () {
        return _this.off(event, callback);
      };
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
  }, {
    key: "off",
    value: function off(event, callback) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(function (cb) {
        return cb !== callback;
      });

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
  }, {
    key: "emit",
    value: function emit(event, data) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach(function (callback) {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in event listener for \"".concat(event, "\":"), error);
        }
      });
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
  }, {
    key: "clearEvent",
    value: function clearEvent(event) {
      if (this.listeners[event]) {
        delete this.listeners[event];
      }
    }

    /**
     * Remove all listeners
     */
  }, {
    key: "clear",
    value: function clear() {
      this.listeners = {};
    }

    /**
     * Get number of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
  }, {
    key: "getListenerCount",
    value: function getListenerCount(event) {
      return this.listeners[event] ? this.listeners[event].length : 0;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = EventManager;
}

/***/ }),

/***/ "./src/js/core/MediaManager.js":
/*!*************************************!*\
  !*** ./src/js/core/MediaManager.js ***!
  \*************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * MediaManager - Manages media items (add, remove, retrieve)
 */
var MediaManager = /*#__PURE__*/function () {
  function MediaManager(eventManager) {
    _classCallCheck(this, MediaManager);
    this.items = [];
    this.eventManager = eventManager;
  }

  /**
   * Add a new item to the roll
   * @param {Object} item - Item object {type, src/content, ...}
   * @param {number} index - Optional index to insert at
   * @returns {boolean} Success status
   */
  return _createClass(MediaManager, [{
    key: "addItem",
    value: function addItem(item) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!this.validateItem(item)) {
        console.warn('Invalid item:', item);
        return false;
      }
      if (index !== null && index >= 0 && index <= this.items.length) {
        this.items.splice(index, 0, item);
      } else {
        this.items.push(item);
      }
      this.eventManager.emit('itemAdded', {
        item: item,
        index: this.items.indexOf(item)
      });
      return true;
    }

    /**
     * Remove an item by index
     * @param {number} index - Index of item to remove
     * @returns {Object|null} Removed item or null if invalid index
     */
  }, {
    key: "removeItem",
    value: function removeItem(index) {
      if (index < 0 || index >= this.items.length) {
        console.warn('Invalid item index:', index);
        return null;
      }
      var removed = this.items.splice(index, 1)[0];
      this.eventManager.emit('itemRemoved', {
        item: removed,
        index: index
      });
      return removed;
    }

    /**
     * Get item by index
     * @param {number} index - Item index
     * @returns {Object|null} Item or null if invalid index
     */
  }, {
    key: "getItem",
    value: function getItem(index) {
      if (index < 0 || index >= this.items.length) {
        return null;
      }
      return this.items[index];
    }

    /**
     * Get all items
     * @returns {Array} Array of all items
     */
  }, {
    key: "getItems",
    value: function getItems() {
      return _toConsumableArray(this.items);
    }

    /**
     * Get total number of items
     * @returns {number} Total items count
     */
  }, {
    key: "getItemCount",
    value: function getItemCount() {
      return this.items.length;
    }

    /**
     * Update an item at index
     * @param {number} index - Item index
     * @param {Object} updates - Updated properties
     * @returns {boolean} Success status
     */
  }, {
    key: "updateItem",
    value: function updateItem(index, updates) {
      if (index < 0 || index >= this.items.length) {
        console.warn('Invalid item index:', index);
        return false;
      }
      this.items[index] = _objectSpread(_objectSpread({}, this.items[index]), updates);
      this.eventManager.emit('itemUpdated', {
        item: this.items[index],
        index: index
      });
      return true;
    }

    /**
     * Clear all items
     */
  }, {
    key: "clear",
    value: function clear() {
      this.items = [];
      this.eventManager.emit('itemsCleared');
    }

    /**
     * Validate item object structure
     * @param {Object} item - Item to validate
     * @returns {boolean} Is valid
     */
  }, {
    key: "validateItem",
    value: function validateItem(item) {
      if (_typeof(item) !== 'object' || item === null) {
        return false;
      }
      var type = item.type;
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
      console.warn("Unknown item type: ".concat(type));
      return false;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = MediaManager;
}

/***/ }),

/***/ "./src/js/core/Navigation.js":
/*!***********************************!*\
  !*** ./src/js/core/Navigation.js ***!
  \***********************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Navigation - Handles navigation logic (next, prev, goTo)
 */
var Navigation = /*#__PURE__*/function () {
  function Navigation(eventManager, config) {
    _classCallCheck(this, Navigation);
    this.eventManager = eventManager;
    this.config = config;
    this.currentIndex = 0;
    this.totalItems = 0;
  }

  /**
   * Initialize navigation with total items count
   * @param {number} totalItems - Total number of items
   */
  return _createClass(Navigation, [{
    key: "initialize",
    value: function initialize(totalItems) {
      this.totalItems = totalItems;
      this.currentIndex = 0;
    }

    /**
     * Go to next item
     * @returns {Object} Navigation result {index, isWrapping, direction}
     */
  }, {
    key: "next",
    value: function next() {
      if (this.totalItems === 0) return {
        index: this.currentIndex,
        isWrapping: false,
        direction: 'up'
      };
      var nextIndex = this.currentIndex + 1;
      var isWrapping = false;
      if (nextIndex >= this.totalItems) {
        if (this.config.loop) {
          nextIndex = 0;
          isWrapping = true;
        } else {
          nextIndex = this.totalItems - 1;
        }
      }
      var result = this.goTo(nextIndex);
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
  }, {
    key: "prev",
    value: function prev() {
      if (this.totalItems === 0) return {
        index: this.currentIndex,
        isWrapping: false,
        direction: 'down'
      };
      var prevIndex = this.currentIndex - 1;
      var isWrapping = false;
      if (prevIndex < 0) {
        if (this.config.loop) {
          prevIndex = this.totalItems - 1;
          isWrapping = true;
        } else {
          prevIndex = 0;
        }
      }
      var result = this.goTo(prevIndex);
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
  }, {
    key: "goTo",
    value: function goTo(index) {
      if (this.totalItems === 0) {
        console.warn('No items available for navigation');
        return this.currentIndex;
      }

      // Clamp index to valid range
      var validIndex = Math.max(0, Math.min(index, this.totalItems - 1));
      if (validIndex === this.currentIndex) {
        return this.currentIndex;
      }
      var oldIndex = this.currentIndex;
      this.currentIndex = validIndex;
      this.eventManager.emit('navigationChanged', {
        oldIndex: oldIndex,
        newIndex: this.currentIndex,
        totalItems: this.totalItems
      });
      return this.currentIndex;
    }

    /**
     * Get current index
     * @returns {number} Current index
     */
  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      return this.currentIndex;
    }

    /**
     * Check if at first item
     * @returns {boolean}
     */
  }, {
    key: "isAtStart",
    value: function isAtStart() {
      return this.currentIndex === 0;
    }

    /**
     * Check if at last item
     * @returns {boolean}
     */
  }, {
    key: "isAtEnd",
    value: function isAtEnd() {
      return this.currentIndex === this.totalItems - 1;
    }

    /**
     * Check if can go to next
     * @returns {boolean}
     */
  }, {
    key: "canGoNext",
    value: function canGoNext() {
      return this.config.loop || !this.isAtEnd();
    }

    /**
     * Check if can go to previous
     * @returns {boolean}
     */
  }, {
    key: "canGoPrev",
    value: function canGoPrev() {
      return this.config.loop || !this.isAtStart();
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = Navigation;
}

/***/ }),

/***/ "./src/js/core/Roll.js":
/*!*****************************!*\
  !*** ./src/js/core/Roll.js ***!
  \*****************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Roll - Core roll logic (positioning, animations)
 */
var Roll = /*#__PURE__*/function () {
  function Roll(element, eventManager, config) {
    _classCallCheck(this, Roll);
    this.element = element;
    this.eventManager = eventManager;
    this.config = config;
    this.currentIndex = 0;
    this.container = null;
    this.viewport = null;
    this.itemElements = [];
    this.isAnimating = false;
    this.transitionId = null;
  }

  /**
   * Initialize roll DOM structure
   */
  return _createClass(Roll, [{
    key: "initialize",
    value: function initialize() {
      this.setupDOM();
      this.setupStyles();
    }

    /**
     * Setup roll DOM structure
     */
  }, {
    key: "setupDOM",
    value: function setupDOM() {
      var _this = this;
      // Create viewport container
      this.viewport = document.createElement('div');
      this.viewport.className = 'swr-viewport';

      // Create scrollable container
      this.container = document.createElement('div');
      this.container.className = 'swr-container';

      // Move existing items to container
      var existingItems = this.element.querySelectorAll('[data-swr-item]');
      existingItems.forEach(function (item) {
        _this.container.appendChild(item.cloneNode(true));
      });
      this.viewport.appendChild(this.container);
      this.element.innerHTML = '';
      this.element.appendChild(this.viewport);

      // Add SWR class to main element
      this.element.classList.add('swr');

      // Update item elements reference
      this.updateItemElements();
    }

    /**
     * Setup initial styles
     */
  }, {
    key: "setupStyles",
    value: function setupStyles() {
      // Let CSS handle the responsive aspect ratio (16:9 desktop, 9:16 mobile)
      // Only apply inline if it strictly differs from the CSS default or is custom mapped.
      // For now, we rely on the CSS, but we can set a CSS variable if needed in the future.
      this.viewport.style.position = 'relative';
      this.viewport.style.width = '100%';
      // Set aspect ratio directly for modern browsers, letting CSS media queries handle default if not specified.
      // However, if a custom ratio is defined that isn't the default '9:16', we apply it here.
      if (this.config.aspectRatio && this.config.aspectRatio !== '9:16') {
        var _this$config$aspectRa = this.config.aspectRatio.split(':').map(Number),
          _this$config$aspectRa2 = _slicedToArray(_this$config$aspectRa, 2),
          width = _this$config$aspectRa2[0],
          height = _this$config$aspectRa2[1];
        this.viewport.style.aspectRatio = "".concat(width, " / ").concat(height);
      }
      this.viewport.style.overflow = 'hidden';

      // Setup container for vertical scrolling (Instagram Reels style)
      this.container.style.position = 'absolute';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'column';
      this.container.style.transition = "transform ".concat(this.config.transitionDuration, "ms ease-in-out");
      this.container.style.transform = 'translateY(0)';
    }

    /**
     * Parse aspect ratio string to numeric value
     * @param {string} ratio - Aspect ratio (e.g., "9:16")
     * @returns {number}
     */
  }, {
    key: "parseAspectRatio",
    value: function parseAspectRatio(ratio) {
      var _ratio$split$map = ratio.split(':').map(Number),
        _ratio$split$map2 = _slicedToArray(_ratio$split$map, 2),
        width = _ratio$split$map2[0],
        height = _ratio$split$map2[1];
      return width / height;
    }

    /**
     * Update item elements reference
     */
  }, {
    key: "updateItemElements",
    value: function updateItemElements() {
      this.itemElements = Array.from(this.container.querySelectorAll('[data-swr-item]'));
    }

    /**
     * Add item element to container
     * @param {number} index - Optional index to insert at
     * @returns {HTMLElement} Created item element
     */
  }, {
    key: "addItemElement",
    value: function addItemElement() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var itemElement = document.createElement('div');
      itemElement.setAttribute('data-swr-item', '');
      itemElement.style.flex = '0 0 100%';
      itemElement.style.width = '100%';
      itemElement.style.height = '100%';
      itemElement.style.overflow = 'hidden';
      if (index !== null && index >= 0 && index < this.container.children.length) {
        this.container.insertBefore(itemElement, this.container.children[index]);
      } else {
        this.container.appendChild(itemElement);
      }
      this.updateItemElements();
      return itemElement;
    }

    /**
     * Render item at index
     * @param {number} index - Item index
     * @param {Object} renderer - Renderer instance
     * @param {Object} item - Item data
     */
  }, {
    key: "renderItem",
    value: function renderItem(index, renderer, item) {
      // Create item elements until we have enough
      while (index >= this.itemElements.length) {
        this.addItemElement();
      }
      if (index < 0 || index >= this.itemElements.length) {
        console.warn('Invalid item index:', index);
        return;
      }
      this.eventManager.emit('beforeRender', {
        index: index,
        item: item
      });
      var element = this.itemElements[index];
      element.innerHTML = '';
      element.appendChild(renderer.render(item));
      this.eventManager.emit('afterRender', {
        index: index,
        item: item
      });
    }

    /**
     * Slide to item at index
     * @param {number} targetIndex - Target item index
     * @param {Object} options - Animation options
     * @param {boolean} options.isWrapping - Whether this is a wrap-around navigation
     * @param {string} options.direction - Direction of animation ('up' or 'down')
     */
  }, {
    key: "slideTo",
    value: function slideTo(targetIndex) {
      var _this2 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (targetIndex < 0 || targetIndex >= this.itemElements.length) {
        console.warn('Invalid slide index:', targetIndex);
        return;
      }
      if (this.isAnimating) {
        console.log('⏳ Animation in progress, ignoring slide request');
        return;
      }

      // Bug Fix 1: Skip animation if sliding to the same edge item and we are not wrapping
      if (targetIndex === this.currentIndex && !options.isWrapping) {
        console.log('🛑 Already at boundary edge, ignoring slide request to same index');
        return;
      }
      this.isAnimating = true;
      var previousIndex = this.currentIndex;
      this.currentIndex = targetIndex;

      // Handle wrap-around animation for seamless looping
      if (options.isWrapping && this.itemElements.length > 1) {
        this.handleWrapAnimation(previousIndex, targetIndex, options.direction);
      } else {
        // Normal slide animation
        var offset = -targetIndex * 100;
        this.container.style.transform = "translateY(".concat(offset, "%)");
        console.log('🎬 Sliding to item', targetIndex, '- Transform: translateY(' + offset + '%)');
      }

      // Emit slide event
      this.eventManager.emit('slideStarted', {
        index: targetIndex
      });

      // Clear previous timeout
      if (this.transitionId) clearTimeout(this.transitionId);

      // Wait for transition to complete
      this.transitionId = setTimeout(function () {
        _this2.isAnimating = false;
        console.log('✅ Slide animation completed for item', targetIndex);
        _this2.eventManager.emit('slideCompleted', {
          index: targetIndex
        });
      }, this.config.transitionDuration);
    }

    /**
     * Handle wrap-around animation for seamless infinite scrolling
     * @private
     * @param {number} fromIndex - Starting index
     * @param {number} toIndex - Target index
     * @param {string} direction - Animation direction ('up' or 'down')
     */
  }, {
    key: "handleWrapAnimation",
    value: function handleWrapAnimation(fromIndex, toIndex, direction) {
      var _this3 = this;
      var totalItems = this.itemElements.length;

      // Wrapping from last to first (user swiped up on last item)
      if (fromIndex === totalItems - 1 && toIndex === 0 && direction === 'up') {
        console.log('🔄 Wrap animation: last → first (animating UP)');
        var firstItem = this.itemElements[0];

        // Disable transition for instantaneous invisible snap
        this.container.style.transition = 'none';

        // Temporarily use flex 'order' to physically place the first item at the end of the flex list.
        // This natively expands the browser's layout bounding box, avoiding offscreen culling (black flashes).
        firstItem.style.order = '1';

        // Because we moved the first item, the layout shifts. The last item is now physically 1 position earlier.
        // We must instantly snap the container to keep the last item perfectly visibly undisturbed.
        var snapOffset = -(fromIndex - 1) * 100;
        this.container.style.transform = "translateY(".concat(snapOffset, "%)");

        // Force reflow
        this.container.offsetHeight;

        // Re-enable transition
        this.container.style.transition = "transform ".concat(this.config.transitionDuration, "ms ease-in-out");

        // Animate container to reveal the first item (which is now at the very end)
        var animateOffset = -(totalItems - 1) * 100;
        this.container.style.transform = "translateY(".concat(animateOffset, "%)");

        // After animation completes, snap everything back to accurate true native states
        setTimeout(function () {
          _this3.container.style.transition = 'none';

          // Restore natural flex layout order
          firstItem.style.order = '0';

          // Snap container to true index 0
          _this3.container.style.transform = "translateY(0%)";

          // Force reflow
          _this3.container.offsetHeight;

          // Re-enable transition for normal slides
          _this3.container.style.transition = "transform ".concat(_this3.config.transitionDuration, "ms ease-in-out");
        }, this.config.transitionDuration);
      }
      // Wrapping from first to last (user swiped down on first item)
      else if (fromIndex === 0 && toIndex === totalItems - 1 && direction === 'down') {
        console.log('🔄 Wrap animation: first → last (animating DOWN)');
        var lastItem = this.itemElements[totalItems - 1];

        // Disable transition for instantaneous snap
        this.container.style.transition = 'none';

        // Use flex 'order' to physically place the last item at the very beginning of the flex list.
        lastItem.style.order = '-1';

        // Because we moved the last item to the front, the first item is now physically at offset 1 (100%).
        // We snap the container to -100% to keep the first item perfectly in view before animating.
        var _snapOffset = -100;
        this.container.style.transform = "translateY(".concat(_snapOffset, "%)");

        // Force reflow
        this.container.offsetHeight;

        // Re-enable transition
        this.container.style.transition = "transform ".concat(this.config.transitionDuration, "ms ease-in-out");

        // Animate container to 0% to reveal the last item (now sitting at the very front)
        var _animateOffset = 0;
        this.container.style.transform = "translateY(".concat(_animateOffset, "%)");

        // After animation completes, restore true states
        setTimeout(function () {
          _this3.container.style.transition = 'none';

          // Restore natural flex layout
          lastItem.style.order = '0';

          // Snap container to true last item position
          var finalOffset = -(totalItems - 1) * 100;
          _this3.container.style.transform = "translateY(".concat(finalOffset, "%)");

          // Force reflow
          _this3.container.offsetHeight;

          // Re-enable transition
          _this3.container.style.transition = "transform ".concat(_this3.config.transitionDuration, "ms ease-in-out");
        }, this.config.transitionDuration);
      }
      // Fallback to normal animation if conditions don't match
      else {
        var offset = -toIndex * 100;
        this.container.style.transform = "translateY(".concat(offset, "%)");
        console.log('🎬 Sliding to item', toIndex, '- Transform: translateY(' + offset + '%)');
      }
    }

    /**
     * Get number of item elements
     * @returns {number}
     */
  }, {
    key: "getItemCount",
    value: function getItemCount() {
      return this.itemElements.length;
    }

    /**
     * Get current slide index
     * @returns {number}
     */
  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      return this.currentIndex;
    }

    /**
     * Destroy roll
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.transitionId) clearTimeout(this.transitionId);
      this.container = null;
      this.viewport = null;
      this.itemElements = [];
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = Roll;
}

/***/ }),

/***/ "./src/js/handlers/AutoplayHandler.js":
/*!********************************************!*\
  !*** ./src/js/handlers/AutoplayHandler.js ***!
  \********************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * AutoplayHandler - Manages autoplay functionality
 */
var AutoplayHandler = /*#__PURE__*/function () {
  function AutoplayHandler(eventManager, config, onAutoplayTick) {
    _classCallCheck(this, AutoplayHandler);
    this.eventManager = eventManager;
    this.config = config;
    this.onAutoplayTick = onAutoplayTick;
    this.isPlaying = false;
    this.autoplayInterval = null;
    this.resumeTimer = null;
    this.isPaused = false;
  }

  /**
   * Start autoplay
   */
  return _createClass(AutoplayHandler, [{
    key: "play",
    value: function play() {
      var _this = this;
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.isPaused = false;
      this.eventManager.emit('autoplayStart');

      // Start autoplay ticker
      this.autoplayInterval = setInterval(function () {
        if (_this.onAutoplayTick) {
          _this.onAutoplayTick();
        }
        _this.eventManager.emit('autoplayTick');
      }, this.config.autoplayInterval);
    }

    /**
     * Pause autoplay
     */
  }, {
    key: "pause",
    value: function pause() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      this.isPaused = true;
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
      if (this.resumeTimer) {
        clearTimeout(this.resumeTimer);
        this.resumeTimer = null;
      }
      this.eventManager.emit('autoplayPause');
    }

    /**
     * Temporarily pause and schedule resume
     * @param {number} delay - Delay before resume (ms)
     */
  }, {
    key: "pauseTemporarily",
    value: function pauseTemporarily() {
      var _this2 = this;
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (!this.isPlaying && !this.isTemporarilyPaused()) return;
      if (this.isPlaying) {
        this.pause();
      }

      // Bug Fix 2: If we are already temporarily paused, clear the old timer so the new one extends it.
      if (this.resumeTimer) {
        clearTimeout(this.resumeTimer);
        this.resumeTimer = null;
      }
      delay = delay || this.config.autoplayResumeDelay;

      // Schedule resume
      this.resumeTimer = setTimeout(function () {
        _this2.resumeTimer = null;
        _this2.play();
      }, delay);
      this.eventManager.emit('autoplayPausedTemporarily', {
        delay: delay
      });
    }

    /**
     * Resume autoplay if paused
     */
  }, {
    key: "resume",
    value: function resume() {
      if (this.isPlaying || !this.config.autoplay) return;
      this.play();
    }

    /**
     * Check if autoplay is currently playing
     * @returns {boolean}
     */
  }, {
    key: "isAutoplayActive",
    value: function isAutoplayActive() {
      return this.isPlaying;
    }

    /**
     * Check if autoplay is paused
     * @returns {boolean}
     */
  }, {
    key: "isAutoplayPaused",
    value: function isAutoplayPaused() {
      return this.isPaused;
    }

    /**
     * Check if autoplay is temporarily paused waiting to resume
     * @returns {boolean}
     */
  }, {
    key: "isTemporarilyPaused",
    value: function isTemporarilyPaused() {
      return this.resumeTimer !== null;
    }

    /**
     * Destroy handler
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.pause();
      if (this.resumeTimer) {
        clearTimeout(this.resumeTimer);
        this.resumeTimer = null;
      }
      this.onAutoplayTick = null;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = AutoplayHandler;
}

/***/ }),

/***/ "./src/js/handlers/KeyboardHandler.js":
/*!********************************************!*\
  !*** ./src/js/handlers/KeyboardHandler.js ***!
  \********************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * KeyboardHandler - Handles keyboard navigation
 */
var KeyboardHandler = /*#__PURE__*/function () {
  function KeyboardHandler(element, eventManager, config, onKeyPress) {
    _classCallCheck(this, KeyboardHandler);
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
  return _createClass(KeyboardHandler, [{
    key: "enable",
    value: function enable() {
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
  }, {
    key: "disable",
    value: function disable() {
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
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter() {
      this.isHovered = true;
    }

    /**
     * Handle mouse leave
     */
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      this.isHovered = false;
    }

    /**
     * Handle focus
     */
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      this.isFocused = true;
    }

    /**
     * Handle blur
     */
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      this.isFocused = false;
    }

    /**
     * Handle key down event
     * @param {KeyboardEvent} event
     */
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      if (!this.isHandlerAttached) return;

      // Only respond to keyboard events if element is hovered or focused
      if (!this.isHovered && !this.isFocused) {
        return;
      }
      var key = event.key;

      // Arrow Down - next item (Instagram Reels style)
      if (key === 'ArrowDown') {
        event.preventDefault();
        this.eventManager.emit('keyboardEvent', {
          key: 'ArrowDown'
        });
        if (this.onKeyPress) {
          this.onKeyPress('ArrowDown');
        }
      }

      // Arrow Up - previous item (Instagram Reels style)
      if (key === 'ArrowUp') {
        event.preventDefault();
        this.eventManager.emit('keyboardEvent', {
          key: 'ArrowUp'
        });
        if (this.onKeyPress) {
          this.onKeyPress('ArrowUp');
        }
      }

      // Space - toggle autoplay
      if (key === ' ') {
        event.preventDefault();
        this.eventManager.emit('keyboardEvent', {
          key: ' '
        });
        if (this.onKeyPress) {
          this.onKeyPress(' ');
        }
      }
    }

    /**
     * Destroy handler
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.onKeyPress = null;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = KeyboardHandler;
}

/***/ }),

/***/ "./src/js/handlers/MouseDragHandler.js":
/*!*********************************************!*\
  !*** ./src/js/handlers/MouseDragHandler.js ***!
  \*********************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * MouseDragHandler - Detects and handles mouse drag gestures (desktop support)
 */
var MouseDragHandler = /*#__PURE__*/function () {
  function MouseDragHandler(element, eventManager, config, onDrag) {
    _classCallCheck(this, MouseDragHandler);
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
  return _createClass(MouseDragHandler, [{
    key: "enable",
    value: function enable() {
      if (this.config.enableMouseDrag === false) return;
      if (this.isHandlerEnabled) return;
      this.isHandlerEnabled = true;
      this.element.addEventListener('mousedown', this.boundMouseDown, {
        passive: false
      });
      // Mouse move and up are on document to track outside element
      document.addEventListener('mousemove', this.boundMouseMove, {
        passive: false
      });
      document.addEventListener('mouseup', this.boundMouseUp, {
        passive: false
      });
      this.element.addEventListener('mouseleave', this.boundMouseLeave, {
        passive: false
      });
    }

    /**
     * Disable mouse drag handler
     */
  }, {
    key: "disable",
    value: function disable() {
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
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
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
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (!this.isDragging) return;
      this.mouseEndX = event.clientX;
      this.mouseEndY = event.clientY;
      var deltaX = Math.abs(this.mouseStartX - this.mouseEndX);
      var deltaY = Math.abs(this.mouseStartY - this.mouseEndY);

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
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
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
      var endX = event.clientX;
      var endY = event.clientY;
      var deltaX = this.mouseStartX - endX;
      var deltaY = this.mouseStartY - endY;
      var deltaTime = Date.now() - this.mouseStartTime;
      console.log('MouseDragHandler: Mouse up', {
        startX: this.mouseStartX,
        startY: this.mouseStartY,
        endX: endX,
        endY: endY,
        deltaX: deltaX,
        deltaY: deltaY,
        deltaTime: deltaTime
      });

      // Calculate velocity (pixels per millisecond)
      var velocity = Math.abs(deltaY) / deltaTime;

      // Prioritize vertical movement (like touch handler)
      // Only ignore if significantly more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        console.log('MouseDragHandler: Significantly horizontal drag detected, ignoring');
        return;
      }

      // Use velocity-based threshold for better responsiveness
      var minDragDistance = 30;
      var velocityThreshold = 0.3; // pixels per millisecond
      var dragThreshold = this.config.swipeThreshold || 50;
      var isValidDistance = Math.abs(deltaY) >= dragThreshold;
      var isValidVelocity = Math.abs(deltaY) >= minDragDistance && velocity >= velocityThreshold;
      if (!isValidDistance && !isValidVelocity) {
        console.log('MouseDragHandler: Drag too small or slow', {
          deltaY: Math.abs(deltaY),
          threshold: dragThreshold,
          velocity: velocity,
          velocityThreshold: velocityThreshold
        });
        return;
      }
      var direction = deltaY > 0 ? 'up' : 'down';
      console.log('MouseDragHandler: Valid drag detected:', direction, {
        distance: Math.abs(deltaY),
        velocity: velocity
      });
      this.eventManager.emit('dragDetected', {
        direction: direction,
        distance: Math.abs(deltaY),
        velocity: velocity
      });
      if (this.onDrag) {
        this.onDrag(direction);
      }
    }

    /**
     * Handle mouse leave
     * @param {MouseEvent} event
     */
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(event) {
      // If dragging and mouse leaves the element, still allow drag completion
      // Don't cancel dragging here, let mouseup handle it
      if (this.isDragging) {
        console.log('MouseDragHandler: Mouse left element while dragging');
      }
    }

    /**
     * Destroy handler
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.onDrag = null;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = MouseDragHandler;
}

/***/ }),

/***/ "./src/js/handlers/TouchHandler.js":
/*!*****************************************!*\
  !*** ./src/js/handlers/TouchHandler.js ***!
  \*****************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * TouchHandler - Detects and handles swipe gestures
 */
var TouchHandler = /*#__PURE__*/function () {
  function TouchHandler(element, eventManager, config, onSwipe) {
    _classCallCheck(this, TouchHandler);
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
  return _createClass(TouchHandler, [{
    key: "enable",
    value: function enable() {
      if (this.config.enableTouch === false) return;
      if (this.isHandlerEnabled) return;
      this.isHandlerEnabled = true;
      // Use capture phase to intercept events before child elements - Instagram Reels behavior
      this.element.addEventListener('touchstart', this.boundTouchStart, {
        passive: false,
        capture: true
      });
      this.element.addEventListener('touchmove', this.boundTouchMove, {
        passive: false,
        capture: true
      });
      this.element.addEventListener('touchend', this.boundTouchEnd, {
        passive: false,
        capture: true
      });
    }

    /**
     * Disable touch handler
     */
  }, {
    key: "disable",
    value: function disable() {
      if (!this.isHandlerEnabled) return;
      this.isHandlerEnabled = false;
      this.element.removeEventListener('touchstart', this.boundTouchStart, {
        capture: true
      });
      this.element.removeEventListener('touchmove', this.boundTouchMove, {
        capture: true
      });
      this.element.removeEventListener('touchend', this.boundTouchEnd, {
        capture: true
      });
    }

    /**
     * Handle touch start
     * @param {TouchEvent} event
     */
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(event) {
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
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(event) {
      if (!this.isDragging || event.touches.length !== 1) return;
      this.touchEndX = event.touches[0].clientX;
      this.touchEndY = event.touches[0].clientY;

      // Always prevent default to stop page scrolling - Instagram Reels behavior
      // This ensures only our roll moves, not the page
      event.preventDefault();
      event.stopPropagation();

      // Optional: Could add visual feedback here (like Instagram's drag indicator)
      var deltaY = this.touchStartY - this.touchEndY;
      console.log('TouchHandler: Dragging', {
        deltaY: deltaY
      });
    }

    /**
     * Handle touch end
     * @param {TouchEvent} event
     */
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd(event) {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Use changedTouches to get the final position
      var endX = event.changedTouches[0].clientX;
      var endY = event.changedTouches[0].clientY;
      var deltaX = this.touchStartX - endX;
      var deltaY = this.touchStartY - endY;
      var deltaTime = Date.now() - this.touchStartTime;
      console.log('TouchHandler: Touch end', {
        startX: this.touchStartX,
        startY: this.touchStartY,
        endX: endX,
        endY: endY,
        deltaX: deltaX,
        deltaY: deltaY,
        deltaTime: deltaTime
      });

      // Calculate velocity (pixels per millisecond)
      var velocity = Math.abs(deltaY) / deltaTime;

      // Instagram Reels style: Prioritize vertical movement
      // Only ignore if it's significantly more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        console.log('TouchHandler: Significantly horizontal swipe detected, ignoring');
        return;
      }

      // Check if it's a tap (quick touch with minimal movement)
      var isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300;
      if (isTap) {
        console.log('TouchHandler: Tap detected');
        this.eventManager.emit('tapDetected', {
          x: endX,
          y: endY
        });
        return; // Don't process as swipe
      }

      // Instagram Reels style: Use velocity-based threshold for better responsiveness
      // Accept swipe if either:
      // 1. Distance is above threshold, OR
      // 2. Velocity is high enough (fast swipe) - minimum 30px movement
      var minSwipeDistance = 30;
      var velocityThreshold = 0.3; // pixels per millisecond

      var isValidDistance = Math.abs(deltaY) >= this.config.swipeThreshold;
      var isValidVelocity = Math.abs(deltaY) >= minSwipeDistance && velocity >= velocityThreshold;
      if (!isValidDistance && !isValidVelocity) {
        console.log('TouchHandler: Swipe too small or slow', {
          deltaY: Math.abs(deltaY),
          threshold: this.config.swipeThreshold,
          velocity: velocity,
          velocityThreshold: velocityThreshold
        });
        return;
      }
      var direction = deltaY > 0 ? 'up' : 'down';
      console.log('TouchHandler: Valid swipe detected:', direction, {
        distance: Math.abs(deltaY),
        velocity: velocity
      });
      this.eventManager.emit('swipeDetected', {
        direction: direction,
        distance: Math.abs(deltaY),
        velocity: velocity
      });
      if (this.onSwipe) {
        this.onSwipe(direction);
      }
    }

    /**
     * Destroy handler
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.onSwipe = null;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = TouchHandler;
}

/***/ }),

/***/ "./src/js/handlers/WheelHandler.js":
/*!*****************************************!*\
  !*** ./src/js/handlers/WheelHandler.js ***!
  \*****************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * WheelHandler - Handles mouse wheel scrolling for desktop users
 */
var WheelHandler = /*#__PURE__*/function () {
  function WheelHandler(element, eventManager, config, onWheel) {
    _classCallCheck(this, WheelHandler);
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
  return _createClass(WheelHandler, [{
    key: "enable",
    value: function enable() {
      if (!this.config.enableWheel) return;
      if (this.isHandlerEnabled) return;
      this.isHandlerEnabled = true;
      this.element.addEventListener('wheel', this.boundWheel, {
        passive: false
      });
      this.element.addEventListener('mouseenter', this.boundMouseEnter, false);
      this.element.addEventListener('mouseleave', this.boundMouseLeave, false);
      console.log('WheelHandler: Enabled');
    }

    /**
     * Disable wheel handler
     */
  }, {
    key: "disable",
    value: function disable() {
      if (!this.isEnabled) return;
      this.isEnabled = false;
      this.element.removeEventListener('wheel', this.boundWheel);
      this.element.removeEventListener('mouseenter', this.boundMouseEnter);
      this.element.removeEventListener('mouseleave', this.boundMouseLeave);
    }

    /**
     * Handle mouse enter
     */
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter() {
      this.isHovered = true;
    }

    /**
     * Handle mouse leave
     */
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      this.isHovered = false;
    }

    /**
     * Handle wheel event
     * @param {WheelEvent} event
     */
  }, {
    key: "handleWheel",
    value: function handleWheel(event) {
      if (!this.isEnabled) return;

      // Only respond when mouse is hovering over the element
      if (!this.isHovered) return;
      var now = Date.now();

      // Throttle wheel events to prevent too rapid scrolling
      if (now - this.lastWheelTime < this.wheelThrottle) {
        event.preventDefault();
        return;
      }
      this.lastWheelTime = now;

      // Prevent default scrolling behavior
      event.preventDefault();

      // Determine scroll direction
      var direction = event.deltaY > 0 ? 'down' : 'up';
      console.log('WheelHandler: Scroll detected -', direction);
      this.eventManager.emit('wheelDetected', {
        direction: direction,
        deltaY: event.deltaY
      });
      if (this.onWheel) {
        this.onWheel(direction);
      }
    }

    /**
     * Destroy handler
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.onWheel = null;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = WheelHandler;
}

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsers/ConfigParser */ "./src/js/parsers/ConfigParser.js");
/* harmony import */ var _parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsers/DataAttributeParser */ "./src/js/parsers/DataAttributeParser.js");
/* harmony import */ var _parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_EventManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/EventManager */ "./src/js/core/EventManager.js");
/* harmony import */ var _core_EventManager__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_EventManager__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_MediaManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/MediaManager */ "./src/js/core/MediaManager.js");
/* harmony import */ var _core_MediaManager__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_MediaManager__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_Navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/Navigation */ "./src/js/core/Navigation.js");
/* harmony import */ var _core_Navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_Navigation__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_Roll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/Roll */ "./src/js/core/Roll.js");
/* harmony import */ var _core_Roll__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_Roll__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./handlers/TouchHandler */ "./src/js/handlers/TouchHandler.js");
/* harmony import */ var _handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./handlers/KeyboardHandler */ "./src/js/handlers/KeyboardHandler.js");
/* harmony import */ var _handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./handlers/AutoplayHandler */ "./src/js/handlers/AutoplayHandler.js");
/* harmony import */ var _handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./handlers/WheelHandler */ "./src/js/handlers/WheelHandler.js");
/* harmony import */ var _handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _handlers_MouseDragHandler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./handlers/MouseDragHandler */ "./src/js/handlers/MouseDragHandler.js");
/* harmony import */ var _handlers_MouseDragHandler__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_handlers_MouseDragHandler__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./renderers/HTMLRenderer */ "./src/js/renderers/HTMLRenderer.js");
/* harmony import */ var _renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./renderers/VideoRenderer */ "./src/js/renderers/VideoRenderer.js");
/* harmony import */ var _renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./renderers/ImageRenderer */ "./src/js/renderers/ImageRenderer.js");
/* harmony import */ var _renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * SenangWebs Roll (SWR) - Main class
 * Lightweight roll library for creating responsive media rolls
 */

// Import dependencies - webpack will convert CommonJS exports to ES6














var SWR = /*#__PURE__*/function () {
  /**
   * Constructor
   * @param {string|HTMLElement} selector - CSS selector or DOM element
   * @param {Object} config - Configuration object
   */
  function SWR(selector) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, SWR);
    // Get element
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.element) {
      throw new Error("Element not found: ".concat(selector));
    }

    // Parse configuration
    this.config = _parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_0___default().parse(config);

    // Initialize core components
    this.eventManager = new (_core_EventManager__WEBPACK_IMPORTED_MODULE_2___default())();
    this.mediaManager = new (_core_MediaManager__WEBPACK_IMPORTED_MODULE_3___default())(this.eventManager);
    this.navigation = new (_core_Navigation__WEBPACK_IMPORTED_MODULE_4___default())(this.eventManager, this.config);
    this.roll = new (_core_Roll__WEBPACK_IMPORTED_MODULE_5___default())(this.element, this.eventManager, this.config);

    // Initialize handlers
    this.touchHandler = null;
    this.keyboardHandler = null;
    this.wheelHandler = null;
    this.mouseDragHandler = null;
    this.autoplayHandler = null;

    // Renderers
    this.renderers = {
      html: new (_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11___default())(),
      video: new (_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12___default())(),
      image: new (_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13___default())()
    };

    // State
    this.isInitialized = false;
    this.isDestroyed = false;

    // Initialize the roll
    this.init();
  }

  /**
   * Initialize the SWR instance
   * @private
   */
  return _createClass(SWR, [{
    key: "init",
    value: function init() {
      var _this = this;
      // Check for data attributes or existing items
      var dataConfig = _parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_1___default().parseConfig(this.element);
      var dataItems = _parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_1___default().parseItems(this.element);

      // Merge data attributes into config
      this.config = _parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_0___default().parse(_objectSpread(_objectSpread({}, this.config), dataConfig));

      // Setup roll DOM
      this.roll.initialize();

      // Add items (from data attributes or config)
      if (dataItems.length > 0) {
        dataItems.forEach(function (item) {
          return _this.mediaManager.addItem(item);
        });
      } else if (this.config.items) {
        this.config.items.forEach(function (item) {
          return _this.mediaManager.addItem(item);
        });
      }

      // Initialize navigation
      var itemCount = this.mediaManager.getItemCount();
      this.navigation.initialize(itemCount);

      // Render initial items
      this.renderItems();

      // Setup handlers
      this.setupHandlers();

      // Start autoplay if configured
      if (this.config.autoplay) {
        this.autoplayHandler.play();
      }
      this.isInitialized = true;
      this.eventManager.emit('initialized', {
        totalItems: itemCount
      });
    }

    /**
     * Setup event handlers
     * @private
     */
  }, {
    key: "setupHandlers",
    value: function setupHandlers() {
      var _this2 = this;
      // Touch/Swipe handler
      this.touchHandler = new (_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_6___default())(this.roll.viewport, this.eventManager, this.config, function (direction) {
        return _this2.handleSwipe(direction);
      });
      this.touchHandler.enable();

      // Keyboard handler
      this.keyboardHandler = new (_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_7___default())(this.element, this.eventManager, this.config, function (key) {
        return _this2.handleKeyPress(key);
      });
      this.keyboardHandler.enable();

      // Mouse wheel handler (desktop support)
      this.wheelHandler = new (_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_9___default())(this.roll.viewport, this.eventManager, this.config, function (direction) {
        return _this2.handleWheel(direction);
      });
      this.wheelHandler.enable();

      // Mouse drag handler (desktop drag support)
      this.mouseDragHandler = new (_handlers_MouseDragHandler__WEBPACK_IMPORTED_MODULE_10___default())(this.roll.viewport, this.eventManager, this.config, function (direction) {
        return _this2.handleMouseDrag(direction);
      });
      this.mouseDragHandler.enable();

      // Autoplay handler
      this.autoplayHandler = new (_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_8___default())(this.eventManager, this.config, function () {
        return _this2.handleAutoplayTick();
      });

      // Listen for user interactions to pause autoplay
      if (this.config.enableAutoplayPauseOnInteraction) {
        this.eventManager.on('swipeDetected', function () {
          if (_this2.autoplayHandler.isAutoplayActive() || _this2.autoplayHandler.isTemporarilyPaused()) {
            _this2.autoplayHandler.pauseTemporarily();
          }
        });
        this.eventManager.on('keyboardEvent', function () {
          if (_this2.autoplayHandler.isAutoplayActive() || _this2.autoplayHandler.isTemporarilyPaused()) {
            _this2.autoplayHandler.pauseTemporarily();
          }
        });
        this.eventManager.on('wheelDetected', function () {
          if (_this2.autoplayHandler.isAutoplayActive() || _this2.autoplayHandler.isTemporarilyPaused()) {
            _this2.autoplayHandler.pauseTemporarily();
          }
        });
        this.eventManager.on('dragDetected', function () {
          if (_this2.autoplayHandler.isAutoplayActive() || _this2.autoplayHandler.isTemporarilyPaused()) {
            _this2.autoplayHandler.pauseTemporarily();
          }
        });
      }

      // Listen for tap events to toggle autoplay
      this.eventManager.on('tapDetected', function () {
        console.log('📱 Tap detected - toggling autoplay');
        if (_this2.autoplayHandler.isAutoplayActive()) {
          _this2.pause();
        } else {
          _this2.play();
        }
      });
    }

    /**
     * Render all items
     * @private
     */
  }, {
    key: "renderItems",
    value: function renderItems() {
      var _this3 = this;
      var items = this.mediaManager.getItems();
      items.forEach(function (item, index) {
        var renderer = _this3.getRenderer(item.type);
        if (renderer) {
          _this3.roll.renderItem(index, renderer, item);
        }
      });
    }

    /**
     * Get renderer for item type
     * @private
     * @param {string} type - Item type (html, video, image)
     * @returns {Object} Renderer instance
     */
  }, {
    key: "getRenderer",
    value: function getRenderer(type) {
      return this.renderers[type] || null;
    }

    /**
     * Handle swipe event
     * @private
     */
  }, {
    key: "handleSwipe",
    value: function handleSwipe(direction) {
      console.log('🎬 SWR: Swipe registered -', direction === 'up' ? '⬆️ UP' : '⬇️ DOWN');
      console.log('📊 Current index:', this.navigation.getCurrentIndex(), 'Total items:', this.mediaManager.getItemCount());
      if (direction === 'up') {
        console.log('➡️ Moving to NEXT item');
        this.next();
      } else if (direction === 'down') {
        console.log('⬅️ Moving to PREVIOUS item');
        this.prev();
      }
    }

    /**
     * Handle keyboard event
     * @private
     */
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(key) {
      if (key === 'ArrowDown') {
        this.next();
      } else if (key === 'ArrowUp') {
        this.prev();
      } else if (key === ' ') {
        if (this.autoplayHandler.isAutoplayActive()) {
          this.pause();
        } else {
          this.play();
        }
      }
    }

    /**
     * Handle mouse wheel event
     * @private
     */
  }, {
    key: "handleWheel",
    value: function handleWheel(direction) {
      if (direction === 'down') {
        this.next();
      } else if (direction === 'up') {
        this.prev();
      }
    }

    /**
     * Handle mouse drag event
     * @private
     */
  }, {
    key: "handleMouseDrag",
    value: function handleMouseDrag(direction) {
      console.log('🖱️ SWR: Mouse drag registered -', direction === 'up' ? '⬆️ UP' : '⬇️ DOWN');
      console.log('📊 Current index:', this.navigation.getCurrentIndex(), 'Total items:', this.mediaManager.getItemCount());
      if (direction === 'up') {
        console.log('➡️ Moving to NEXT item (via drag)');
        this.next();
      } else if (direction === 'down') {
        console.log('⬅️ Moving to PREVIOUS item (via drag)');
        this.prev();
      }
    }

    /**
     * Handle autoplay tick
     * @private
     */
  }, {
    key: "handleAutoplayTick",
    value: function handleAutoplayTick() {
      this.next();
    }

    // ========== Public API ==========

    /**
     * Go to next item
     */
  }, {
    key: "next",
    value: function next() {
      if (this.isDestroyed) return;
      var navResult = this.navigation.next();
      console.log('✨ Navigating to next item - Index:', navResult.index, 'Wrapping:', navResult.isWrapping);
      this.roll.slideTo(navResult.index, {
        isWrapping: navResult.isWrapping,
        direction: navResult.direction
      });
    }

    /**
     * Go to previous item
     */
  }, {
    key: "prev",
    value: function prev() {
      if (this.isDestroyed) return;
      var navResult = this.navigation.prev();
      console.log('✨ Navigating to previous item - Index:', navResult.index, 'Wrapping:', navResult.isWrapping);
      this.roll.slideTo(navResult.index, {
        isWrapping: navResult.isWrapping,
        direction: navResult.direction
      });
    }

    /**
     * Go to specific item by index
     * @param {number} index - Item index
     */
  }, {
    key: "goTo",
    value: function goTo(index) {
      if (this.isDestroyed) return;
      var newIndex = this.navigation.goTo(index);
      this.roll.slideTo(newIndex);
    }

    /**
     * Add a new item to the roll
     * @param {Object} item - Item object
     * @param {number} index - Optional insertion index
     */
  }, {
    key: "addItem",
    value: function addItem(item) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.isDestroyed) return;
      var success = this.mediaManager.addItem(item, index);
      if (success) {
        // Update roll
        this.roll.updateItemElements();
        var renderer = this.getRenderer(item.type);
        var actualIndex = index !== null ? index : this.mediaManager.getItemCount() - 1;
        this.roll.renderItem(actualIndex, renderer, item);

        // Update navigation
        this.navigation.initialize(this.mediaManager.getItemCount());
      }
    }

    /**
     * Remove an item by index
     * @param {number} index - Item index
     */
  }, {
    key: "removeItem",
    value: function removeItem(index) {
      if (this.isDestroyed) return;
      var item = this.mediaManager.removeItem(index);
      if (item) {
        // Update roll
        this.roll.updateItemElements();

        // Update navigation
        this.navigation.initialize(this.mediaManager.getItemCount());

        // Adjust current index if needed
        if (index < this.navigation.getCurrentIndex()) {
          this.navigation.goTo(this.navigation.getCurrentIndex() - 1);
        }
      }
    }

    /**
     * Get current item index
     * @returns {number}
     */
  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      return this.navigation.getCurrentIndex();
    }

    /**
     * Get total number of items
     * @returns {number}
     */
  }, {
    key: "getTotalItems",
    value: function getTotalItems() {
      return this.mediaManager.getItemCount();
    }

    /**
     * Start autoplay
     */
  }, {
    key: "play",
    value: function play() {
      if (this.isDestroyed) return;
      if (!this.autoplayHandler) return;
      this.autoplayHandler.play();
    }

    /**
     * Pause autoplay
     */
  }, {
    key: "pause",
    value: function pause() {
      if (this.isDestroyed) return;
      if (!this.autoplayHandler) return;
      this.autoplayHandler.pause();
    }

    /**
     * Check if autoplay is active
     * @returns {boolean}
     */
  }, {
    key: "isPlaying",
    value: function isPlaying() {
      if (!this.autoplayHandler) return false;
      return this.autoplayHandler.isAutoplayActive();
    }

    /**
     * Subscribe to event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
  }, {
    key: "on",
    value: function on(event, callback) {
      return this.eventManager.on(event, callback);
    }

    /**
     * Unsubscribe from event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
  }, {
    key: "off",
    value: function off(event, callback) {
      this.eventManager.off(event, callback);
    }

    /**
     * Get current configuration
     * @returns {Object}
     */
  }, {
    key: "getConfig",
    value: function getConfig() {
      return _objectSpread({}, this.config);
    }

    /**
     * Destroy the SWR instance
     */
  }, {
    key: "destroy",
    value: function destroy() {
      var _this$eventManager;
      if (this.isDestroyed) return;
      this.isDestroyed = true;

      // Stop autoplay
      if (this.autoplayHandler) {
        this.autoplayHandler.destroy();
        this.autoplayHandler = null;
      }

      // Destroy handlers
      if (this.touchHandler) {
        this.touchHandler.destroy();
        this.touchHandler = null;
      }
      if (this.keyboardHandler) {
        this.keyboardHandler.destroy();
        this.keyboardHandler = null;
      }
      if (this.wheelHandler) {
        this.wheelHandler.destroy();
        this.wheelHandler = null;
      }
      if (this.mouseDragHandler) {
        this.mouseDragHandler.destroy();
        this.mouseDragHandler = null;
      }

      // Destroy roll
      if (this.roll) {
        this.roll.destroy();
        this.roll = null;
      }

      // Clear managers
      if (this.mediaManager) {
        this.mediaManager.clear();
        this.mediaManager = null;
      }
      if (this.navigation) {
        this.navigation = null;
      }

      // Clear event listeners
      if (this.eventManager) {
        this.eventManager.clear();
        this.eventManager = null;
      }

      // Emit destroy event
      (_this$eventManager = this.eventManager) === null || _this$eventManager === void 0 || _this$eventManager.emit('destroy');
      this.isInitialized = false;
    }
  }]);
}(); // ES6 export (webpack will handle UMD conversion)
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SWR);

/***/ }),

/***/ "./src/js/parsers/ConfigParser.js":
/*!****************************************!*\
  !*** ./src/js/parsers/ConfigParser.js ***!
  \****************************************/
/***/ ((module) => {

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ConfigParser - Validates, merges, and provides default configuration
 */
var ConfigParser = /*#__PURE__*/function () {
  function ConfigParser() {
    _classCallCheck(this, ConfigParser);
  }
  return _createClass(ConfigParser, null, [{
    key: "parse",
    value:
    /**
     * Parse and validate configuration
     * @param {Object} userConfig - User provided configuration
     * @returns {Object} Merged and validated configuration
     */
    function parse() {
      var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var config = _objectSpread({}, this.DEFAULT_CONFIG);
      if (_typeof(userConfig) !== 'object' || userConfig === null) {
        console.warn('Invalid config provided, using defaults');
        return config;
      }

      // Merge user config with defaults
      Object.keys(userConfig).forEach(function (key) {
        if (key in config) {
          config[key] = userConfig[key];
        } else {
          console.warn("Unknown config option: ".concat(key));
        }
      });

      // If autoplay is enabled but loop is not explicitly set, enable loop automatically
      // This ensures autoplay works continuously without stopping at the last item
      if (config.autoplay && userConfig.loop === undefined) {
        config.loop = true;
        console.log('🔄 Auto-enabling loop for autoplay');
      }
      this.validate(config);
      return config;
    }

    /**
     * Validate configuration values
     * @param {Object} config - Configuration to validate
     * @throws {Error} If validation fails
     */
  }, {
    key: "validate",
    value: function validate(config) {
      // Validate aspectRatio format (e.g., "9:16")
      if (typeof config.aspectRatio !== 'string' || !this.isValidAspectRatio(config.aspectRatio)) {
        console.warn("Invalid aspectRatio: ".concat(config.aspectRatio, ", using default"));
        config.aspectRatio = this.DEFAULT_CONFIG.aspectRatio;
      }

      // Validate boolean values
      if (typeof config.loop !== 'boolean') config.loop = this.DEFAULT_CONFIG.loop;
      if (typeof config.autoplay !== 'boolean') config.autoplay = this.DEFAULT_CONFIG.autoplay;
      if (typeof config.enableKeyboard !== 'boolean') config.enableKeyboard = this.DEFAULT_CONFIG.enableKeyboard;
      if (typeof config.enableTouch !== 'boolean') config.enableTouch = this.DEFAULT_CONFIG.enableTouch;
      if (typeof config.enableWheel !== 'boolean') config.enableWheel = this.DEFAULT_CONFIG.enableWheel;
      if (typeof config.enableAutoplayPauseOnInteraction !== 'boolean') {
        config.enableAutoplayPauseOnInteraction = this.DEFAULT_CONFIG.enableAutoplayPauseOnInteraction;
      }

      // Validate numeric values
      if (typeof config.autoplayInterval !== 'number' || config.autoplayInterval < 1000) {
        config.autoplayInterval = this.DEFAULT_CONFIG.autoplayInterval;
      }
      if (typeof config.autoplayResumeDelay !== 'number' || config.autoplayResumeDelay < 0) {
        config.autoplayResumeDelay = this.DEFAULT_CONFIG.autoplayResumeDelay;
      }
      if (typeof config.transitionDuration !== 'number' || config.transitionDuration < 0) {
        config.transitionDuration = this.DEFAULT_CONFIG.transitionDuration;
      }
      if (typeof config.swipeThreshold !== 'number' || config.swipeThreshold < 1) {
        config.swipeThreshold = this.DEFAULT_CONFIG.swipeThreshold;
      }
    }

    /**
     * Check if aspect ratio string is valid
     * @param {string} ratio - Aspect ratio string (e.g., "9:16")
     * @returns {boolean}
     */
  }, {
    key: "isValidAspectRatio",
    value: function isValidAspectRatio(ratio) {
      var match = ratio.match(/^(\d+):(\d+)$/);
      return match !== null && parseInt(match[1]) > 0 && parseInt(match[2]) > 0;
    }

    /**
     * Parse aspect ratio string to numeric value
     * @param {string} ratio - Aspect ratio string (e.g., "9:16")
     * @returns {number} Numeric ratio value (width / height)
     */
  }, {
    key: "parseAspectRatio",
    value: function parseAspectRatio(ratio) {
      var _ratio$split$map = ratio.split(':').map(Number),
        _ratio$split$map2 = _slicedToArray(_ratio$split$map, 2),
        width = _ratio$split$map2[0],
        height = _ratio$split$map2[1];
      return width / height;
    }
  }]);
}();
/**
 * Default configuration for SWR
 */
_defineProperty(ConfigParser, "DEFAULT_CONFIG", {
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
});
if ( true && module.exports) {
  module.exports = ConfigParser;
}

/***/ }),

/***/ "./src/js/parsers/DataAttributeParser.js":
/*!***********************************************!*\
  !*** ./src/js/parsers/DataAttributeParser.js ***!
  \***********************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * DataAttributeParser - Parses HTML data-swr attributes
 */
var DataAttributeParser = /*#__PURE__*/function () {
  function DataAttributeParser() {
    _classCallCheck(this, DataAttributeParser);
  }
  return _createClass(DataAttributeParser, null, [{
    key: "parseConfig",
    value:
    /**
     * Parse SWR data attributes from element
     * @param {HTMLElement} element - Element with data-swr attributes
     * @returns {Object} Configuration object from attributes
     */
    function parseConfig(element) {
      var config = {};

      // Parse aspect ratio
      var aspectRatio = element.getAttribute('data-swr-aspect-ratio');
      if (aspectRatio) config.aspectRatio = aspectRatio;

      // Parse boolean attributes
      var loop = element.getAttribute('data-swr-loop');
      if (loop !== null) config.loop = loop === 'true' || loop === '';
      var autoplay = element.getAttribute('data-swr-autoplay');
      if (autoplay !== null) config.autoplay = autoplay === 'true' || autoplay === '';
      var enableKeyboard = element.getAttribute('data-swr-keyboard');
      if (enableKeyboard !== null) config.enableKeyboard = enableKeyboard === 'true' || enableKeyboard === '';
      var enableTouch = element.getAttribute('data-swr-touch');
      if (enableTouch !== null) config.enableTouch = enableTouch === 'true' || enableTouch === '';
      var enableWheel = element.getAttribute('data-swr-wheel');
      if (enableWheel !== null) config.enableWheel = enableWheel === 'true' || enableWheel === '';
      var enableMouseDrag = element.getAttribute('data-swr-mouse-drag');
      if (enableMouseDrag !== null) config.enableMouseDrag = enableMouseDrag === 'true' || enableMouseDrag === '';

      // Parse numeric attributes
      var autoplayInterval = element.getAttribute('data-swr-autoplay-interval');
      if (autoplayInterval) config.autoplayInterval = parseInt(autoplayInterval, 10);
      var transitionDuration = element.getAttribute('data-swr-transition');
      if (transitionDuration) config.transitionDuration = parseInt(transitionDuration, 10);
      var swipeThreshold = element.getAttribute('data-swr-swipe-threshold');
      if (swipeThreshold) config.swipeThreshold = parseInt(swipeThreshold, 10);
      return config;
    }

    /**
     * Extract items from element with data-swr-item attributes
     * @param {HTMLElement} element - Parent element containing items
     * @returns {Array} Array of item objects
     */
  }, {
    key: "parseItems",
    value: function parseItems(element) {
      var _this = this;
      var items = [];
      var itemElements = element.querySelectorAll('[data-swr-item]');
      itemElements.forEach(function (itemEl) {
        var item = _this.parseItemElement(itemEl);
        if (item) items.push(item);
      });
      return items;
    }

    /**
     * Parse a single item element
     * @param {HTMLElement} itemEl - Item element
     * @returns {Object|null} Item object or null if invalid
     */
  }, {
    key: "parseItemElement",
    value: function parseItemElement(itemEl) {
      // Check if item contains a video
      var videoEl = itemEl.querySelector('video');
      if (videoEl) {
        return this.parseVideoItem(videoEl);
      }

      // Check if item contains an image
      var imgEl = itemEl.querySelector('img');
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
  }, {
    key: "parseVideoItem",
    value: function parseVideoItem(videoEl) {
      var sources = videoEl.querySelectorAll('source');
      var src = '';
      var type = 'video/mp4';
      if (sources.length > 0) {
        src = sources[0].getAttribute('src') || '';
        type = sources[0].getAttribute('type') || 'video/mp4';
      } else {
        src = videoEl.getAttribute('src') || '';
      }
      return {
        type: 'video',
        src: src,
        mimeType: type,
        autoplay: videoEl.hasAttribute('autoplay'),
        muted: videoEl.hasAttribute('muted'),
        playsinline: videoEl.hasAttribute('playsinline'),
        loop: videoEl.hasAttribute('loop')
      };
    }

    /**
     * Parse image element to item object
     * @param {HTMLImageElement} imgEl - Image element
     * @returns {Object} Image item object
     */
  }, {
    key: "parseImageItem",
    value: function parseImageItem(imgEl) {
      return {
        type: 'image',
        src: imgEl.getAttribute('src') || '',
        alt: imgEl.getAttribute('alt') || '',
        title: imgEl.getAttribute('title') || ''
      };
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = DataAttributeParser;
}

/***/ }),

/***/ "./src/js/renderers/HTMLRenderer.js":
/*!******************************************!*\
  !*** ./src/js/renderers/HTMLRenderer.js ***!
  \******************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * HTMLRenderer - Renders HTML content items
 */
var HTMLRenderer = /*#__PURE__*/function () {
  function HTMLRenderer() {
    _classCallCheck(this, HTMLRenderer);
  }
  return _createClass(HTMLRenderer, [{
    key: "render",
    value:
    /**
     * Render HTML item
     * @param {Object} item - Item object with content property
     * @returns {HTMLElement} Rendered element
     */
    function render(item) {
      var container = document.createElement('div');
      container.className = 'swr-html-item';
      container.innerHTML = item.content;
      return container;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = HTMLRenderer;
}

/***/ }),

/***/ "./src/js/renderers/ImageRenderer.js":
/*!*******************************************!*\
  !*** ./src/js/renderers/ImageRenderer.js ***!
  \*******************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ImageRenderer - Renders image items
 */
var ImageRenderer = /*#__PURE__*/function () {
  function ImageRenderer() {
    _classCallCheck(this, ImageRenderer);
  }
  return _createClass(ImageRenderer, [{
    key: "render",
    value:
    /**
     * Render image item
     * @param {Object} item - Item object with src, alt, title properties
     * @returns {HTMLElement} Rendered element
     */
    function render(item) {
      var container = document.createElement('div');
      container.className = 'swr-image-item';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.overflow = 'hidden';
      var img = document.createElement('img');
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
  }]);
}();
if ( true && module.exports) {
  module.exports = ImageRenderer;
}

/***/ }),

/***/ "./src/js/renderers/VideoRenderer.js":
/*!*******************************************!*\
  !*** ./src/js/renderers/VideoRenderer.js ***!
  \*******************************************/
/***/ ((module) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * VideoRenderer - Renders video items
 */
var VideoRenderer = /*#__PURE__*/function () {
  function VideoRenderer() {
    _classCallCheck(this, VideoRenderer);
  }
  return _createClass(VideoRenderer, [{
    key: "render",
    value:
    /**
     * Render video item
     * @param {Object} item - Item object with src and video properties
     * @returns {HTMLElement} Rendered element
     */
    function render(item) {
      var container = document.createElement('div');
      container.className = 'swr-video-item';
      var video = document.createElement('video');
      video.width = '100%';
      video.height = '100%';
      video.style.objectFit = 'cover';

      // Set video attributes
      if (item.autoplay) video.setAttribute('autoplay', 'autoplay');
      if (item.muted) video.setAttribute('muted', 'muted');
      if (item.playsinline) video.setAttribute('playsinline', 'playsinline');
      if (item.loop) video.setAttribute('loop', 'loop');
      if (item.controls !== false) video.setAttribute('controls', 'controls');

      // Add video source
      var source = document.createElement('source');
      source.src = item.src;
      source.type = item.mimeType || 'video/mp4';
      video.appendChild(source);

      // Fallback text
      video.appendChild(document.createTextNode('Your browser does not support the video tag.'));
      container.appendChild(video);
      return container;
    }
  }]);
}();
if ( true && module.exports) {
  module.exports = VideoRenderer;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./src/swr.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AutoplayHandler: () => (/* reexport default from dynamic */ _js_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_9___default.a),
/* harmony export */   ConfigParser: () => (/* reexport default from dynamic */ _js_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_1___default.a),
/* harmony export */   DataAttributeParser: () => (/* reexport default from dynamic */ _js_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_2___default.a),
/* harmony export */   EventManager: () => (/* reexport default from dynamic */ _js_core_EventManager__WEBPACK_IMPORTED_MODULE_3___default.a),
/* harmony export */   HTMLRenderer: () => (/* reexport default from dynamic */ _js_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11___default.a),
/* harmony export */   ImageRenderer: () => (/* reexport default from dynamic */ _js_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13___default.a),
/* harmony export */   KeyboardHandler: () => (/* reexport default from dynamic */ _js_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_8___default.a),
/* harmony export */   MediaManager: () => (/* reexport default from dynamic */ _js_core_MediaManager__WEBPACK_IMPORTED_MODULE_4___default.a),
/* harmony export */   Navigation: () => (/* reexport default from dynamic */ _js_core_Navigation__WEBPACK_IMPORTED_MODULE_5___default.a),
/* harmony export */   Roll: () => (/* reexport default from dynamic */ _js_core_Roll__WEBPACK_IMPORTED_MODULE_6___default.a),
/* harmony export */   SWR: () => (/* reexport safe */ _js_index__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   TouchHandler: () => (/* reexport default from dynamic */ _js_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_7___default.a),
/* harmony export */   VideoRenderer: () => (/* reexport default from dynamic */ _js_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12___default.a),
/* harmony export */   WheelHandler: () => (/* reexport default from dynamic */ _js_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_10___default.a),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_swr_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/swr.css */ "./src/css/swr.css");
/* harmony import */ var _js_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/parsers/ConfigParser */ "./src/js/parsers/ConfigParser.js");
/* harmony import */ var _js_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/parsers/DataAttributeParser */ "./src/js/parsers/DataAttributeParser.js");
/* harmony import */ var _js_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_js_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _js_core_EventManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/core/EventManager */ "./src/js/core/EventManager.js");
/* harmony import */ var _js_core_EventManager__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_js_core_EventManager__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _js_core_MediaManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/core/MediaManager */ "./src/js/core/MediaManager.js");
/* harmony import */ var _js_core_MediaManager__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_js_core_MediaManager__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _js_core_Navigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./js/core/Navigation */ "./src/js/core/Navigation.js");
/* harmony import */ var _js_core_Navigation__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_js_core_Navigation__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _js_core_Roll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./js/core/Roll */ "./src/js/core/Roll.js");
/* harmony import */ var _js_core_Roll__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_js_core_Roll__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _js_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./js/handlers/TouchHandler */ "./src/js/handlers/TouchHandler.js");
/* harmony import */ var _js_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_js_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _js_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./js/handlers/KeyboardHandler */ "./src/js/handlers/KeyboardHandler.js");
/* harmony import */ var _js_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_js_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _js_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./js/handlers/AutoplayHandler */ "./src/js/handlers/AutoplayHandler.js");
/* harmony import */ var _js_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_js_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _js_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./js/handlers/WheelHandler */ "./src/js/handlers/WheelHandler.js");
/* harmony import */ var _js_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_js_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _js_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./js/renderers/HTMLRenderer */ "./src/js/renderers/HTMLRenderer.js");
/* harmony import */ var _js_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_js_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _js_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./js/renderers/VideoRenderer */ "./src/js/renderers/VideoRenderer.js");
/* harmony import */ var _js_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_js_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _js_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./js/renderers/ImageRenderer */ "./src/js/renderers/ImageRenderer.js");
/* harmony import */ var _js_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_js_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _js_index__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./js/index */ "./src/js/index.js");
/**
 * SenangWebs Roll (SWR) - Main Bundle Entry Point
 * This file bundles all components together for distribution
 */

// Import CSS


// Import all modules - webpack will handle the CommonJS conversion















// Make all classes globally available for browser usage
if (typeof window !== 'undefined') {
  window.SWR = _js_index__WEBPACK_IMPORTED_MODULE_14__["default"];
  window.ConfigParser = (_js_parsers_ConfigParser__WEBPACK_IMPORTED_MODULE_1___default());
  window.DataAttributeParser = (_js_parsers_DataAttributeParser__WEBPACK_IMPORTED_MODULE_2___default());
  window.EventManager = (_js_core_EventManager__WEBPACK_IMPORTED_MODULE_3___default());
  window.MediaManager = (_js_core_MediaManager__WEBPACK_IMPORTED_MODULE_4___default());
  window.Navigation = (_js_core_Navigation__WEBPACK_IMPORTED_MODULE_5___default());
  window.Roll = (_js_core_Roll__WEBPACK_IMPORTED_MODULE_6___default());
  window.TouchHandler = (_js_handlers_TouchHandler__WEBPACK_IMPORTED_MODULE_7___default());
  window.KeyboardHandler = (_js_handlers_KeyboardHandler__WEBPACK_IMPORTED_MODULE_8___default());
  window.AutoplayHandler = (_js_handlers_AutoplayHandler__WEBPACK_IMPORTED_MODULE_9___default());
  window.WheelHandler = (_js_handlers_WheelHandler__WEBPACK_IMPORTED_MODULE_10___default());
  window.HTMLRenderer = (_js_renderers_HTMLRenderer__WEBPACK_IMPORTED_MODULE_11___default());
  window.VideoRenderer = (_js_renderers_VideoRenderer__WEBPACK_IMPORTED_MODULE_12___default());
  window.ImageRenderer = (_js_renderers_ImageRenderer__WEBPACK_IMPORTED_MODULE_13___default());

  // Auto-initialize all rolls with data-swr attribute
  // This runs when DOM is ready
  var initDataAttributeRolls = function initDataAttributeRolls() {
    var rolls = document.querySelectorAll('[data-swr]:not([data-swr-initialized])');
    rolls.forEach(function (element) {
      // Mark as initialized to prevent duplicate initialization
      element.setAttribute('data-swr-initialized', 'true');
      // Initialize the roll
      new _js_index__WEBPACK_IMPORTED_MODULE_14__["default"](element);
      console.log('✅ Auto-initialized SWR from data attributes:', element);
    });
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAttributeRolls);
  } else {
    // DOM is already loaded
    initDataAttributeRolls();
  }
}

// Export for ES modules and UMD
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_js_index__WEBPACK_IMPORTED_MODULE_14__["default"]);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=swr.js.map