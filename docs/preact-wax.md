# Preact + WAX Integration Plan

## Goals
1. Enable interactive UI "islands" while keeping server-rendered WAX pages lean.
2. Avoid adding a heavy bundler; rely on ES modules + CDN for rapid prototyping.
3. Provide a repeatable pattern contributors can extend for additional islands.

## Architecture
- **Server render**: Components such as `InteractiveCounter` emit semantic HTML plus `data-island`/`data-props`. WAX still handles the initial markup so pages work without JavaScript.
- **Hydration client**: `/static/js/preact-islands.js` scans for `[data-island]`, dynamically imports the matching module from `/static/js/islands/*`, and calls its `mount(root, props)` hook.
- **Preact island modules**: Each module imports `preact`, `preact/hooks`, and `htm` from `esm.sh`, exports a `mount` function, and renders into the provided root with `render()`. This keeps client bundles tiny and cacheable.

## Development Flow
1. Author or update a server component (e.g., `src/components/InteractiveCounter.tsx`) and include it inside a page. Populate `data-props` with serialized initial state.
2. Create a matching island module in `public/js/islands/<component>.js` that exports `mount`. Register it in `public/js/preact-islands.js`.
3. Run `npm run dev` and optionally `npm run dev:css`. Since the islands live under `public`, no extra build step is required.

## Future Extensions
- Swap CDN modules for a local Vite build that bundles Preact, enabling TypeScript and JSX on the client side without `htm`.
- Allow island registry discovery via a manifest generated at startup so new islands do not require manual registration.
- Support streaming props from Go handlers (e.g., signed JSON blobs) for secure hydration data.

This doc reflects the initial landing of the Preact + WAX experiment (InteractiveCounter island). Use it as the jumping-off point for richer interactivity.
