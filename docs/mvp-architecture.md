# Selena MVP Architecture

## Goal

Get Selena online fast without building the hardest part first.

## Architecture

### Frontend

- Static landing and control surface on Cloudflare
- Recorder UI for human capture
- Job creation UI for Selena-run recordings

### API Layer

- Cloudflare Worker for orchestration
- Endpoint to create recording jobs
- Endpoint to expose launch plan and recording modes

### Human Recording Flow

1. User clicks record
2. Browser prompts for the screen, tab, or window
3. Recording is captured in the browser
4. Finished asset uploads to video storage
5. Playback link is generated

### Selena Recording Flow

1. User or another agent creates a job
2. Selena launches a remote browser session
3. Selena runs the scripted walkthrough
4. Session recording is exported
5. Video is uploaded and published

### Desktop Expansion

Add a remote desktop lane only after the browser-based flows are stable.

## First Build Targets

- Production landing page
- Human recording UI
- Job intake API
- Recording metadata storage
- Upload pipeline

## Do Not Build First

- Silent local AI screen capture
- Full desktop automation before browser automation
- Complex editing features before capture and publishing work
