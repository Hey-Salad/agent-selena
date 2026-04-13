# CLAUDE.md

## Repository Intent

This repository is the open-source home for Selena, the HeySalad screen recording agent.

The codebase should stay focused on one narrow product truth:

- `Human mode` records local browser-selected screens
- `Agent mode` records remote browser or desktop sessions

Do not blur those two modes into one implementation unless the platform constraints clearly allow it.

## Stack

- TypeScript
- Cloudflare Workers
- Static assets served from `public/`
- Vitest for tests

## Commands

```bash
pnpm dev
pnpm typecheck
pnpm test
pnpm deploy
```

## Engineering Rules

- Keep the API-first shape intact
- Add tests with behavior changes
- Update `docs/openapi.yaml` when endpoints change
- Update `docs/mvp-architecture.md` when the system design changes
- Do not commit secrets or vendor tokens
- Prefer narrow, shipping-focused scope over speculative infrastructure

## Product Constraints

- Local browser recording needs explicit user action
- AI-triggered recording should use remote browser or desktop infrastructure
- Browser automation ships before desktop automation

## Files To Check First

- `src/index.ts`
- `public/index.html`
- `docs/research.md`
- `docs/mvp-architecture.md`
- `docs/openapi.yaml`
