const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const SWR = require('../../dist/swr.js');
const ConfigParser = require('../../src/js/parsers/ConfigParser');
const EventManager = require('../../src/js/core/EventManager');
const AutoplayHandler = require('../../src/js/handlers/AutoplayHandler');
let dom, instances, mediaCalls;
const items = ['A', 'B', 'C'].map(content => ({ type: 'html', content: '<span>' + content + '</span>' }));
function create(config = {}, html = '') {
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.append(element);
  const instance = new SWR(element, { items, ...config });
  instances.push(instance);
  return instance;
}
beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  instances = []; mediaCalls = [];
  dom.window.HTMLMediaElement.prototype.pause = function () { mediaCalls.push(['pause', this]); };
  dom.window.HTMLMediaElement.prototype.play = function () { mediaCalls.push(['play', this]); return Promise.resolve(); };
});
afterEach(() => {
  instances.forEach(instance => instance.destroy());
  dom.window.close();
  delete global.window; delete global.document;
});
test('rapid navigation commits one consistent index and emits one transition', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const roll = create({ loop: true, transitionDuration: 20 });
  const events = [];
  roll.on('navigationChanged', data => events.push(['navigation', data.newIndex]));
  roll.on('slideStarted', data => events.push(['start', data.index]));
  roll.on('slideCompleted', data => events.push(['complete', data.index]));
  roll.next(); roll.next(); roll.prev(); roll.goTo(2);
  assert.equal(roll.getCurrentIndex(), 1);
  assert.equal(roll.roll.currentIndex, 1);
  assert.deepEqual(events, [['navigation', 1], ['start', 1]]);
  t.mock.timers.tick(20);
  assert.deepEqual(events.at(-1), ['complete', 1]);
});
test('both wrap directions settle without item transforms', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const roll = create({ loop: true, transitionDuration: 20 });
  roll.prev();
  assert.equal(roll.roll.container.style.transform, 'translateY(100%)');
  t.mock.timers.tick(20);
  assert.equal(roll.roll.container.style.transform, 'translateY(-200%)');
  roll.next();
  assert.equal(roll.roll.container.style.transform, 'translateY(-300%)');
  t.mock.timers.tick(20);
  assert.equal(roll.roll.container.style.transform, 'translateY(0%)');
  assert(roll.roll.itemElements.every(element => !element.style.transform));
});
test('mutations preserve the active item and remove actual DOM nodes', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const roll = create({ transitionDuration: 20 });
  roll.goTo(1);
  const active = roll.roll.itemElements[1];
  roll.addItem({ type: 'html', content: 'Inserted' }, 0);
  assert.equal(roll.getCurrentIndex(), 2);
  assert.equal(roll.roll.itemElements[2], active);
  assert.equal(roll.getTotalItems(), 4);
  assert.equal(roll.roll.itemElements[1].textContent, 'A');
  roll.removeItem(0);
  assert.equal(roll.getCurrentIndex(), 1);
  assert.equal(roll.roll.itemElements[1], active);
  roll.removeItem(1);
  assert.equal(roll.roll.itemElements[1].textContent, 'C');
  roll.removeItem(1); roll.removeItem(0);
  assert.equal(roll.getTotalItems(), 0);
  assert.equal(roll.roll.itemElements.length, 0);
  assert.equal(roll.getCurrentIndex(), 0);
  t.mock.timers.tick(50);
});
test('invalid input cannot allocate slides or corrupt state', () => {
  const config = ConfigParser.parse({ autoplayInterval: NaN, transitionDuration: Infinity,
    autoplayResumeDelay: -1, swipeThreshold: Infinity, enableMouseDrag: 'false', items: null });
  assert.equal(config.transitionDuration, 350);
  assert.equal(config.enableMouseDrag, true);
  assert.deepEqual(config.items, []);
  const roll = create();
  for (const value of [NaN, Infinity, -Infinity, 0.5, '1', null]) { roll.goTo(value); roll.removeItem(value); }
  assert.equal(roll.getTotalItems(), 3);
  assert.equal(roll.getCurrentIndex(), 0);
  roll.addItem({ type: 'html', content: 'D' }, Infinity);
  assert.equal(roll.getTotalItems(), 4);
  assert.equal(roll.roll.itemElements.at(-1).textContent, 'D');
  roll.addItem({ type: 'image', src: null });
  assert.equal(roll.getTotalItems(), 4);
});
test('attributes resolve once and DOM items override configured items', () => {
  const element = document.createElement('div');
  element.setAttribute('data-swr-autoplay', 'true');
  element.setAttribute('data-swr-aspect-ratio', '16:9');
  element.innerHTML = '<div data-swr-item>Original</div><div data-swr-item>Second</div>';
  document.body.append(element);
  const roll = new SWR(element, { items, aspectRatio: '1:1' }); instances.push(roll);
  assert.equal(roll.config, roll.navigation.config);
  assert.equal(roll.config, roll.roll.config);
  assert.equal(roll.config.loop, true);
  assert.equal(roll.roll.viewport.style.aspectRatio, '16 / 9');
  assert.equal(roll.getTotalItems(), 2);
  assert.equal(roll.roll.itemElements[0].textContent, 'Original');
});
test('readiness, duplicate instances, registry and original listeners survive lifecycle', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const roll = create({ loop: true, transitionDuration: 20 }, '<p>Header</p><section><div data-swr-item><button>Original</button></div><div data-swr-item>Second</div></section>');
  const original = roll.roll.itemElements[0];
  const button = original.querySelector('button');
  let clicks = 0, initialized = 0, destroyed = 0, completed = 0;
  button.addEventListener('click', () => clicks++);
  roll.on('initialized', () => initialized++);
  roll.on('destroy', () => { destroyed++; assert.equal(SWR.getInstance(roll.element), null); });
  roll.on('slideCompleted', () => completed++);
  assert.equal(new SWR(roll.element), roll);
  assert.equal(SWR.getInstance(roll.element), roll);
  await Promise.resolve();
  assert.equal(initialized, 1);
  roll.prev(); roll.destroy(); roll.destroy();
  t.mock.timers.tick(100);
  assert.equal(completed, 0);
  assert.equal(destroyed, 1);
  assert.equal(roll.element.querySelector('[data-swr-item]'), original);
  assert.equal(roll.element.firstElementChild.tagName, 'P');
  assert.equal(roll.element.hasAttribute('tabindex'), false);
  assert.equal(roll.element.hasAttribute('data-swr-initialized'), false);
  button.click(); assert.equal(clicks, 1);
  assert.equal(roll.getTotalItems(), 0);
  assert.equal(roll.isPlaying(), false);
});
test('item events observe consistent state and can destroy safely', () => {
  const roll = create();
  roll.on('itemAdded', () => {
    assert.equal(roll.getTotalItems(), roll.roll.itemElements.length);
    roll.destroy();
  });
  assert.doesNotThrow(() => roll.addItem({ type: 'html', content: 'D' }, 0));
});
test('explicit pause cancels temporary resume and zero delay is honored', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const handler = new AutoplayHandler(new EventManager(), ConfigParser.parse(), () => {});
  handler.play(); handler.pauseTemporarily(); handler.pause();
  t.mock.timers.tick(10000);
  assert.equal(handler.isAutoplayActive(), false);
  assert.equal(handler.wantsPlayback, false);
  handler.play(); handler.pauseTemporarily(0);
  t.mock.timers.tick(0);
  assert.equal(handler.isAutoplayActive(), true);
  handler.destroy();
});
test('space toggles explicit intent and nonlooping autoplay stops at last slide', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const roll = create({ autoplay: true, loop: false, autoplayInterval: 1000, transitionDuration: 20 });
  roll.element.focus();
  roll.element.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
  assert.equal(roll.autoplayHandler.wantsPlayback, false);
  t.mock.timers.tick(4000);
  assert.equal(roll.getCurrentIndex(), 0);
  roll.play();
  t.mock.timers.tick(1000); t.mock.timers.tick(20);
  t.mock.timers.tick(1000); t.mock.timers.tick(20);
  assert.equal(roll.getCurrentIndex(), 2);
  assert.equal(roll.isPlaying(), false);
});
test('wheel navigates, ignores zoom/horizontal movement and detaches', () => {
  const roll = create({ transitionDuration: 0 });
  const viewport = roll.roll.viewport;
  const event = options => new window.WheelEvent('wheel', { bubbles: true, cancelable: true, ...options });
  viewport.dispatchEvent(event({ deltaY: 100, ctrlKey: true }));
  viewport.dispatchEvent(event({ deltaX: 100 }));
  assert.equal(roll.getCurrentIndex(), 0);
  viewport.dispatchEvent(event({ deltaY: 100 }));
  assert.equal(roll.getCurrentIndex(), 1);
  roll.destroy();
  const after = event({ deltaY: 100 });
  viewport.dispatchEvent(after);
  assert.equal(after.defaultPrevented, false);
});
test('keyboard focus beats hover and editable content retains keys', () => {
  const first = create({ transitionDuration: 0 });
  const second = create({ transitionDuration: 0 });
  first.element.dispatchEvent(new window.MouseEvent('mouseenter'));
  second.element.focus();
  second.element.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  assert.equal(first.getCurrentIndex(), 0);
  assert.equal(second.getCurrentIndex(), 1);
  const input = document.createElement('input');
  second.roll.itemElements[1].append(input); input.focus();
  const key = new window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
  input.dispatchEvent(key);
  assert.equal(key.defaultPrevented, false);
  assert.equal(second.autoplayHandler.wantsPlayback, false);
});
test('inactive slides are inert and focused controls move to the roll', () => {
  const roll = create({ transitionDuration: 0 }, '<div data-swr-item><button>Action</button></div><div data-swr-item>Second</div>');
  roll.roll.itemElements[0].querySelector('button').focus();
  roll.next();
  assert.equal(document.activeElement, roll.element);
  assert.equal(roll.roll.itemElements[0].hasAttribute('inert'), true);
  assert.equal(roll.roll.itemElements[1].getAttribute('aria-hidden'), 'false');
  assert.equal(roll.liveRegion.textContent, 'Slide 2 of 2');
});
test('video autoplay is active-only, rejects safely and pauses on destruction', async () => {
  const roll = create({ transitionDuration: 0, items: [
    { type: 'video', src: 'a.mp4', autoplay: true, muted: true },
    { type: 'video', src: 'b.mp4', autoplay: true, muted: true },
  ] });
  const first = roll.roll.itemElements[0].querySelector('video');
  const second = roll.roll.itemElements[1].querySelector('video');
  assert(mediaCalls.some(([action, video]) => action === 'play' && video === first));
  assert(!mediaCalls.some(([action, video]) => action === 'play' && video === second));
  assert.equal(first.muted, true);
  let error;
  second.play = () => Promise.reject(new Error('blocked'));
  roll.on('mediaPlaybackError', data => { error = data; });
  roll.next(); await Promise.resolve(); await Promise.resolve();
  assert.equal(error.index, 1);
  assert(mediaCalls.some(([action, video]) => action === 'pause' && video === first));
  roll.destroy();
  assert(mediaCalls.some(([action, video]) => action === 'pause' && video === second));
});

