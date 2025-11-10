/**
 * SenangWebs Roll (SWR) - Main Bundle Entry Point
 * This file bundles all components together for distribution
 */

// Import CSS
import './css/swr.css';

// Import all modules - webpack will handle the CommonJS conversion
import ConfigParser from './js/parsers/ConfigParser';
import DataAttributeParser from './js/parsers/DataAttributeParser';
import EventManager from './js/core/EventManager';
import MediaManager from './js/core/MediaManager';
import Navigation from './js/core/Navigation';
import Roll from './js/core/Roll';
import TouchHandler from './js/handlers/TouchHandler';
import KeyboardHandler from './js/handlers/KeyboardHandler';
import AutoplayHandler from './js/handlers/AutoplayHandler';
import WheelHandler from './js/handlers/WheelHandler';
import HTMLRenderer from './js/renderers/HTMLRenderer';
import VideoRenderer from './js/renderers/VideoRenderer';
import ImageRenderer from './js/renderers/ImageRenderer';
import SWR from './js/index';

// Make all classes globally available for browser usage
if (typeof window !== 'undefined') {
  window.SWR = SWR;
  window.ConfigParser = ConfigParser;
  window.DataAttributeParser = DataAttributeParser;
  window.EventManager = EventManager;
  window.MediaManager = MediaManager;
  window.Navigation = Navigation;
  window.Roll = Roll;
  window.TouchHandler = TouchHandler;
  window.KeyboardHandler = KeyboardHandler;
  window.AutoplayHandler = AutoplayHandler;
  window.WheelHandler = WheelHandler;
  window.HTMLRenderer = HTMLRenderer;
  window.VideoRenderer = VideoRenderer;
  window.ImageRenderer = ImageRenderer;

  // Auto-initialize all rolls with data-swr attribute
  // This runs when DOM is ready
  const initDataAttributeRolls = () => {
    const rolls = document.querySelectorAll('[data-swr]:not([data-swr-initialized])');
    rolls.forEach((element) => {
      // Mark as initialized to prevent duplicate initialization
      element.setAttribute('data-swr-initialized', 'true');
      // Initialize the roll
      new SWR(element);
      console.log('✅ Auto-initialized SWR from data attributes:', element);
    });
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAttributeRolls);
  } else {
    // DOM is already loaded
    initDataAttributeRolls();
  }
}

// Export for ES modules and UMD
export default SWR;

export {
  SWR,
  ConfigParser,
  DataAttributeParser,
  EventManager,
  MediaManager,
  Navigation,
  Roll,
  TouchHandler,
  KeyboardHandler,
  AutoplayHandler,
  WheelHandler,
  HTMLRenderer,
  VideoRenderer,
  ImageRenderer,
};
