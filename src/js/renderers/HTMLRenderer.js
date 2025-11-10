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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HTMLRenderer;
}
