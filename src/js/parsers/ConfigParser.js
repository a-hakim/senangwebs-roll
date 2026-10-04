/** Resolve configuration once, before any component captures it. */
class ConfigParser {
  static DEFAULT_CONFIG = {
    aspectRatio: '9:16', loop: false, autoplay: false, autoplayInterval: 5000,
    enableKeyboard: true, enableTouch: true, enableWheel: true, enableMouseDrag: true,
    enableAutoplayPauseOnInteraction: true, autoplayResumeDelay: 3000,
    transitionDuration: 350, swipeThreshold: 50, items: [],
  };
  static parse(userConfig = {}) {
    const input = userConfig && typeof userConfig === 'object' && !Array.isArray(userConfig) ? userConfig : {};
    const config = { ...this.DEFAULT_CONFIG };
    Object.keys(config).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(input, key)) config[key] = input[key];
    });
    this.validate(config);
    if (config.autoplay && input.loop === undefined) config.loop = true;
    config.items = Array.isArray(config.items) ? config.items.map(item => (
      item && typeof item === 'object' ? { ...item } : item
    )) : [];
    return config;
  }
  static validate(config) {
    if (!this.isValidAspectRatio(config.aspectRatio)) config.aspectRatio = this.DEFAULT_CONFIG.aspectRatio;
    for (const key of ['loop', 'autoplay', 'enableKeyboard', 'enableTouch', 'enableWheel',
      'enableMouseDrag', 'enableAutoplayPauseOnInteraction']) {
      if (typeof config[key] !== 'boolean') config[key] = this.DEFAULT_CONFIG[key];
    }
    for (const [key, minimum] of Object.entries({ autoplayInterval: 1000,
      autoplayResumeDelay: 0, transitionDuration: 0, swipeThreshold: 1 })) {
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
