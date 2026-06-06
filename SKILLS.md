---
name: senangwebs-roll
description: Mobile-style vertical media roll (Reels/Shorts-like) for images, videos, and HTML with touch, keyboard, and mouse navigation.
version: 1.0.2
package: senangwebs-roll
---

# SenangWebs Roll (SWR)

## Quick Reference

- **Purpose**: Instagram Reels / YouTube Shorts style vertical media scroller
- **Entry**: `dist/swr.js`, minified `dist/swr.min.js`, types `dist/swr.d.ts`
- **Dependencies**: none
- **Scripts**: `npm run dev`, `npm run build`, `npm run build:dev`, `npm run watch`, `npm run serve`, `npm run clean`

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-roll`. Read `README.md`, `package.json`, and touched source files. Match existing patterns and the CSS prefix `swr-`. Verify video playback and touch behavior on real devices for interaction changes.

## HTML Data Attributes

| Attribute | Values |
|---|---|
| `data-swr` | Roll container flag and auto-initialization hook |
| `data-swr-item` | Marks each child item |
| `data-swr-aspect-ratio` | Aspect ratio such as `"9:16"` |
| `data-swr-loop` | Enable or disable looping |
| `data-swr-autoplay` | Enable or disable autoplay |
| `data-swr-autoplay-interval` | Autoplay interval in milliseconds |
| `data-swr-keyboard` | Enable or disable keyboard navigation |
| `data-swr-touch` | Enable or disable touch navigation |
| `data-swr-wheel` | Enable or disable wheel navigation |
| `data-swr-mouse-drag` | Enable or disable mouse dragging |
| `data-swr-transition` | Transition duration in milliseconds |
| `data-swr-swipe-threshold` | Swipe threshold in pixels |

## JavaScript API

```js
const roll = new SWR(container, {
  aspectRatio,           // e.g., "9:16"
  loop: true,
  autoplay: true,
  autoplayInterval: 3000,
  enableKeyboard: true,
  enableTouch: true,
  enableWheel: true,
  enableMouseDrag: true,
  transitionDuration: 300,
  swipeThreshold: 50
})

roll.next()
roll.prev()
roll.goTo(index)
roll.addItem({ type, src })
roll.removeItem(index)
roll.play()
roll.pause()
roll.on(event, callback)
roll.off(event, callback)
roll.destroy()
```

### Events
`initialized`, `navigationChanged`, `slideStarted`, `slideCompleted`,
`autoplayStart`, `autoplayPause`, `autoplayTick`,
`autoplayPausedTemporarily`, `swipeDetected`, `tapDetected`,
`keyboardEvent`, `wheelDetected`, `dragDetected`, `beforeRender`,
`afterRender`, `itemAdded`, `itemRemoved`, `itemUpdated`,
`itemsCleared`, and `destroy`.

## Focus Areas

- Vertical transform-based scrolling with smooth transitions
- Media types: video, image, and custom HTML
- Touch/swipe: gesture detection using `swipeThreshold`
- Keyboard: up/down arrows and Space for autoplay
- Mouse: drag and wheel support
- Infinite scrolling: seamless wrap-around without DOM duplication issues
- Dynamic item management: keep media, navigation, and rendered DOM state aligned
- Aspect ratio enforcement
- TypeScript declarations: edit `src/swr.d.ts`; webpack copies it to
  `dist/swr.d.ts` during development and production builds

## Implementation Guidance

- Preserve backward compatibility for all methods, event names, and option keys
- Test touch behavior on mobile devices (iOS Safari, Android Chrome)
- Video autoplay policies: handle muted autoplay requirement
- Verify infinite scroll doesn't leak DOM nodes or memory

## Validation

```bash
npm run build
npm run build:dev
npm run serve    # webpack dev server at http://localhost:8080
```

After changing the public API, update `src/swr.d.ts`, run both builds, and
confirm `dist/swr.d.ts` is present in the package output.
