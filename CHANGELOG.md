# Changelog

## 1.1.0

- Keep navigation state and rendered slides aligned during rapid input, looping, insertion, and removal.
- Resolve data attributes and JavaScript configuration once; reject nonfinite values and invalid items.
- Preserve consumer DOM nodes and listeners, restore original markup on destroy, and cancel all pending transitions.
- Fix wheel navigation, native control interaction, keyboard routing, touch cancellation, and autoplay resumption.
- Add slide labels, inactive-slide inertness, manual navigation announcements, and reduced motion transitions.
- Manage active-slide video playback, hidden-page/roll suspension, and playback rejection events.
- Add native ESM, matching module declarations, shared instance lookup, and explicit markup initialization.
- Produce all CDN and npm assets from one clean build; minify CSS and verify publish contents.
- Add unit, TypeScript, package, and desktop/mobile browser checks with CI.
- Require Node 22.15+ and npm 10+ for development. Replace webpack-dev-server with a dependency-free local preview and webpack watch because its current dependency tree contains an unpatched high severity advisory.

### Integration notes

Existing UMD/CommonJS constructor exports and distribution filenames are retained. ESM imports require explicit construction or `SWR.initAll()` and never auto-initialize markup. `initialized` now fires in a microtask. Duplicate construction returns the existing instance; destroy it before changing its configuration.

The default aspect ratio remains fixed at 9:16. `play()` and `pause()` control slide autoplay; active-video autoplay follows each video's item configuration. Custom HTML is trusted input and must be sanitized by the integrator when it comes from users or external sources.
