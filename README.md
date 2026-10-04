# SenangWebs Roll (SWR)

A lightweight, responsive roll library for creating mobile-like media rolls similar to Instagram Reels or YouTube Shorts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

![SenangWebs Roll Preview](https://raw.githubusercontent.com/a-hakim/senangwebs-roll/master/swr_preview.png)

## Features

- **Multiple Media Types**: Support for images, videos, and custom HTML content
- **Two Initialization Methods**: HTML data attributes or JavaScript API
- **Touch & Keyboard Navigation**: Swipe gestures and arrow key support
- **Seamless Infinite Scrolling**: Natural wrap-around animation when looping (like Instagram Reels)
- **Smart Autoplay**: Automatically enables looping for continuous playback
- **Mouse Drag & Wheel Support**: Full desktop navigation with mouse drag and wheel scrolling
- **Customizable**: Flexible configuration for aspect ratios, autoplay, looping, and more
- **Lightweight & Responsive**: Optimized for both mobile and desktop devices
- **No Dependencies**: Pure vanilla JavaScript, no external libraries required
- **Event System**: Custom events for complete control over roll behavior
- **Accessibility**: Labeled slides, inactive-slide inertness, keyboard navigation, and reduced motion support

## Quick Start

### Installation

Install from npm:

```bash
npm install senangwebs-roll
```

The package includes TypeScript declarations for its configuration, item types, and public methods.

For CommonJS, the existing constructor export remains available: `const SWR = require('senangwebs-roll')`.

Or include the compiled CSS and JS files directly in your HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.css">
<script src="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.js"></script>
```

For a TypeScript or bundled JavaScript project:

```typescript
import SWR from 'senangwebs-roll';
import 'senangwebs-roll/dist/swr.css';

const roll = new SWR('#myRoll', {
    loop: true,
    items: [
        { type: 'image', src: 'image.jpg', alt: 'Demo image' }
    ]
});
```

### Method 1: JavaScript API (Recommended)

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.css">

<div id="myRoll"></div>

<script src="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.js"></script>
<script>
const roll = new SWR('#myRoll', {
    aspectRatio: '9:16',
    loop: true,
    autoplay: true,
    autoplayInterval: 5000,
    items: [
        {
            type: 'video',
            src: 'video.mp4',
            muted: true,
            playsinline: true
        },
        {
            type: 'image',
            src: 'image.jpg',
            alt: 'Demo Image'
        },
        {
            type: 'html',
            content: '<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;"><h1>Custom Slide</h1></div>'
        }
    ]
});
</script>
```

### Method 2: HTML Data Attributes

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.css">
<!-- Automatically initializes on page load - no JavaScript required! -->
<div data-swr 
     data-swr-aspect-ratio="9:16" 
     data-swr-loop="true"
     data-swr-autoplay="true"
     data-swr-autoplay-interval="5000">
    <div data-swr-item>
        <video autoplay muted playsinline loop>
            <source src="video.mp4" type="video/mp4">
        </video>
    </div>
    <div data-swr-item>
        <img src="image.jpg" alt="Image">
    </div>
    <div data-swr-item>
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1>Custom Content</h1>
        </div>
    </div>
</div>
<script src="https://unpkg.com/senangwebs-roll@1.1.0/dist/swr.min.js"></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aspectRatio` | string | `'9:16'` | Aspect ratio of the roll (e.g., '9:16', '16:9', '1:1') |
| `loop` | boolean | `false` | Enable infinite looping through items (auto-enabled when `autoplay` is true) |
| `autoplay` | boolean | `false` | Start autoplay automatically on load (automatically enables `loop` if not explicitly set) |
| `autoplayInterval` | number | `5000` | Time between autoplay slides (milliseconds) |
| `enableKeyboard` | boolean | `true` | Enable arrow key navigation |
| `enableTouch` | boolean | `true` | Enable swipe gesture navigation |
| `enableWheel` | boolean | `true` | Enable mouse wheel navigation |
| `enableMouseDrag` | boolean | `true` | Enable mouse drag navigation |
| `enableAutoplayPauseOnInteraction` | boolean | `true` | Pause autoplay on user interaction |
| `autoplayResumeDelay` | number | `3000` | Delay before resuming autoplay (milliseconds) |
| `transitionDuration` | number | `350` | Animation duration for slides (milliseconds) |
| `swipeThreshold` | number | `50` | Minimum swipe distance to trigger navigation (pixels) |

### Data Attribute Configuration

Use HTML data attributes for configuration:

```html
<div data-swr
  data-swr-aspect-ratio="9:16"
  data-swr-loop="true"
  data-swr-autoplay="true"
  data-swr-autoplay-interval="4000"
  data-swr-autoplay-pause-on-interaction="true"
  data-swr-autoplay-resume-delay="3000"
  data-swr-keyboard="true"
  data-swr-touch="true"
  data-swr-transition="300"
  data-swr-swipe-threshold="40">
```

## API Reference

### Methods

#### Navigation

- **`next()`** - Navigate to next item
- **`prev()`** - Navigate to previous item
- **`goTo(index)`** - Jump to specific item index

#### Item Management

- **`addItem(item, index)`** - Add new item to the roll (optionally at specific index)
- **`removeItem(index)`** - Remove item at index
- **`getCurrentIndex()`** - Get current active item index
- **`getTotalItems()`** - Get total number of items

#### Playback Control

- **`play()`** - Start autoplay
- **`pause()`** - Pause autoplay
- **`isPlaying()`** - Check if autoplay is active

#### Event System

- **`on(event, callback)`** - Subscribe to event
- **`off(event, callback)`** - Unsubscribe from event
- **`getConfig()`** - Get current configuration

#### Lifecycle

- **`destroy()`** - Cancel pending work, pause managed videos, remove handlers, and restore the original DOM nodes and owned attributes
- **`SWR.getInstance(selector)`** - Get an existing instance or `null`
- **`SWR.initAll(root?)`** - Initialize `[data-swr]` elements in a document or subtree and return their instances

### Events

- **`initialized`** - Emitted in a microtask after initialization; subscribe immediately after construction
- **`navigationChanged`** - Emitted when active item changes
- **`slideStarted`** - Emitted when slide animation starts
- **`slideCompleted`** - Emitted when slide animation completes
- **`autoplayStart`** - Emitted when autoplay starts
- **`autoplayPause`** - Emitted when autoplay pauses
- **`autoplayTick`** - Emitted on each autoplay interval tick
- **`autoplayPausedTemporarily`** - Emitted when autoplay pauses temporarily
- **`swipeDetected`** - Emitted when swipe is detected
- **`tapDetected`** - Emitted when tap is detected (toggles autoplay)
- **`keyboardEvent`** - Emitted on keyboard interaction
- **`wheelDetected`** - Emitted when mouse wheel is used
- **`dragDetected`** - Emitted when mouse drag is detected
- **`beforeRender`** - Emitted before item renders
- **`afterRender`** - Emitted after item renders
- **`itemAdded`** - Emitted when item is added
- **`itemRemoved`** - Emitted when item is removed
- **`itemUpdated`** - Emitted when item is updated
- **`itemsCleared`** - Emitted when all items are cleared
- **`mediaPlaybackError`** - Emitted with `{ index, error }` when active-video autoplay is rejected
- **`destroy`** - Emitted once after cleanup, before subscriptions are cleared

### Item Object Structure

#### Video Item
```javascript
{
    type: 'video',
    src: 'path/to/video.mp4',
    mimeType: 'video/mp4',
    autoplay: true,
    muted: true,
    playsinline: true,
    loop: false
}
```

#### Image Item
```javascript
{
    type: 'image',
    src: 'path/to/image.jpg',
    alt: 'Image description',
    title: 'Image title'
}
```

#### HTML Item
```javascript
{
    type: 'html',
    content: '<div>HTML content</div>'
}
```

## Initialization and Lifecycle

The UMD/CDN build initializes `[data-swr]` markup on DOM ready. Native ESM imports have no automatic DOM initialization or global assignments; call `new SWR(...)` or `SWR.initAll(document)` explicitly. Imports are safe during server rendering, but constructing an instance requires a browser DOM.

```javascript
import SWR from 'senangwebs-roll';
import 'senangwebs-roll/dist/swr.css';

const instances = SWR.initAll(document);
const roll = SWR.getInstance('#myRoll');
```

Configuration precedence is defaults → JavaScript options → data attributes. Existing DOM slides take precedence over configured `items`. Duplicate construction returns the existing instance and does not apply new options. Destroy the instance before reconfiguring it. Newly inserted markup is initialized by another explicit `SWR.initAll(subtree)` call.

Navigation during an active transition is ignored before state changes. Item insertion/removal settles the transition, updates actual DOM nodes, and preserves the active item when possible. Removing the active item selects the next item, or the previous item at the end. Invalid navigation/removal indices do nothing; invalid insertion positions append. Empty and single-slide rolls do not run slide autoplay.

## Video Playback and Trusted HTML

Slide autoplay (`play()`/`pause()`) is separate from each video item's `autoplay` option. SWR plays a video automatically only when its slide is active and that video requests autoplay. It pauses hidden videos and suspends automatic playback when the document or roll is hidden. A rejected `video.play()` emits `mediaPlaybackError`; it never becomes an unhandled promise rejection. Use muted inline video for mobile autoplay, and keep native controls available when playback may require user interaction.

Custom HTML `content` is inserted as trusted markup. **SWR does not sanitize HTML.** Sanitize user-generated or external content before passing it to SWR. DOM slides retain their original nodes and application listeners.

Gesture starts on links, forms, editable content, native media controls, or `[data-swr-ignore]` are reserved for those controls. Set a video item's `controls: false` when its entire video surface should accept roll gestures. Pinch zoom is permitted. Touch-derived clicks are deduplicated. Keyboard shortcuts target the focused roll, with hover fallback outside another roll; editable/control targets retain their keys.

## Seamless Infinite Scrolling

SWR features intelligent wrap-around animation that creates a natural, continuous scrolling experience similar to Instagram Reels:

- **Natural Direction**: When swiping up on the last item, it smoothly continues upward to the first item (not jarring downward jump)
- **Intuitive Flow**: When swiping down on the first item, it smoothly continues downward to the last item
- **Automatic Loop**: When `autoplay: true` is set, `loop` is automatically enabled for continuous playback
- **Seamless Transitions**: Uses optimized CSS transforms for smooth, GPU-accelerated animations

### How It Works

```javascript
// Autoplay automatically enables loop for seamless continuous playback
const roll = new SWR('#roll', {
    autoplay: true,  // loop is automatically set to true
    autoplayInterval: 3000
});

// Or manually enable loop for seamless infinite scrolling
const roll2 = new SWR('#roll2', {
    loop: true  // Enables seamless wrap-around navigation
});
```

## Examples

### Example 1: Basic Setup with Autoplay

```javascript
const roll = new SWR('#roll', {
    autoplay: true,  // Loop is auto-enabled
    autoplayInterval: 3000
});
```

### Example 2: Manual Loop Control

```javascript
// Disable automatic loop enabling (if you want autoplay to stop at the end)
const roll = new SWR('#roll', {
    autoplay: true,
    loop: false,  // Explicitly set to false to override auto-enabling
    autoplayInterval: 3000
});
```

### Example 3: Event Handling

```javascript
const roll = new SWR('#roll');

// Listen to item changes
roll.on('navigationChanged', (data) => {
    console.log(`Now showing item ${data.newIndex + 1} of ${data.totalItems}`);
});

// Listen to slide completion
roll.on('slideCompleted', (data) => {
    console.log('Slide animation completed');
});

// Control autoplay
roll.on('autoplayStart', () => {
    console.log('Autoplay started');
});

// Listen to user interactions
roll.on('swipeDetected', (data) => {
    console.log('Swipe direction:', data.direction);
});

roll.on('tapDetected', () => {
    console.log('Tap detected - autoplay toggled');
});
```

### Example 4: Dynamic Content Management

```javascript
const roll = new SWR('#roll');

// Add items dynamically
roll.addItem({
    type: 'image',
    src: 'new-image.jpg',
    alt: 'New Image'
});

// Add at specific position
roll.addItem({
    type: 'video',
    src: 'video.mp4',
    muted: true
}, 1);

// Remove items
roll.removeItem(0);

// Navigate programmatically
roll.next();  // Go to next item
roll.prev();  // Go to previous item
roll.goTo(2); // Jump to specific item

// Check current state
console.log(`Total items: ${roll.getTotalItems()}`);
console.log(`Current index: ${roll.getCurrentIndex()}`);
console.log(`Is playing: ${roll.isPlaying()}`);
```

### Example 5: Full-Featured Setup

```javascript
const roll = new SWR('#roll', {
    aspectRatio: '9:16',
    autoplay: true,
    autoplayInterval: 4000,
    transitionDuration: 500,
    enableKeyboard: true,
    enableTouch: true,
    enableWheel: true,
    enableMouseDrag: true,
    enableAutoplayPauseOnInteraction: true,
    autoplayResumeDelay: 2000,
    swipeThreshold: 50,
    items: [
        { type: 'video', src: 'video1.mp4', muted: true },
        { type: 'image', src: 'image1.jpg', alt: 'Image' },
        { type: 'html', content: '<div class="custom-slide">Content</div>' }
    ]
});

// Listen to all events
roll.on('initialized', () => console.log('Ready!'));
roll.on('slideCompleted', (data) => console.log('Slide:', data.index));
roll.on('autoplayStart', () => console.log('Playing'));
roll.on('autoplayPause', () => console.log('Paused'));
```

### Example 6: Custom Styling

```css
/* Set aspectRatio through configuration or data-swr-aspect-ratio. */

/* Customize item styling */
.my-roll [data-swr-item] {
    border-radius: 8px;
}

/* Custom transition */
.my-roll .swr-container {
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1) !important;
}
```

## Navigation Controls

### Keyboard
- **Arrow Down** / **Arrow Right** - Next item
- **Arrow Up** / **Arrow Left** - Previous item
- **Space** - Toggle autoplay

### Touch/Mouse
- **Swipe Up** / **Drag Up** - Next item
- **Swipe Down** / **Drag Down** - Previous item
- **Tap/Click** - Toggle autoplay
- **Mouse Wheel Up** - Previous item
- **Mouse Wheel Down** - Next item

## Responsive Behavior

The roll scales to its container width and keeps a fixed **9:16** aspect ratio by default on both mobile and desktop. Configure `aspectRatio` (for example, `16:9` or `1:1`) to choose another fixed ratio. Automatic breakpoint-based ratio switching is not part of v1.

## Important Behaviors

### Autoplay and Loop
- When `autoplay: true` is set, `loop` is automatically enabled (unless explicitly set to `false`)
- This ensures continuous playback without stopping at the last item
- To disable auto-looping, explicitly set `loop: false` in your configuration

### Seamless Wrap Animation
- When `loop: true`, navigating from the last item to the first (or vice versa) uses a seamless animation
- The animation direction matches the user's gesture for an intuitive experience
- Swipe up on last item → continues upward to first item
- Swipe down on first item → continues downward to last item

### Interaction Pausing
- When `enableAutoplayPauseOnInteraction: true`, user interactions (swipe, tap, keyboard, wheel, drag) temporarily pause autoplay
- Autoplay resumes after `autoplayResumeDelay` milliseconds
- Tap/click on the noninteractive roll surface toggles autoplay on/off
- Explicit `pause()` cancels temporary resumption; nonlooping autoplay stops at the last slide
- Visibility suspension resumes only playback that was requested before suspension

## Accessibility

- Keyboard navigation support (arrow keys)
- Region and slide labels; provide an `aria-label` or `aria-labelledby` on each roll
- Inactive slides use `inert` and `aria-hidden`; focus moves to the roll when its active control disappears
- Manual navigation is announced through a polite live region
- Native links, forms, editable content, and video controls retain input handling
- High contrast styles and immediate transitions under `prefers-reduced-motion`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
