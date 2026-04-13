# Selena Research

## Core Product Constraint

Selena should not try to silently start local screen recording in a normal browser session.

The practical product implication is simple:

- `Human mode` uses local browser capture.
- `Agent mode` runs in infrastructure Selena owns.

## Fastest Viable MVP

### Lane 1: Human-led recording

- Browser UI with a clear `Start recording` action
- Browser capture and local recording
- Upload finished video directly to cloud storage and playback

### Lane 2: AI-led recording

- Restrict the first agent version to browser-based walkthroughs
- Run the workflow inside a remote browser
- Record and export the remote session
- Upload the finished asset into the same video pipeline as human recordings

### Lane 3: Desktop expansion

- Add remote desktop infrastructure for PowerPoint, desktop apps, and non-browser demos
- Use an explicit export and encoding lane instead of relying on vendor dashboards

## Vendor Direction

### Cloudflare

- Best fit for the Worker API and launch deployment
- Strong fit for video upload and delivery

### Browser automation

- Browserbase is a strong first option when Selena only needs browser-based automation and operator visibility
- Scrapybara is a stronger candidate once Selena needs broader computer-use surfaces beyond the browser

## Recommendation

Ship Selena in this order:

1. Human browser recorder
2. Selena-run browser demos
3. Selena-run desktop demos

That sequence gets the product online fastest while respecting the real browser security constraints.
