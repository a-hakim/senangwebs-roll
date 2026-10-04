const { isControl } = require('./Interaction');
const hoveredRolls = new WeakMap();
class KeyboardHandler {
  constructor(element, eventManager, config, onKeyPress) {
    Object.assign(this, { element, eventManager, config, onKeyPress, isHandlerAttached: false });
    this.document = element.ownerDocument;
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundMouseEnter = () => hoveredRolls.set(this.document, this.element);
    this.boundMouseLeave = () => {
      if (hoveredRolls.get(this.document) === this.element) {
        const parent = this.element.parentElement?.closest('.swr');
        if (parent) hoveredRolls.set(this.document, parent); else hoveredRolls.delete(this.document);
      }
    };
  }
  enable() {
    if (!this.config.enableKeyboard || this.isHandlerAttached) return;
    this.isHandlerAttached = true;
    if (!this.element.hasAttribute('tabindex')) this.element.setAttribute('tabindex', '0');
    this.document.addEventListener('keydown', this.boundKeyDown);
    this.element.addEventListener('mouseenter', this.boundMouseEnter);
    this.element.addEventListener('mouseleave', this.boundMouseLeave);
  }
  disable() {
    if (!this.isHandlerAttached) return;
    this.isHandlerAttached = false;
    this.document.removeEventListener('keydown', this.boundKeyDown);
    this.element.removeEventListener('mouseenter', this.boundMouseEnter);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);
    this.boundMouseLeave();
  }
  handleKeyDown(event) {
    if (!this.isHandlerAttached || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
      isControl(event.target) || isControl(this.document.activeElement)) return;
    const focusedRoll = this.document.activeElement?.closest?.('.swr');
    if (focusedRoll ? focusedRoll !== this.element : hoveredRolls.get(this.document) !== this.element) return;
    if (!focusedRoll && this.element.querySelector('.swr:hover')) return;
    const key = ({ ArrowRight: 'ArrowDown', ArrowLeft: 'ArrowUp', Spacebar: ' ' })[event.key] || event.key;
    if (!['ArrowDown', 'ArrowUp', ' '].includes(key)) return;
    event.preventDefault();
    this.eventManager.emit('keyboardEvent', { key });
    this.onKeyPress?.(key);
  }
  destroy() { this.disable(); this.onKeyPress = null; }
}
module.exports = KeyboardHandler;
