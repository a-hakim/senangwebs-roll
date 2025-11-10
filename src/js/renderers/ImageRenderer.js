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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageRenderer;
}
