/** Owns slide DOM and cancellable transitions; never clones consumer nodes. */
class Roll {
  constructor(element, eventManager, config) {
    Object.assign(this, { element, eventManager, config, currentIndex: 0,
      container: null, viewport: null, itemElements: [], isAnimating: false,
      transitionId: null, generation: 0, wrapItem: null, wrapTransform: null });
  }
  initialize(elements = []) {
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
    Object.assign(this.viewport.style, { position: 'relative', width: '100%',
      aspectRatio: width + ' / ' + height, overflow: 'hidden' });
    Object.assign(this.container.style, { position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      transition: 'transform ' + this.config.transitionDuration + 'ms ease-in-out',
      transform: 'translateY(0%)' });
  }
  parseAspectRatio(ratio) {
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }
  updateItemElements() {
    this.itemElements = this.container ? Array.from(this.container.children).filter(item => item.hasAttribute('data-swr-item')) : [];
  }
  addItemElement(index = null) {
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
    this.eventManager.emit('beforeRender', { index, item });
    if (!this.container) return;
    element.replaceChildren(renderer.render(item));
    this.eventManager.emit('afterRender', { index, item });
  }
  slideTo(index, options = {}) {
    if (!this.container || this.isAnimating || !Number.isInteger(index) ||
      index < 0 || index >= this.itemElements.length || index === this.currentIndex) return false;
    const fromIndex = this.currentIndex;
    this.currentIndex = index;
    this.isAnimating = true;
    const generation = ++this.generation;
    const duration = options.immediate ? 0 : this.config.transitionDuration;
    this.container.style.transition = duration ? 'transform ' + duration + 'ms ease-in-out' : 'none';
    if (duration && options.isWrapping && this.itemElements.length > 1) {
      this.handleWrapAnimation(fromIndex, index, options.direction);
    } else this.container.style.transform = 'translateY(' + (-index * 100) + '%)';
    const complete = () => {
      if (!this.container || generation !== this.generation) return;
      this.transitionId = null;
      this.resetWrap();
      this.snapTo(this.currentIndex);
      this.isAnimating = false;
      this.eventManager.emit('slideCompleted', { index: this.currentIndex });
    };
    if (duration) this.transitionId = setTimeout(complete, duration);
    else Promise.resolve().then(complete);
    if (!options.silent) this.eventManager.emit('slideStarted', { index });
    return true;
  }
  handleWrapAnimation(fromIndex, toIndex, direction) {
    const total = this.itemElements.length;
    if (fromIndex === total - 1 && toIndex === 0 && direction === 'up') {
      this.wrapItem = this.itemElements[0];
      this.wrapTransform = this.wrapItem.style.transform;
      this.wrapItem.style.transform = 'translateY(' + total * 100 + '%)';
      this.container.style.transform = 'translateY(' + (-total * 100) + '%)';
    } else if (fromIndex === 0 && toIndex === total - 1 && direction === 'down') {
      this.wrapItem = this.itemElements[total - 1];
      this.wrapTransform = this.wrapItem.style.transform;
      this.wrapItem.style.transform = 'translateY(' + (-total * 100) + '%)';
      this.container.style.transform = 'translateY(100%)';
    } else this.container.style.transform = 'translateY(' + (-toIndex * 100) + '%)';
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
    this.container.style.transform = 'translateY(' + (-index * 100) + '%)';
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
  getItemCount() { return this.itemElements.length; }
  getCurrentIndex() { return this.currentIndex; }
  destroy() {
    this.cancelTransition();
    this.container = null;
    this.viewport = null;
    this.itemElements = [];
  }
}
module.exports = Roll;
