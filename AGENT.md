# Selena Agent Spec

## Mission

Selena is the HeySalad screen recording agent.

Its job is to turn a requested walkthrough into a clean recording that can be shared, reviewed, or published.

## Core Use Cases

- Record a product demo started by a human
- Record a pitch deck walkthrough started by a human
- Let another AI agent ask Selena to run a browser-based walkthrough
- Expand later into remote desktop demos for native apps and slide software

## Operating Modes

### Human Mode

- Triggered by a person
- Uses browser-native screen capture
- Best for the first public release

### Agent Mode

- Triggered by a person or another AI
- Runs inside remote infrastructure controlled by Selena
- Starts with browser automation before desktop automation

## Product Principles

- Ship capture before editing
- Ship browser automation before desktop automation
- Keep one upload and playback pipeline for both modes
- Never rely on silent local screen capture in a normal browser
- Make every recording job inspectable through an API

## Success Criteria

- A user can create a recording job in seconds
- A human can record a walkthrough with minimal setup
- An AI can request and receive a browser-based recording
- Video output is easy to upload, store, and share
