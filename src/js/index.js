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

const INSTANCE = Symbol.for('senangwebs-roll.instance');
const ROOT_ATTRIBUTES = ['class', 'role', 'aria-roledescription', 'aria-label', 'tabindex', 'data-swr-initialized'];
const SLIDE_ATTRIBUTES = ['role', 'aria-roledescription', 'aria-label', 'aria-hidden', 'inert'];
const capture = (element, names) => names.map(name => [name, element.getAttribute(name)]);
const restore = (element, attributes) => attributes.forEach(([name, value]) => {
  if (value === null) element.removeAttribute(name); else element.setAttribute(name, value);
});
const resolveElement = selector => {
  if (typeof selector !== 'string') return selector;
  if (typeof document === 'undefined') return null;
  try { return document.querySelector(selector); } catch { return null; }
};

/** Browser-independent imports; DOM access begins only at construction/initAll. */
class SWR {
  static getInstance(selector) { return resolveElement(selector)?.[INSTANCE] || null; }
  static initAll(root) {
    const scope = root || (typeof document !== 'undefined' ? document : null);
    if (!scope?.querySelectorAll) return [];
    const elements = [...(scope.matches?.('[data-swr]') ? [scope] : []),
      ...scope.querySelectorAll('[data-swr]')];
    return elements.map(element => SWR.getInstance(element) || new SWR(element));
  }
  constructor(selector, config = {}) {
    this.element = resolveElement(selector);
    if (!this.element || this.element.nodeType !== 1 || !this.element.ownerDocument) {
      throw new Error('Element not found: ' + selector);
    }
    if (this.element[INSTANCE]) return this.element[INSTANCE];
    this.document = this.element.ownerDocument;
    this.window = this.document.defaultView;
    this.config = ConfigParser.parse({ ...(config && typeof config === 'object' ? config : {}),
      ...DataAttributeParser.parseConfig(this.element) });
    this.eventManager = new EventManager();
    this.mediaManager = new MediaManager(this.eventManager);
    this.config.items = this.config.items.filter(item => this.mediaManager.validateItem(item));
    this.navigation = new Navigation(this.eventManager, this.config);
    this.roll = new Roll(this.element, this.eventManager, this.config);
    this.renderers = { html: new HTMLRenderer(), video: new VideoRenderer(), image: new ImageRenderer() };
    this.isInitialized = false;
    this.isDestroyed = false;
    this.isMutating = false;
    this.isNavigating = false;
    this.isVisible = true;
    this.originalFocus = this.element.contains(this.document.activeElement) ? this.document.activeElement : null;
    this.originalChildren = Array.from(this.element.childNodes);
    this.originalAttributes = capture(this.element, ROOT_ATTRIBUTES);
    this.originalItems = DataAttributeParser.getItemElements(this.element).map(element => ({
      element, parent: element.parentNode, next: element.nextSibling,
      attributes: capture(element, SLIDE_ATTRIBUTES),
    }));
    this.slideAttributes = new Map();
    this.videoAutoplay = new Map();
    this.mediaGeneration = 0;
    this.motionQuery = this.window?.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.boundMotion = event => {
      if ((event.matches ?? this.motionQuery.matches) && this.roll?.isAnimating) {
        const index = this.roll.currentIndex;
        this.roll.cancelTransition();
        this.eventManager.emit('slideCompleted', { index });
      }
    };
    Object.defineProperty(this.element, INSTANCE, { value: this, configurable: true });
    try { this.init(); } catch (error) { this.destroy(); throw error; }
  }
  init() {
    const validDOM = this.originalItems.filter(({ element }) =>
      this.mediaManager.validateItem(DataAttributeParser.parseItemElement(element)));
    this.roll.initialize(validDOM.map(entry => entry.element));
    if (this.originalItems.length) {
      validDOM.forEach(({ element }) => this.mediaManager.addItem(DataAttributeParser.parseItemElement(element), null, false));
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
      this.isVisible = this.element.getClientRects().length > 0 && bounds.bottom > 0 && bounds.right > 0 &&
        bounds.top < this.window.innerHeight && bounds.left < this.window.innerWidth;
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
      target.focus({ preventScroll: true });
      this.originalFocus = null;
    }
    if (this.isDestroyed) return;
    this.updateVisibility();
    this.element.setAttribute('data-swr-initialized', 'true');
    this.isInitialized = true;
    if (this.config.autoplay && this.getTotalItems() > 1) this.autoplayHandler.play();
    Promise.resolve().then(() => {
      if (!this.isDestroyed) this.eventManager.emit('initialized', { totalItems: this.getTotalItems() });
    });
  }
  setupHandlers() {
    this.touchHandler = new TouchHandler(this.roll.viewport, this.eventManager, this.config, direction => this.handleSwipe(direction));
    this.keyboardHandler = new KeyboardHandler(this.element, this.eventManager, this.config, key => this.handleKeyPress(key));
    this.wheelHandler = new WheelHandler(this.roll.viewport, this.eventManager, this.config, direction => this.handleWheel(direction));
    this.mouseDragHandler = new MouseDragHandler(this.roll.viewport, this.eventManager, this.config, direction => this.handleMouseDrag(direction));
    this.autoplayHandler = new AutoplayHandler(this.eventManager, this.config, () => this.handleAutoplayTick());
    [this.touchHandler, this.keyboardHandler, this.wheelHandler, this.mouseDragHandler].forEach(handler => handler.enable());
    for (const event of ['swipeDetected', 'wheelDetected', 'dragDetected', 'keyboardEvent']) {
      this.eventManager.on(event, data => {
        if (this.isDestroyed || (event === 'keyboardEvent' && data.key === ' ')) return;
        if (this.config.enableAutoplayPauseOnInteraction) this.autoplayHandler.pauseTemporarily();
      });
    }
    this.eventManager.on('tapDetected', () => this.togglePlayback());
    this.eventManager.on('slideCompleted', () => {
      if (!this.isDestroyed && this.autoplayHandler.wantsPlayback &&
        !this.config.loop && this.navigation.isAtEnd()) this.pause();
    });
  }
  getRenderer(type) { return this.renderers[type] || null; }
  renderItems() {
    this.mediaManager.getItems().forEach((item, index) => this.roll.renderItem(index, this.getRenderer(item.type), item));
  }
  handleSwipe(direction) { if (direction === 'up') this.next(); else if (direction === 'down') this.prev(); }
  handleMouseDrag(direction) { this.handleSwipe(direction); }
  handleWheel(direction) { if (direction === 'down') this.next(); else if (direction === 'up') this.prev(); }
  handleKeyPress(key) { if (key === 'ArrowDown') this.next(); else if (key === 'ArrowUp') this.prev(); else if (key === ' ') this.togglePlayback(); }
  togglePlayback() {
    if (this.isDestroyed) return;
    if (this.autoplayHandler.wantsPlayback) this.pause(); else this.play();
  }
  handleAutoplayTick() {
    if (this.isDestroyed) return;
    if (this.getTotalItems() < 2 || (!this.config.loop && this.navigation.isAtEnd())) { this.pause(); return; }
    this.navigate(this.getCurrentIndex() + 1, 'up', false);
  }
  next() { this.navigate(this.getCurrentIndex() + 1, 'up'); }
  prev() { this.navigate(this.getCurrentIndex() - 1, 'down'); }
  goTo(index) { this.navigate(index); }
  navigate(index, direction, manual = true) {
    if (this.isDestroyed || this.isMutating || this.isNavigating || this.roll.isAnimating ||
      this.getTotalItems() < 2 || !Number.isInteger(index)) return;
    const count = this.getTotalItems();
    const oldIndex = this.getCurrentIndex();
    const isWrapping = !!direction && this.config.loop && (index < 0 || index >= count);
    const target = isWrapping ? (index < 0 ? count - 1 : 0) : Math.max(0, Math.min(index, count - 1));
    if (target === oldIndex) return;
    this.isNavigating = true;
    try {
      this.navigation.currentIndex = target;
      // Query the current preference: WebKit can update a retained MediaQueryList later than a fresh query.
      const reducedMotion = !!this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      this.roll.slideTo(target, { isWrapping, direction, immediate: reducedMotion, silent: true });
      this.updateAccessibility();
      if (this.isDestroyed) return;
      this.syncMedia();
      if (this.isDestroyed) return;
      if (manual) this.liveRegion.textContent = 'Slide ' + (target + 1) + ' of ' + count;
      this.eventManager.emit('navigationChanged', { oldIndex, newIndex: target, totalItems: count });
      if (!this.isDestroyed) this.eventManager.emit('slideStarted', { index: target });
    } finally { this.isNavigating = false; }
  }
  addItem(item, index = null) {
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
      this.eventManager.emit('beforeRender', { index: actualIndex, item });
      if (this.isDestroyed) return;
      element.appendChild(this.getRenderer(item.type).render(item));
      this.syncMedia();
      if (this.isDestroyed) return;
      this.eventManager.emit('afterRender', { index: actualIndex, item });
      if (this.isDestroyed) return;
      this.eventManager.emit('itemAdded', { item: this.mediaManager.getItem(actualIndex), index: actualIndex });
      if (!this.isDestroyed && oldIndex !== this.getCurrentIndex()) this.emitNavigation(oldIndex);
    } finally { this.isMutating = false; }
  }
  removeItem(index) {
    if (this.isDestroyed || this.isMutating || this.isNavigating ||
      !Number.isInteger(index) || index < 0 || index >= this.getTotalItems()) return;
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
      if (shouldFocus) this.element.focus({ preventScroll: true });
      if (this.isDestroyed) return;
      this.updateAccessibility();
      if (this.isDestroyed) return;
      this.syncMedia();
      if (this.isDestroyed) return;
      this.eventManager.emit('itemRemoved', { item, index });
      if (!this.isDestroyed && (oldIndex !== this.getCurrentIndex() || index === oldIndex)) this.emitNavigation(oldIndex);
      if (!this.isDestroyed && this.getTotalItems() < 2) this.pause();
    } finally { this.isMutating = false; }
  }
  emitNavigation(oldIndex) {
    this.eventManager.emit('navigationChanged', { oldIndex, newIndex: this.getCurrentIndex(), totalItems: this.getTotalItems() });
  }
  updateAccessibility() {
    const count = this.getTotalItems();
    this.roll.itemElements.forEach((element, index) => {
      if (this.isDestroyed) return;
      if (!this.slideAttributes.has(element)) this.slideAttributes.set(element, capture(element, SLIDE_ATTRIBUTES));
      const active = index === this.getCurrentIndex();
      if (!active && element.contains(this.document.activeElement)) this.element.focus({ preventScroll: true });
      if (this.isDestroyed) return;
      if (!element.hasAttribute('role')) element.setAttribute('role', 'group');
      element.setAttribute('aria-roledescription', 'slide');
      // Preserve consumer labels; update only the generated positional label.
      const original = this.slideAttributes.get(element).find(([name]) => name === 'aria-label')[1];
      if (original === null) element.setAttribute('aria-label', (index + 1) + ' of ' + count);
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
    try { video.pause(); } catch { /* Detached/unsupported media still permits cleanup. */ }
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
        if (hidden || element !== activeElement) { this.pauseVideo(video); return; }
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
              this.eventManager.emit('mediaPlaybackError', { index, error });
            }
          });
        } catch (error) { this.eventManager.emit('mediaPlaybackError', { index, error }); }
      });
    });
  }
  getCurrentIndex() { return this.navigation?.getCurrentIndex() ?? 0; }
  getTotalItems() { return this.mediaManager?.getItemCount() ?? 0; }
  play() { if (!this.isDestroyed && this.getTotalItems() > 1) this.autoplayHandler.play(); }
  pause() { if (!this.isDestroyed) this.autoplayHandler.pause(); }
  isPlaying() { return !!this.autoplayHandler?.isAutoplayActive(); }
  on(event, callback) { return this.isDestroyed ? () => {} : this.eventManager.on(event, callback); }
  off(event, callback) { this.eventManager?.off(event, callback); }
  getConfig() { return { ...this.config, items: this.config.items.map(item => item && typeof item === 'object' ? { ...item } : item) }; }
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
    if (focusedNode && this.element.contains(focusedNode) &&
      (this.document.activeElement === this.document.body || this.element.contains(this.document.activeElement))) {
      focusedNode.focus({ preventScroll: true });
    }
  }
}
export default SWR;
