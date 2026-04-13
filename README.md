# Selena

Selena is the HeySalad screen recording agent for human-led and AI-led walkthroughs.

Use Selena when a person wants to record a pitch deck, app demo, or walkthrough directly, or when another AI agent should run the task and generate the recording for them.

## Why Selena

Most recording tools are built for humans only. Selena is being built around two flows from the start:

- `Human mode`: you click record, choose a screen, window, or tab, and publish the result.
- `Agent mode`: Selena runs the walkthrough in remote infrastructure, records it, and returns a shareable video.

That split is intentional. It is the fastest credible way to ship this product.

## Current Scope

This repository is an open-source starter for Selena with:

- a Cloudflare Worker API
- a HeySalad-branded landing page
- a working local human-mode screen recorder
- an unpacked Chrome extension MVP with floating controls
- a job creation endpoint for recording requests
- MVP architecture and research docs

The actual recording integrations are the next build step.

## Fastest Path Online

1. Ship browser-based human recording first.
2. Add Selena-run browser walkthroughs for web apps and browser decks.
3. Add remote desktop capture after the browser lanes are stable.

## Quick Start

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:8787`.

To record your screen on this Mac, open the page and click `Start recording`.

## Development

```bash
pnpm typecheck
pnpm test
pnpm build:extension
```

## Chrome Extension

Selena also includes an unpacked Chrome extension MVP in `extension/`.

Build it with:

```bash
pnpm build:extension
```

Then open `chrome://extensions`, enable `Developer mode`, choose `Load unpacked`, and select `/Users/chilumbam/heysalad-selena/extension`.

The toolbar click now opens a Selena popup first, then injects the floating recorder into the current supported page.

## API

- `GET /api/health`
- `GET /api/blueprint`
- `GET /api/recording-modes`
- `GET /api/launch-plan`
- `POST /api/jobs`

Example:

```bash
curl -X POST http://localhost:8787/api/jobs \
  -H 'content-type: application/json' \
  -d '{"mode":"ai","surface":"browser","target":"Pitch deck walkthrough"}'
```

## Project Structure

- `src/index.ts`: Worker API and static asset fallback
- `public/index.html`: Selena landing page and API preview
- `docs/research.md`: source-backed product constraints and vendor choices
- `docs/mvp-architecture.md`: recommended MVP architecture
- `docs/openapi.yaml`: starting API contract
- `AGENT.md`: product and agent mission
- `CLAUDE.md`: repo-specific implementation guidance

## Roadmap

- Human browser recorder with upload to video storage
- Selena-run browser sessions for product tours
- Remote desktop recording for decks and native software
- Publishing, sharing, and playback workflows

## Contributing

Issues and pull requests are welcome. Before opening a PR:

1. Run `pnpm typecheck`
2. Run `pnpm test`
3. Update docs when API or architecture changes

## License

Apache-2.0. See `LICENSE`.
