# SenangWebs Roll (SWR)

A lightweight, responsive roll library for creating mobile-like media rolls similar to Instagram Reels or YouTube Shorts.

## Features

- **Multiple Media Types**: Support for images, videos, and custom HTML content
- **Two Initialization Methods**: HTML data attributes or JavaScript API
- **Touch & Keyboard Navigation**: Swipe gestures and arrow key support
- **Customizable**: Flexible configuration for aspect ratios, autoplay, looping, and more
- **Lightweight & Responsive**: Optimized for both mobile and desktop devices
- **No Dependencies**: Pure vanilla JavaScript, no external libraries required
- **Event System**: Custom events for complete control over roll behavior
- **Accessible**: Keyboard navigation and accessibility-friendly markup

## Quick Start

### HTML Data Attributes Method

```html
<div data-swr data-swr-aspect-ratio="9:16" data-swr-loop="true">
    <div data-swr-item>
        <video autoplay muted playsinline>
            <source src="video.mp4" type="video/mp4">
        </video>
    </div>
    <div data-swr-item>
        <img src="image.jpg" alt="Image">
    </div>
    <div data-swr-item>
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <h1>Custom Content</h1>
        </div>
    </div>
</div>

<link rel="stylesheet" href="src/css/swr.css">
<script src="src/js/parsers/ConfigParser.js"></script>
<script src="src/js/parsers/DataAttributeParser.js"></script>
<script src="src/js/core/EventManager.js"></script>
<script src="src/js/core/MediaManager.js"></script>
<script src="src/js/core/Navigation.js"></script>
<script src="src/js/core/Roll.js"></script>
<script src="src/js/handlers/TouchHandler.js"></script>
<script src="src/js/handlers/KeyboardHandler.js"></script>
<script src="src/js/handlers/AutoplayHandler.js"></script>
<script src="src/js/renderers/HTMLRenderer.js"></script>
<script src="src/js/renderers/VideoRenderer.js"></script>
<script src="src/js/renderers/ImageRenderer.js"></script>
<script src="src/js/index.js"></script>
```

### JavaScript API Method

```javascript
const roll = new SWR('#myRoll', {
    aspectRatio: '9:16',
    loop: true,
    autoplay: true,
    autoplayInterval: 5000,
    enableKeyboard: true,
    enableTouch: true,
    items: [
        {
            type: 'video',
            src: 'video.mp4',
            autoplay: true,
            muted: true,
            playsinline: true
        },
        {
            type: 'image',
            src: 'image.jpg',
            alt: 'Demo'
        },
        {
            type: 'html',
            content: '<div style="height: 100%; display: flex; align-items: center; justify-content: center;"><h1>Slide 3</h1></div>'
        }
    ]
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aspectRatio` | string | `'9:16'` | Aspect ratio of the roll (e.g., '9:16', '16:9', '1:1') |
| `loop` | boolean | `false` | Enable infinite looping through items |
| `autoplay` | boolean | `false` | Start autoplay automatically on load |
| `autoplayInterval` | number | `5000` | Time between autoplay slides (milliseconds) |
| `enableKeyboard` | boolean | `true` | Enable arrow key navigation |
| `enableTouch` | boolean | `true` | Enable swipe gesture navigation |
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

- **`destroy()`** - Destroy instance and clean up resources

### Events

- **`initialized`** - Emitted when roll is initialized
- **`navigationChanged`** - Emitted when active item changes
- **`slideStarted`** - Emitted when slide animation starts
- **`slideCompleted`** - Emitted when slide animation completes
- **`autoplayStart`** - Emitted when autoplay starts
- **`autoplayPause`** - Emitted when autoplay pauses
- **`autoplayPausedTemporarily`** - Emitted when autoplay pauses temporarily
- **`swipeDetected`** - Emitted when swipe is detected
- **`keyboardEvent`** - Emitted on keyboard interaction
- **`beforeRender`** - Emitted before item renders
- **`afterRender`** - Emitted after item renders
- **`itemAdded`** - Emitted when item is added
- **`itemRemoved`** - Emitted when item is removed
- **`destroy`** - Emitted when instance is destroyed

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

## Examples

### Example 1: Basic Setup with Autoplay

```javascript
const roll = new SWR('#roll', {
    autoplay: true,
    loop: true,
    autoplayInterval: 3000
});
```

### Example 2: Event Handling

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
```

### Example 3: Dynamic Content Management

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

// Check current state
console.log(`Total items: ${roll.getTotalItems()}`);
console.log(`Current index: ${roll.getCurrentIndex()}`);
```

### Example 4: Custom Styling

```css
/* Override default aspect ratio */
.my-roll .swr-viewport {
    aspect-ratio: 16 / 9;
}

/* Customize item styling */
.my-roll [data-swr-item] {
    border-radius: 8px;
}

/* Custom transition */
.my-roll .swr-container {
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

## Keyboard Controls

- **Arrow Right** - Next item
- **Arrow Left** - Previous item
- **Space** - Toggle autoplay

## Responsive Behavior

The roll automatically adapts to different screen sizes:

- **Mobile** (< 768px) - Aspect ratio 9:16, optimized for portrait viewing
- **Desktop** (≥ 768px) - Aspect ratio 16:9, optimized for landscape viewing

Customize aspect ratios via configuration.

## Accessibility

- Keyboard navigation support (arrow keys)
- Semantic HTML markup
- Focus management
- High contrast support
- Reduced motion support (via `prefers-reduced-motion`)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use in your projects!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
