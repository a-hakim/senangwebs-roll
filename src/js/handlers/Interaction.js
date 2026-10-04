const CONTROL_SELECTOR = 'a,button,input,textarea,select,option,video[controls],audio[controls],summary,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="slider"],[data-swr-ignore]';
function isControl(target) { return !!target?.closest?.(CONTROL_SELECTOR); }
// Nested rolls own their gestures.
function ownsEvent(element, target) {
  const root = element.closest('.swr') || element;
  return target?.closest?.('.swr') === root;
}
module.exports = { isControl, ownsEvent };
