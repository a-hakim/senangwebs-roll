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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoRenderer;
}
