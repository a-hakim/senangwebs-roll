const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixture.html');
  await expect(page.locator('#first')).toHaveAttribute('data-swr-initialized', 'true');
});
test('CDN auto-init, controls, editable keys and links remain usable', async ({ page }) => {
  await page.locator('#action').click();
  expect(await page.evaluate(() => actionCount)).toBe(1);
  await page.locator('#editor').fill('hello');
  await page.locator('#editor').press('Space');
  expect(await page.evaluate(() => SWR.getInstance('#first').autoplayHandler.wantsPlayback)).toBe(false);
  await page.locator('#link').click();
  await expect(page).toHaveURL(/#destination$/);
});
test('focus routes arrows to one roll and inactive slides cannot receive focus', async ({ page }) => {
  await page.locator('#second').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#second').getCurrentIndex())).toBe(1);
  expect(await page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(0);
  await expect(page.locator('#second [data-swr-item]').first()).toHaveAttribute('inert', '');
  await page.locator('#outside').focus();
  await page.keyboard.press('ArrowDown');
  expect(await page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(0);
});
test('rapid calls and both wraps keep state, geometry and DOM aligned', async ({ page }) => {
  await page.evaluate(() => { const roll = SWR.getInstance('#first'); roll.prev(); roll.next(); roll.goTo(1); });
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').roll.isAnimating)).toBe(false);
  expect(await page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(2);
  await page.evaluate(() => SWR.getInstance('#first').next());
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').roll.isAnimating)).toBe(false);
  const geometry = await page.evaluate(() => {
    const roll = SWR.getInstance('#first');
    return { index: roll.getCurrentIndex(), delta: Math.abs(roll.roll.viewport.getBoundingClientRect().top - roll.roll.itemElements[0].getBoundingClientRect().top) };
  });
  expect(geometry.index).toBe(0); expect(geometry.delta).toBeLessThan(1);
  await page.evaluate(() => {
    const roll = SWR.getInstance('#first');
    roll.addItem({ type: 'html', content: '<div class="surface">Inserted</div>' }, 0);
    roll.removeItem(1);
  });
  expect(await page.evaluate(() => { const r = SWR.getInstance('#first'); return r.getTotalItems() === r.roll.itemElements.length; })).toBe(true);
});
test('wheel and mouse dragging navigate on the roll surface', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop mouse and wheel project');
  await page.locator('#first').hover({ position: { x: 20, y: 30 } });
  await page.mouse.wheel(0, 100);
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(1);
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').roll.isAnimating)).toBe(false);
  const box = await page.locator('#first').boundingBox();
  await page.mouse.move(box.x + 20, box.y + 260);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + 60, { steps: 5 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(2);
});
test('reduced motion settles immediately and destruction permits reinitialization', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  await page.evaluate(async () => {
    const roll = SWR.getInstance('#first'); roll.next(); await Promise.resolve();
    window.motionComplete = !roll.roll.isAnimating;
    roll.destroy(); window.reinitialized = new SWR('#first');
  });
  expect(await page.evaluate(() => motionComplete)).toBe(true);
  await expect(page.locator('#action')).toBeVisible();
  await page.locator('#action').click();
  expect(await page.evaluate(() => actionCount)).toBe(1);
});
test('ESM import is explicit and shares instance ownership with CDN', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const globals = Object.keys(window);
    const { default: ESM } = await import('/dist/swr.mjs');
    const root = document.createElement('div'); root.setAttribute('data-swr', '');
    root.innerHTML = '<div data-swr-item>Explicit</div>'; document.body.append(root);
    const untouched = !root.hasAttribute('data-swr-initialized');
    const same = new ESM('#first') === SWR.getInstance('#first');
    ESM.initAll(root);
    const initialized = !!ESM.getInstance(root);
    ESM.getInstance(root).destroy();
    return { untouched, same, initialized, globalsUnchanged: Object.keys(window).every(key => globals.includes(key)) };
  });
  expect(result).toEqual({ untouched: true, same: true, initialized: true, globalsUnchanged: true });
});
test('touch swipe and cancellation do not consume control taps', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch emulation project');
  await page.locator('#action').tap();
  expect(await page.evaluate(() => actionCount)).toBe(1);
  await page.evaluate(() => {
    const surface = document.querySelector('#first .surface');
    const touch = y => ({ identifier: 1, target: surface, clientX: 100, clientY: y });
    const dispatch = (type, touches, changedTouches = []) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { touches: { value: touches }, changedTouches: { value: changedTouches } });
      surface.dispatchEvent(event);
    };
    dispatch('touchstart', [touch(200)]); dispatch('touchcancel', []); dispatch('touchend', [], [touch(50)]);
  });
  expect(await page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(0);
  await page.evaluate(() => {
    const surface = document.querySelector('#first .surface');
    const touch = y => ({ identifier: 2, target: surface, clientX: 100, clientY: y });
    const dispatch = (type, touches, changedTouches = []) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { touches: { value: touches }, changedTouches: { value: changedTouches } });
      surface.dispatchEvent(event);
    };
    dispatch('touchstart', [touch(200)]); dispatch('touchmove', [touch(50)]); dispatch('touchend', [], [touch(50)]);
  });
  await expect.poll(() => page.evaluate(() => SWR.getInstance('#first').getCurrentIndex())).toBe(1);
});
test('media rejection is handled and offscreen rolls suspend playback', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const root = document.createElement('div'); root.className = 'roll'; document.body.append(root);
    const play = HTMLMediaElement.prototype.play;
    const pause = HTMLMediaElement.prototype.pause;
    let played = 0, paused = 0, errors = 0;
    HTMLMediaElement.prototype.play = function () { played++; return Promise.reject(new Error('Denied')); };
    HTMLMediaElement.prototype.pause = function () { paused++; };
    const roll = new SWR(root, { items: [
      { type: 'video', src: 'missing.mp4', autoplay: true, muted: true },
      { type: 'video', src: 'missing2.mp4', autoplay: true, muted: true },
    ] });
    roll.on('mediaPlaybackError', () => errors++);
    await Promise.resolve(); await Promise.resolve();
    root.style.position = 'absolute'; root.style.top = '3000px';
    const suspended = await new Promise(resolve => {
      const started = Date.now();
      const check = () => {
        if (roll.autoplayHandler.suspensions.has('visibility')) resolve(true);
        else if (Date.now() - started > 4000) resolve(false);
        else setTimeout(check, 50);
      };
      check();
    });
    roll.destroy();
    HTMLMediaElement.prototype.play = play;
    HTMLMediaElement.prototype.pause = pause;
    return { played, paused, errors, suspended };
  });
  expect(result.played).toBeGreaterThan(0);
  expect(result.paused).toBeGreaterThan(0);
  expect(result.errors).toBeGreaterThan(0);
  expect(result.suspended).toBe(true);
});
