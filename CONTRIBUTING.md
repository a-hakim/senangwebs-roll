# Contributing

Use Node 22.15 or newer and npm 10 or newer. Install the locked development dependencies with `npm ci`.

`npm run dev` (or `npm run serve`) builds all assets, watches the source, and serves the examples at http://127.0.0.1:8080. Refresh the browser after changes. Set `SWR_PORT` to choose another port. The preview binds to loopback and does not open a browser window.

## Validation

Follow the applicable AGENTS.md instructions and obtain permission before running unit tests unless the current task already authorizes them.

- `npm run build:dev` validates the development output.
- `npm run build` cleans distribution output and produces every release asset.
- `npm run test:unit` checks state, configuration, timers, DOM lifecycle, and media handling.
- `npm run test:types` checks CommonJS and ESM TypeScript consumers.
- `npm run test:bundler` checks module imports, CSS retention, and bundle loading in a server environment.
- `npm run verify:package` checks the publish manifest, source maps, declarations, minification, and server-side imports.
- `npx playwright install`, then `npm run test:browser`, checks Chromium, Firefox, WebKit, and mobile Chromium/WebKit emulation.
- `npm audit --audit-level=high` is a release gate for the whole development dependency tree.

CI runs the authorized regression suite on Node 22 and 24. On restricted Windows environments, Firefox may require process permissions to open a page; use an authorized environment rather than changing the tests or skipping the engine.

## Physical-device release checks

Browser emulation cannot establish physical-device behavior. Before publishing, verify the examples on iOS Safari and Android Chrome:

- Swipe both directions, cancel a gesture, use pinch zoom, and interact with links, forms, and native video controls.
- Check muted inline video autoplay, playback rejection, and hidden video pausing.
- Background and restore the browser; scroll a roll out of view and back; confirm an explicit autoplay pause stays paused.
- Repeatedly initialize, insert/remove slides, loop, and destroy. Check for detached DOM growth, continuing playback, or delayed callbacks.

Record device/OS/browser versions and results in release notes. The 1.1.0 files in this repository are a release candidate, not evidence of a published npm release.

## Publishing

Review the changelog and physical-device results first. `npm pack` and publishing run a clean build and package verification automatically. Publishing requires a separate explicit instruction.
