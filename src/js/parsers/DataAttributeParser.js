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
    if (autoplayInterval) config.autoplayInterval = parseInt(autoplayInterval, 10);

    const transitionDuration = element.getAttribute('data-swr-transition');
    if (transitionDuration) config.transitionDuration = parseInt(transitionDuration, 10);

    const swipeThreshold = element.getAttribute('data-swr-swipe-threshold');
    if (swipeThreshold) config.swipeThreshold = parseInt(swipeThreshold, 10);

    return config;
  }

  /**
   * Extract items from element with data-swr-item attributes
   * @param {HTMLElement} element - Parent element containing items
   * @returns {Array} Array of item objects
   */
  static parseItems(element) {
    const items = [];
    const itemElements = element.querySelectorAll('[data-swr-item]');

    itemElements.forEach((itemEl) => {
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
      content: itemEl.innerHTML,
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
      title: imgEl.getAttribute('title') || '',
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataAttributeParser;
}
