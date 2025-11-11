/**
 * Roll - Core roll logic (positioning, animations)
 */
class Roll {
  constructor(element, eventManager, config) {
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
  initialize() {
    this.setupDOM();
    this.setupStyles();
  }

  /**
   * Setup roll DOM structure
   */
  setupDOM() {
    // Create viewport container
    this.viewport = document.createElement('div');
    this.viewport.className = 'swr-viewport';

    // Create scrollable container
    this.container = document.createElement('div');
    this.container.className = 'swr-container';

    // Move existing items to container
    const existingItems = this.element.querySelectorAll('[data-swr-item]');
    existingItems.forEach((item) => {
      this.container.appendChild(item.cloneNode(true));
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
  setupStyles() {
    // Set viewport aspect ratio using padding-bottom trick for better browser support
    const ratio = this.parseAspectRatio(this.config.aspectRatio);
    const paddingPercent = (1 / ratio) * 100;
    
    this.viewport.style.position = 'relative';
    this.viewport.style.width = '100%';
    this.viewport.style.paddingBottom = `${paddingPercent}%`;
    this.viewport.style.overflow = 'hidden';

    // Setup container for vertical scrolling (Instagram Reels style)
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
    this.container.style.transform = 'translateY(0)';
  }

  /**
   * Parse aspect ratio string to numeric value
   * @param {string} ratio - Aspect ratio (e.g., "9:16")
   * @returns {number}
   */
  parseAspectRatio(ratio) {
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }

  /**
   * Update item elements reference
   */
  updateItemElements() {
    this.itemElements = Array.from(
      this.container.querySelectorAll('[data-swr-item]')
    );
  }

  /**
   * Add item element to container
   * @param {number} index - Optional index to insert at
   * @returns {HTMLElement} Created item element
   */
  addItemElement(index = null) {
    const itemElement = document.createElement('div');
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
  renderItem(index, renderer, item) {
    // Create item elements until we have enough
    while (index >= this.itemElements.length) {
      this.addItemElement();
    }

    if (index < 0 || index >= this.itemElements.length) {
      console.warn('Invalid item index:', index);
      return;
    }

    this.eventManager.emit('beforeRender', { index, item });

    const element = this.itemElements[index];
    element.innerHTML = '';
    element.appendChild(renderer.render(item));

    this.eventManager.emit('afterRender', { index, item });
  }

  /**
   * Slide to item at index
   * @param {number} targetIndex - Target item index
   * @param {Object} options - Animation options
   * @param {boolean} options.isWrapping - Whether this is a wrap-around navigation
   * @param {string} options.direction - Direction of animation ('up' or 'down')
   */
  slideTo(targetIndex, options = {}) {
    if (targetIndex < 0 || targetIndex >= this.itemElements.length) {
      console.warn('Invalid slide index:', targetIndex);
      return;
    }

    if (this.isAnimating) {
      console.log('⏳ Animation in progress, ignoring slide request');
      return;
    }

    this.isAnimating = true;
    const previousIndex = this.currentIndex;
    this.currentIndex = targetIndex;

    // Handle wrap-around animation for seamless looping
    if (options.isWrapping && this.itemElements.length > 1) {
      this.handleWrapAnimation(previousIndex, targetIndex, options.direction);
    } else {
      // Normal slide animation
      const offset = -targetIndex * 100;
      this.container.style.transform = `translateY(${offset}%)`;
      console.log('🎬 Sliding to item', targetIndex, '- Transform: translateY(' + offset + '%)');
    }

    // Emit slide event
    this.eventManager.emit('slideStarted', { index: targetIndex });

    // Clear previous timeout
    if (this.transitionId) clearTimeout(this.transitionId);

    // Wait for transition to complete
    this.transitionId = setTimeout(() => {
      this.isAnimating = false;
      console.log('✅ Slide animation completed for item', targetIndex);
      this.eventManager.emit('slideCompleted', { index: targetIndex });
    }, this.config.transitionDuration);
  }

  /**
   * Handle wrap-around animation for seamless infinite scrolling
   * @private
   * @param {number} fromIndex - Starting index
   * @param {number} toIndex - Target index
   * @param {string} direction - Animation direction ('up' or 'down')
   */
  handleWrapAnimation(fromIndex, toIndex, direction) {
    const totalItems = this.itemElements.length;
    
    // Wrapping from last to first (user swiped up on last item)
    // Should animate in the "up" direction (natural continuation)
    if (fromIndex === totalItems - 1 && toIndex === 0 && direction === 'up') {
      console.log('🔄 Wrap animation: last → first (animating UP)');
      
      // Temporarily disable transition
      this.container.style.transition = 'none';
      
      // Position to show the last item (current position)
      const currentOffset = -fromIndex * 100;
      this.container.style.transform = `translateY(${currentOffset}%)`;
      
      // Force reflow to apply the no-transition state
      this.container.offsetHeight;
      
      // Re-enable transition
      this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
      
      // Animate to one position "beyond" the last item (which visually represents going to first)
      // This creates the illusion of continuous upward movement
      const animateOffset = -(totalItems) * 100;
      this.container.style.transform = `translateY(${animateOffset}%)`;
      
      console.log('  From:', currentOffset + '% → To:', animateOffset + '%');
      
      // After animation completes, snap to actual first item position without animation
      setTimeout(() => {
        this.container.style.transition = 'none';
        this.container.style.transform = `translateY(0%)`;
        // Force reflow
        this.container.offsetHeight;
        this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
      }, this.config.transitionDuration);
    }
    // Wrapping from first to last (user swiped down on first item)
    // Should animate in the "down" direction (natural continuation)
    else if (fromIndex === 0 && toIndex === totalItems - 1 && direction === 'down') {
      console.log('🔄 Wrap animation: first → last (animating DOWN)');
      
      // Temporarily disable transition
      this.container.style.transition = 'none';
      
      // Position to show the first item at index 0
      this.container.style.transform = `translateY(0%)`;
      
      // Force reflow
      this.container.offsetHeight;
      
      // Re-enable transition
      this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
      
      // Animate to one position "before" the first item (downward movement)
      // This gives the illusion of continuous downward scrolling
      const animateOffset = 100;
      this.container.style.transform = `translateY(${animateOffset}%)`;
      
      console.log('  From: 0% → To:', animateOffset + '%');
      
      // After animation completes, snap to actual last item position without animation
      setTimeout(() => {
        this.container.style.transition = 'none';
        const finalOffset = -(totalItems - 1) * 100;
        this.container.style.transform = `translateY(${finalOffset}%)`;
        // Force reflow
        this.container.offsetHeight;
        this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
      }, this.config.transitionDuration);
    }
    // Fallback to normal animation if conditions don't match
    else {
      const offset = -toIndex * 100;
      this.container.style.transform = `translateY(${offset}%)`;
      console.log('🎬 Sliding to item', toIndex, '- Transform: translateY(' + offset + '%)');
    }
  }

  /**
   * Get number of item elements
   * @returns {number}
   */
  getItemCount() {
    return this.itemElements.length;
  }

  /**
   * Get current slide index
   * @returns {number}
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Destroy roll
   */
  destroy() {
    if (this.transitionId) clearTimeout(this.transitionId);
    this.container = null;
    this.viewport = null;
    this.itemElements = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Roll;
}
