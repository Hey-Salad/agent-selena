# Selena Chrome Extension

This is the unpacked Chrome extension MVP for Selena.

## What It Does

- Adds a floating Selena recorder panel to web pages
- Records the selected screen, window, or tab
- Optionally includes microphone audio
- Optionally includes a camera bubble in the recording
- Gives you floating start and stop controls
- Downloads the finished video locally

## Current MVP Limits

- Recording is page-scoped for now
- If the page fully navigates away, the recorder UI will reset
- Desktop-wide always-on-top controls are not implemented yet
- Cloud upload is not wired into the extension yet

## Build

```bash
pnpm build:extension
```

## Load In Chrome

1. Open `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select `/Users/chilumbam/heysalad-selena/extension`

Then click the Selena extension icon on any normal web page to open the floating recorder.