test('empty and single-slide rolls do not autoplay or emit transitions', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  for (const list of [[], items.slice(0, 1)]) {
    const roll = create({ items: list, autoplay: true, loop: true });
    let events = 0;
    roll.on('navigationChanged', () => events++);
    roll.on('slideStarted', () => events++);
    roll.next(); roll.prev(); roll.goTo(50); roll.play();
    t.mock.timers.tick(20000);
    assert.equal(roll.isPlaying(), false);
    assert.equal(roll.getCurrentIndex(), 0);
    assert.equal(events, 0);
  }
});
test('visibility resumption respects explicit pause and cancels resume timers', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const roll = create({ autoplay: true });
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(roll.isPlaying(), false);
  assert.equal(roll.autoplayHandler.wantsPlayback, true);
  roll.autoplayHandler.pauseTemporarily();
  roll.pause();
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  document.dispatchEvent(new window.Event('visibilitychange'));
  t.mock.timers.tick(5000);
  assert.equal(roll.isPlaying(), false);
  assert.equal(roll.getCurrentIndex(), 0);
});
test('destruction in focus and render callbacks cannot continue a mutation', () => {
  const focused = create({ transitionDuration: 0 }, '<div data-swr-item><button>Action</button></div><div data-swr-item>Second</div>');
  focused.roll.itemElements[0].querySelector('button').focus();
  focused.element.addEventListener('focus', () => focused.destroy());
  assert.doesNotThrow(() => focused.next());
  assert.equal(focused.isDestroyed, true);
  const rendering = create();
  rendering.on('beforeRender', () => rendering.destroy());
  assert.doesNotThrow(() => rendering.addItem({ type: 'html', content: 'Added' }));
  assert.equal(rendering.getTotalItems(), 0);
  assert.equal(rendering.element.children.length, 0);
});
test('nested rolls own only their slides and their input', () => {
  const outer = create({ transitionDuration: 0 }, '<div data-swr-item><div id="nested" data-swr data-swr-transition="0"><div data-swr-item>Inner A</div><div data-swr-item>Inner B</div></div></div><div data-swr-item>Outer B</div>');
  const inner = new SWR('#nested'); instances.push(inner);
  assert.equal(outer.getTotalItems(), 2);
  assert.equal(inner.getTotalItems(), 2);
  inner.roll.viewport.dispatchEvent(new window.WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }));
  assert.equal(inner.getCurrentIndex(), 1);
  assert.equal(outer.getCurrentIndex(), 0);
});
test('repeated dynamic removal releases references and hidden play is stopped', () => {
  const roll = create({ items: [] });
  for (let index = 0; index < 20; index++) {
    roll.addItem({ type: 'video', src: 'a.mp4', autoplay: true });
    roll.removeItem(0);
  }
  assert.equal(roll.videoAutoplay.size, 0);
  assert.equal(roll.slideAttributes.size, 0);
  roll.addItem({ type: 'video', src: 'a.mp4', autoplay: true });
  roll.addItem({ type: 'video', src: 'b.mp4', autoplay: true });
  const hidden = roll.roll.itemElements[1].querySelector('video');
  mediaCalls = [];
  hidden.dispatchEvent(new window.Event('play'));
  assert(mediaCalls.some(([action, video]) => action === 'pause' && video === hidden));
});
test('touch-derived compatibility click toggles playback only once', () => {
  const roll = create();
  roll.eventManager.emit('tapDetected', { pointerType: 'touch', x: 0, y: 0 });
  assert.equal(roll.isPlaying(), true);
  roll.roll.viewport.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(roll.isPlaying(), true);
});

test('initialization and destruction preserve original focus and keyboard-disabled fallback', () => {
  const element = document.createElement('div');
  element.innerHTML = '<div data-swr-item><button>Original</button></div><div data-swr-item><button>Second</button></div>';
  document.body.append(element);
  const button = element.querySelector('button'); button.focus();
  const roll = new SWR(element, { enableKeyboard: false, transitionDuration: 0 }); instances.push(roll);
  assert.equal(document.activeElement, button);
  roll.destroy();
  assert.equal(document.activeElement, button);
  const next = new SWR(element, { enableKeyboard: false, transitionDuration: 0 }); instances.push(next);
  next.next();
  assert.equal(document.activeElement, element);
  assert.equal(element.getAttribute('tabindex'), '-1');
});
