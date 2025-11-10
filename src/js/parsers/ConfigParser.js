/**
 * ConfigParser - Validates, merges, and provides default configuration
 */
class ConfigParser {
  /**
   * Default configuration for SWR
   */
  static DEFAULT_CONFIG = {
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
    items: [],
  };

  /**
   * Parse and validate configuration
   * @param {Object} userConfig - User provided configuration
   * @returns {Object} Merged and validated configuration
   */
  static parse(userConfig = {}) {
    const config = { ...this.DEFAULT_CONFIG };

    if (typeof userConfig !== 'object' || userConfig === null) {
      console.warn('Invalid config provided, using defaults');
      return config;
    }

    // Merge user config with defaults
    Object.keys(userConfig).forEach((key) => {
      if (key in config) {
        config[key] = userConfig[key];
      } else {
        console.warn(`Unknown config option: ${key}`);
      }
    });

    this.validate(config);
    return config;
  }

  /**
   * Validate configuration values
   * @param {Object} config - Configuration to validate
   * @throws {Error} If validation fails
   */
  static validate(config) {
    // Validate aspectRatio format (e.g., "9:16")
    if (typeof config.aspectRatio !== 'string' || !this.isValidAspectRatio(config.aspectRatio)) {
      console.warn(`Invalid aspectRatio: ${config.aspectRatio}, using default`);
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
  static isValidAspectRatio(ratio) {
    const match = ratio.match(/^(\d+):(\d+)$/);
    return match !== null && parseInt(match[1]) > 0 && parseInt(match[2]) > 0;
  }

  /**
   * Parse aspect ratio string to numeric value
   * @param {string} ratio - Aspect ratio string (e.g., "9:16")
   * @returns {number} Numeric ratio value (width / height)
   */
  static parseAspectRatio(ratio) {
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigParser;
}
