/**
 * SenangWebs Roll (SWR) - Main class
 * Lightweight roll library for creating responsive media rolls
 */

// Import dependencies - webpack will convert CommonJS exports to ES6
import ConfigParser from './parsers/ConfigParser';
import DataAttributeParser from './parsers/DataAttributeParser';
import EventManager from './core/EventManager';
import MediaManager from './core/MediaManager';
import Navigation from './core/Navigation';
import Roll from './core/Roll';
import TouchHandler from './handlers/TouchHandler';
import KeyboardHandler from './handlers/KeyboardHandler';
import AutoplayHandler from './handlers/AutoplayHandler';
import WheelHandler from './handlers/WheelHandler';
import MouseDragHandler from './handlers/MouseDragHandler';
import HTMLRenderer from './renderers/HTMLRenderer';
import VideoRenderer from './renderers/VideoRenderer';
import ImageRenderer from './renderers/ImageRenderer';

class SWR {
  /**
   * Constructor
   * @param {string|HTMLElement} selector - CSS selector or DOM element
   * @param {Object} config - Configuration object
   */
  constructor(selector, config = {}) {
    // Get element
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;

    if (!this.element) {
      throw new Error(`Element not found: ${selector}`);
    }

    // Parse configuration
    this.config = ConfigParser.parse(config);

    // Initialize core components
    this.eventManager = new EventManager();
    this.mediaManager = new MediaManager(this.eventManager);
    this.navigation = new Navigation(this.eventManager, this.config);
    this.roll = new Roll(this.element, this.eventManager, this.config);

    // Initialize handlers
    this.touchHandler = null;
    this.keyboardHandler = null;
    this.wheelHandler = null;
    this.mouseDragHandler = null;
    this.autoplayHandler = null;

    // Renderers
    this.renderers = {
      html: new HTMLRenderer(),
      video: new VideoRenderer(),
      image: new ImageRenderer(),
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
  init() {
    // Check for data attributes or existing items
    const dataConfig = DataAttributeParser.parseConfig(this.element);
    const dataItems = DataAttributeParser.parseItems(this.element);

    // Merge data attributes into config
    this.config = ConfigParser.parse({ ...this.config, ...dataConfig });

    // Setup roll DOM
    this.roll.initialize();

    // Add items (from data attributes or config)
    if (dataItems.length > 0) {
      dataItems.forEach((item) => this.mediaManager.addItem(item));
    } else if (this.config.items) {
      this.config.items.forEach((item) => this.mediaManager.addItem(item));
    }

    // Initialize navigation
    const itemCount = this.mediaManager.getItemCount();
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
    this.eventManager.emit('initialized', { totalItems: itemCount });
  }

  /**
   * Setup event handlers
   * @private
   */
  setupHandlers() {
    // Touch/Swipe handler
    this.touchHandler = new TouchHandler(
      this.roll.viewport,
      this.eventManager,
      this.config,
      (direction) => this.handleSwipe(direction)
    );
    this.touchHandler.enable();

    // Keyboard handler
    this.keyboardHandler = new KeyboardHandler(
      this.element,
      this.eventManager,
      this.config,
      (key) => this.handleKeyPress(key)
    );
    this.keyboardHandler.enable();

    // Mouse wheel handler (desktop support)
    this.wheelHandler = new WheelHandler(
      this.roll.viewport,
      this.eventManager,
      this.config,
      (direction) => this.handleWheel(direction)
    );
    this.wheelHandler.enable();

    // Mouse drag handler (desktop drag support)
    this.mouseDragHandler = new MouseDragHandler(
      this.roll.viewport,
      this.eventManager,
      this.config,
      (direction) => this.handleMouseDrag(direction)
    );
    this.mouseDragHandler.enable();

    // Autoplay handler
    this.autoplayHandler = new AutoplayHandler(
      this.eventManager,
      this.config,
      () => this.handleAutoplayTick()
    );

    // Listen for user interactions to pause autoplay
    if (this.config.enableAutoplayPauseOnInteraction) {
      this.eventManager.on('swipeDetected', () => {
        if (this.autoplayHandler.isAutoplayActive()) {
          this.autoplayHandler.pauseTemporarily();
        }
      });

      this.eventManager.on('keyboardEvent', () => {
        if (this.autoplayHandler.isAutoplayActive()) {
          this.autoplayHandler.pauseTemporarily();
        }
      });

      this.eventManager.on('wheelDetected', () => {
        if (this.autoplayHandler.isAutoplayActive()) {
          this.autoplayHandler.pauseTemporarily();
        }
      });

      this.eventManager.on('dragDetected', () => {
        if (this.autoplayHandler.isAutoplayActive()) {
          this.autoplayHandler.pauseTemporarily();
        }
      });
    }

    // Listen for tap events to toggle autoplay
    this.eventManager.on('tapDetected', () => {
      console.log('📱 Tap detected - toggling autoplay');
      if (this.autoplayHandler.isAutoplayActive()) {
        this.pause();
      } else {
        this.play();
      }
    });
  }

  /**
   * Render all items
   * @private
   */
  renderItems() {
    const items = this.mediaManager.getItems();
    items.forEach((item, index) => {
      const renderer = this.getRenderer(item.type);
      if (renderer) {
        this.roll.renderItem(index, renderer, item);
      }
    });
  }

  /**
   * Get renderer for item type
   * @private
   * @param {string} type - Item type (html, video, image)
   * @returns {Object} Renderer instance
   */
  getRenderer(type) {
    return this.renderers[type] || null;
  }

  /**
   * Handle swipe event
   * @private
   */
  handleSwipe(direction) {
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
  handleKeyPress(key) {
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
  handleWheel(direction) {
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
  handleMouseDrag(direction) {
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
  handleAutoplayTick() {
    this.next();
  }

  // ========== Public API ==========

  /**
   * Go to next item
   */
  next() {
    if (this.isDestroyed) return;

    const navResult = this.navigation.next();
    console.log('✨ Navigating to next item - Index:', navResult.index, 'Wrapping:', navResult.isWrapping);
    this.roll.slideTo(navResult.index, {
      isWrapping: navResult.isWrapping,
      direction: navResult.direction
    });
  }

  /**
   * Go to previous item
   */
  prev() {
    if (this.isDestroyed) return;

    const navResult = this.navigation.prev();
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
  goTo(index) {
    if (this.isDestroyed) return;

    const newIndex = this.navigation.goTo(index);
    this.roll.slideTo(newIndex);
  }

  /**
   * Add a new item to the roll
   * @param {Object} item - Item object
   * @param {number} index - Optional insertion index
   */
  addItem(item, index = null) {
    if (this.isDestroyed) return;

    const success = this.mediaManager.addItem(item, index);
    if (success) {
      // Update roll
      this.roll.updateItemElements();
      const renderer = this.getRenderer(item.type);
      const actualIndex = index !== null ? index : this.mediaManager.getItemCount() - 1;
      this.roll.renderItem(actualIndex, renderer, item);

      // Update navigation
      this.navigation.initialize(this.mediaManager.getItemCount());
    }
  }

  /**
   * Remove an item by index
   * @param {number} index - Item index
   */
  removeItem(index) {
    if (this.isDestroyed) return;

    const item = this.mediaManager.removeItem(index);
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
  getCurrentIndex() {
    return this.navigation.getCurrentIndex();
  }

  /**
   * Get total number of items
   * @returns {number}
   */
  getTotalItems() {
    return this.mediaManager.getItemCount();
  }

  /**
   * Start autoplay
   */
  play() {
    if (this.isDestroyed) return;

    if (!this.autoplayHandler) return;

    this.autoplayHandler.play();
  }

  /**
   * Pause autoplay
   */
  pause() {
    if (this.isDestroyed) return;

    if (!this.autoplayHandler) return;

    this.autoplayHandler.pause();
  }

  /**
   * Check if autoplay is active
   * @returns {boolean}
   */
  isPlaying() {
    if (!this.autoplayHandler) return false;

    return this.autoplayHandler.isAutoplayActive();
  }

  /**
   * Subscribe to event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    return this.eventManager.on(event, callback);
  }

  /**
   * Unsubscribe from event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    this.eventManager.off(event, callback);
  }

  /**
   * Get current configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Destroy the SWR instance
   */
  destroy() {
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
    this.eventManager?.emit('destroy');

    this.isInitialized = false;
  }
}

// ES6 export (webpack will handle UMD conversion)
export default SWR;
