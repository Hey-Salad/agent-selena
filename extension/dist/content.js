"use strict";
const SETTINGS_KEY = "selenaRecorderSettings";
const DEFAULT_SETTINGS = {
    includeTabAudio: true,
    includeMicrophone: true,
    includeCamera: true,
};
const STYLE_TEXT = `
  :host {
    all: initial;
  }

  .selena {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 2147483647;
    width: 340px;
    color: #111111;
    font-family: Figtree, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.4;
  }

  .selena[hidden] {
    display: none;
  }

  .selena__panel {
    background:
      radial-gradient(circle at top right, rgba(237, 76, 76, 0.18), transparent 13rem),
      rgba(255, 248, 245, 0.96);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18);
    border-radius: 26px;
    backdrop-filter: blur(16px);
    overflow: hidden;
  }

  .selena__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px 10px;
    cursor: grab;
    user-select: none;
  }

  .selena__brand {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .selena__eyebrow {
    color: #ed4c4c;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .selena__title {
    margin: 0;
    font-family: Grandstander, "Trebuchet MS", cursive;
    font-size: 22px;
    line-height: 1;
  }

  .selena__close {
    appearance: none;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.07);
    color: #111111;
    font-size: 20px;
    cursor: pointer;
  }

  .selena__body {
    display: grid;
    gap: 14px;
    padding: 0 16px 16px;
  }

  .selena__status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255, 208, 205, 0.82);
    color: #732121;
    font-size: 13px;
  }

  .selena__status::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ed4c4c;
    box-shadow: 0 0 0 5px rgba(237, 76, 76, 0.12);
    flex: none;
  }

  .selena__timer {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.68);
  }

  .selena__options {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .selena__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
  }

  .selena__option-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .selena__option-label {
    font-weight: 700;
  }

  .selena__option-note {
    color: rgba(0, 0, 0, 0.62);
    font-size: 12px;
  }

  .selena__switch {
    position: relative;
    width: 48px;
    height: 30px;
    flex: none;
  }

  .selena__switch input {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  .selena__slider {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.18);
    transition: background 160ms ease;
  }

  .selena__slider::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.14);
    transition: transform 160ms ease;
  }

  .selena__switch input:checked + .selena__slider {
    background: #ed4c4c;
  }

  .selena__switch input:checked + .selena__slider::after {
    transform: translateX(18px);
  }

  .selena__actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .selena__button,
  .selena__download {
    appearance: none;
    border: none;
    border-radius: 999px;
    padding: 12px 16px;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
  }

  .selena__button:hover,
  .selena__download:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
  }

  .selena__button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }

  .selena__button--primary {
    background: #ed4c4c;
    color: #ffffff;
  }

  .selena__button--secondary {
    background: rgba(255, 255, 255, 0.86);
    color: #111111;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .selena__download {
    background: #130807;
    color: #fff2f1;
  }

  .selena__button-row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .selena__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex: none;
  }

  .selena__icon--record::before {
    content: "";
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: currentColor;
  }

  .selena__icon--stop::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: currentColor;
  }

  .selena__compact {
    display: none;
    align-items: center;
    gap: 12px;
    padding: 0 16px 16px;
  }

  .selena__compact-stop {
    width: 52px;
    height: 52px;
    border-radius: 999px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }

  .selena__camera-shell {
    display: none;
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 22px;
    overflow: hidden;
    background:
      radial-gradient(circle at top, rgba(237, 76, 76, 0.24), transparent 5rem),
      #130807;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  .selena__camera-shell[data-visible="true"] {
    display: block;
  }

  .selena__camera {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
  }

  .selena[data-recording="true"] .selena__options,
  .selena[data-recording="true"] .selena__actions,
  .selena[data-recording="true"] .selena__hint {
    display: none;
  }

  .selena[data-recording="true"] .selena__compact {
    display: flex;
  }

  .selena__hint {
    margin: 0;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
`;
function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className)
        element.className = className;
    if (textContent)
        element.textContent = textContent;
    return element;
}
function toErrorMessage(error) {
    if (error instanceof Error && error.message)
        return error.message;
    return "Unknown recording error";
}
function getRecorderMimeType() {
    const candidates = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
    ];
    return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? "";
}
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [minutes, seconds].map((value) => value.toString().padStart(2, "0"));
    return hours > 0 ? [hours.toString().padStart(2, "0"), ...parts].join(":") : parts.join(":");
}
function formatSize(bytes) {
    if (bytes <= 0)
        return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** index;
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
function clipRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}
function readSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(SETTINGS_KEY, (values) => {
            resolve({
                ...DEFAULT_SETTINGS,
                ...(values[SETTINGS_KEY] ?? {}),
            });
        });
    });
}
function writeSettings(settings) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [SETTINGS_KEY]: settings }, () => resolve());
    });
}
class SelenaRecorderOverlay {
    host = createElement("div");
    shadow = this.host.attachShadow({ mode: "open" });
    container = createElement("section", "selena");
    statusLabel = createElement("p", "selena__status", "Ready to record this page.");
    timerLabel = createElement("div", "selena__timer", "00:00");
    startButton = createElement("button", "selena__button selena__button--primary");
    stopButton = createElement("button", "selena__button selena__button--secondary");
    compactStopButton = createElement("button", "selena__button selena__button--primary selena__compact-stop");
    downloadLink = createElement("a", "selena__download", "Download video");
    closeButton = createElement("button", "selena__close", "×");
    hint = createElement("p", "selena__hint", "Pick the tab, window, or screen you want Selena to record. Audio support depends on what Chrome and the selected source allow.");
    tabAudioToggle = this.createToggle("Tab audio", "Include shared audio when Chrome provides it.");
    microphoneToggle = this.createToggle("Microphone", "Mix your microphone into the recording.");
    cameraToggle = this.createToggle("Camera", "Add a camera bubble to the final video.");
    cameraShell = createElement("div", "selena__camera-shell");
    cameraPreview = createElement("video", "selena__camera");
    state = "idle";
    visible = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    isDragging = false;
    downloadUrl = "";
    displayStream = null;
    userStream = null;
    composedStream = null;
    displayVideo = null;
    cameraVideo = null;
    compositorCanvas = null;
    mediaRecorder = null;
    recordedChunks = [];
    animationFrameId = null;
    timerIntervalId = null;
    recordingStartedAt = 0;
    audioContext = null;
    constructor() {
        this.mount();
        void this.loadInitialSettings();
        this.render();
    }
    toggleVisibility() {
        if (this.visible && this.state !== "recording" && this.state !== "stopping") {
            this.visible = false;
            this.render();
            return;
        }
        this.visible = true;
        this.render();
    }
    createToggle(label, note) {
        const wrapper = createElement("label", "selena__option");
        const copy = createElement("span", "selena__option-copy");
        copy.append(createElement("span", "selena__option-label", label), createElement("span", "selena__option-note", note));
        const switchShell = createElement("span", "selena__switch");
        const input = document.createElement("input");
        input.type = "checkbox";
        const slider = createElement("span", "selena__slider");
        switchShell.append(input, slider);
        wrapper.append(copy, switchShell);
        return wrapper;
    }
    async loadInitialSettings() {
        const settings = await readSettings();
        this.getToggleInput(this.tabAudioToggle).checked = settings.includeTabAudio;
        this.getToggleInput(this.microphoneToggle).checked = settings.includeMicrophone;
        this.getToggleInput(this.cameraToggle).checked = settings.includeCamera;
    }
    mount() {
        this.host.id = "selena-recorder-root";
        const style = createElement("style");
        style.textContent = STYLE_TEXT;
        this.container.hidden = true;
        this.downloadLink.hidden = true;
        this.downloadLink.target = "_blank";
        this.downloadLink.rel = "noreferrer";
        this.startButton.append(this.createIcon("record"), document.createTextNode("Start"));
        this.stopButton.append(this.createIcon("stop"), document.createTextNode("Stop"));
        this.compactStopButton.append(this.createIcon("stop"));
        this.stopButton.disabled = true;
        this.compactStopButton.disabled = true;
        this.cameraPreview.autoplay = true;
        this.cameraPreview.playsInline = true;
        this.cameraPreview.muted = true;
        this.cameraShell.append(this.cameraPreview);
        const header = createElement("div", "selena__header");
        header.append(this.createBrand(), this.closeButton);
        const optionGroup = createElement("div", "selena__options");
        optionGroup.append(this.tabAudioToggle, this.microphoneToggle, this.cameraToggle);
        const actions = createElement("div", "selena__actions");
        actions.append(this.startButton, this.stopButton, this.downloadLink);
        const compact = createElement("div", "selena__compact");
        compact.append(this.compactStopButton, this.cameraShell);
        const body = createElement("div", "selena__body");
        body.append(this.statusLabel, this.timerLabel, optionGroup, actions, compact, this.hint);
        const panel = createElement("div", "selena__panel");
        panel.append(header, body);
        this.container.append(panel);
        this.shadow.append(style, this.container);
        document.documentElement.append(this.host);
        header.addEventListener("pointerdown", (event) => this.startDragging(event));
        window.addEventListener("pointermove", (event) => this.drag(event));
        window.addEventListener("pointerup", () => this.stopDragging());
        this.closeButton.addEventListener("click", () => this.handleClose());
        this.startButton.addEventListener("click", () => void this.startRecording());
        this.stopButton.addEventListener("click", () => this.stopRecording());
        this.compactStopButton.addEventListener("click", () => this.stopRecording());
        for (const toggle of [this.tabAudioToggle, this.microphoneToggle, this.cameraToggle]) {
            this.getToggleInput(toggle).addEventListener("change", () => void this.persistSettings());
        }
    }
    createBrand() {
        const brand = createElement("div", "selena__brand");
        brand.append(createElement("span", "selena__eyebrow", "HeySalad"), createElement("h2", "selena__title", "Selena"));
        return brand;
    }
    createIcon(kind) {
        return createElement("span", `selena__icon selena__icon--${kind}`);
    }
    getToggleInput(toggle) {
        return toggle.querySelector("input");
    }
    getSettings() {
        return {
            includeTabAudio: this.getToggleInput(this.tabAudioToggle).checked,
            includeMicrophone: this.getToggleInput(this.microphoneToggle).checked,
            includeCamera: this.getToggleInput(this.cameraToggle).checked,
        };
    }
    async persistSettings() {
        await writeSettings(this.getSettings());
    }
    handleClose() {
        if (this.state === "recording" || this.state === "stopping") {
            this.statusLabel.textContent = "Stop the recording before hiding Selena.";
            return;
        }
        this.visible = false;
        this.render();
    }
    startDragging(event) {
        if (!this.visible)
            return;
        const target = event.target;
        if (target?.closest(".selena__close"))
            return;
        const rect = this.container.getBoundingClientRect();
        this.host.style.right = "auto";
        this.host.style.bottom = "auto";
        this.host.style.left = `${rect.left}px`;
        this.host.style.top = `${rect.top}px`;
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;
        this.isDragging = true;
    }
    drag(event) {
        if (!this.isDragging)
            return;
        this.host.style.left = `${event.clientX - this.dragOffsetX}px`;
        this.host.style.top = `${event.clientY - this.dragOffsetY}px`;
    }
    stopDragging() {
        this.isDragging = false;
    }
    render() {
        this.container.hidden = !this.visible;
        this.container.dataset.recording = String(this.state === "recording" || this.state === "stopping");
        this.startButton.disabled = this.state !== "idle";
        const canStop = this.state === "recording";
        this.stopButton.disabled = !canStop;
        this.compactStopButton.disabled = !canStop;
    }
    async startRecording() {
        if (this.state !== "idle")
            return;
        if (!navigator.mediaDevices?.getDisplayMedia) {
            this.statusLabel.textContent = "This page cannot access screen capture APIs.";
            return;
        }
        this.visible = true;
        this.state = "starting";
        this.statusLabel.textContent = "Choose the screen, window, or tab you want Selena to record.";
        this.render();
        try {
            const settings = this.getSettings();
            this.revokeDownloadUrl();
            this.displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 30,
                },
                audio: settings.includeTabAudio,
            });
            this.userStream = await this.getOptionalUserStream(settings);
            this.updateCameraPreview();
            this.composedStream = await this.buildComposedStream(settings);
            this.startMediaRecorder();
            this.startTimer();
            this.attachEndHandlers();
            this.state = "recording";
            this.statusLabel.textContent = "Recording in progress. Use the floating stop button when you are done.";
            this.render();
        }
        catch (error) {
            this.statusLabel.textContent = `Could not start Selena recording: ${toErrorMessage(error)}.`;
            await this.resetRecording();
            this.state = "idle";
            this.render();
        }
    }
    async getOptionalUserStream(settings) {
        if (!settings.includeMicrophone && !settings.includeCamera)
            return null;
        return navigator.mediaDevices.getUserMedia({
            audio: settings.includeMicrophone,
            video: settings.includeCamera,
        });
    }
    updateCameraPreview() {
        const hasCamera = Boolean(this.userStream?.getVideoTracks().length);
        this.cameraShell.dataset.visible = String(hasCamera);
        this.cameraPreview.srcObject = hasCamera ? this.userStream : null;
    }
    async buildComposedStream(settings) {
        const displayVideoTrack = this.displayStream?.getVideoTracks()[0];
        if (!displayVideoTrack || !this.displayStream) {
            throw new Error("No display video track available.");
        }
        this.displayVideo = document.createElement("video");
        this.displayVideo.srcObject = this.displayStream;
        this.displayVideo.muted = true;
        this.displayVideo.playsInline = true;
        await this.displayVideo.play();
        this.cameraVideo = document.createElement("video");
        if (settings.includeCamera && this.userStream?.getVideoTracks().length) {
            this.cameraVideo.srcObject = new MediaStream(this.userStream.getVideoTracks());
            this.cameraVideo.muted = true;
            this.cameraVideo.playsInline = true;
            await this.cameraVideo.play();
        }
        const { width = 1280, height = 720 } = displayVideoTrack.getSettings();
        this.compositorCanvas = document.createElement("canvas");
        this.compositorCanvas.width = width;
        this.compositorCanvas.height = height;
        const context = this.compositorCanvas.getContext("2d");
        if (!context)
            throw new Error("Could not start Selena video compositor.");
        const drawFrame = () => {
            if (!context || !this.compositorCanvas || !this.displayVideo)
                return;
            context.clearRect(0, 0, this.compositorCanvas.width, this.compositorCanvas.height);
            context.drawImage(this.displayVideo, 0, 0, this.compositorCanvas.width, this.compositorCanvas.height);
            if (settings.includeCamera && this.cameraVideo?.srcObject) {
                const bubbleWidth = Math.min(this.compositorCanvas.width * 0.22, 320);
                const bubbleHeight = bubbleWidth * 1.33;
                const padding = Math.max(this.compositorCanvas.width * 0.018, 18);
                const x = this.compositorCanvas.width - bubbleWidth - padding;
                const y = this.compositorCanvas.height - bubbleHeight - padding;
                context.save();
                context.fillStyle = "rgba(19, 8, 7, 0.45)";
                clipRoundedRect(context, x - 4, y - 4, bubbleWidth + 8, bubbleHeight + 8, 28);
                context.fill();
                clipRoundedRect(context, x, y, bubbleWidth, bubbleHeight, 24);
                context.clip();
                context.drawImage(this.cameraVideo, x, y, bubbleWidth, bubbleHeight);
                context.restore();
            }
            this.animationFrameId = window.requestAnimationFrame(drawFrame);
        };
        drawFrame();
        const canvasStream = this.compositorCanvas.captureStream(30);
        const audioTracks = await this.buildAudioTracks(settings);
        return new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
    }
    async buildAudioTracks(settings) {
        const displayTracks = settings.includeTabAudio ? this.displayStream?.getAudioTracks() ?? [] : [];
        const microphoneTracks = settings.includeMicrophone ? this.userStream?.getAudioTracks() ?? [] : [];
        const tracks = [...displayTracks, ...microphoneTracks];
        if (!tracks.length)
            return [];
        this.audioContext = new AudioContext();
        const destination = this.audioContext.createMediaStreamDestination();
        if (displayTracks.length && this.displayStream) {
            const stream = new MediaStream(displayTracks);
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(destination);
        }
        if (microphoneTracks.length && this.userStream) {
            const stream = new MediaStream(microphoneTracks);
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(destination);
        }
        return destination.stream.getAudioTracks();
    }
    startMediaRecorder() {
        if (!this.composedStream)
            throw new Error("No composed stream available.");
        this.recordedChunks = [];
        const mimeType = getRecorderMimeType();
        this.mediaRecorder = mimeType ? new MediaRecorder(this.composedStream, { mimeType }) : new MediaRecorder(this.composedStream);
        this.mediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0)
                this.recordedChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => void this.finishRecording());
        this.mediaRecorder.start(1000);
    }
    attachEndHandlers() {
        const displayTrack = this.displayStream?.getVideoTracks()[0];
        if (!displayTrack)
            return;
        displayTrack.addEventListener("ended", () => {
            if (this.state === "recording")
                this.stopRecording();
        });
    }
    startTimer() {
        this.recordingStartedAt = Date.now();
        this.timerLabel.textContent = "00:00";
        this.timerIntervalId = window.setInterval(() => {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - this.recordingStartedAt) / 1000));
            this.timerLabel.textContent = formatDuration(elapsedSeconds);
        }, 500);
    }
    stopRecording() {
        if (this.state !== "recording" || !this.mediaRecorder)
            return;
        this.state = "stopping";
        this.statusLabel.textContent = "Finishing recording...";
        this.render();
        this.mediaRecorder.stop();
    }
    async finishRecording() {
        const mimeType = this.mediaRecorder?.mimeType || getRecorderMimeType() || "video/webm";
        const extension = mimeType.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        this.downloadUrl = URL.createObjectURL(blob);
        this.downloadLink.href = this.downloadUrl;
        this.downloadLink.download = `selena-extension-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
        this.downloadLink.hidden = false;
        this.downloadLink.click();
        await this.resetRecording();
        this.state = "idle";
        this.statusLabel.textContent = `Recording ready. Download size: ${formatSize(blob.size)}.`;
        this.timerLabel.textContent = "00:00";
        this.render();
    }
    async resetRecording() {
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.timerIntervalId !== null) {
            window.clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartedAt = 0;
        this.stopStreams();
        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }
        this.displayVideo = null;
        this.cameraVideo = null;
        this.compositorCanvas = null;
        this.updateCameraPreview();
    }
    stopStreams() {
        for (const stream of [this.displayStream, this.userStream, this.composedStream]) {
            stream?.getTracks().forEach((track) => track.stop());
        }
        this.displayStream = null;
        this.userStream = null;
        this.composedStream = null;
    }
    revokeDownloadUrl() {
        if (!this.downloadUrl)
            return;
        URL.revokeObjectURL(this.downloadUrl);
        this.downloadUrl = "";
    }
}
function getOverlay() {
    const overlayWindow = window;
    if (!overlayWindow.selenaRecorderOverlay)
        overlayWindow.selenaRecorderOverlay = new SelenaRecorderOverlay();
    return overlayWindow.selenaRecorderOverlay;
}
chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "selena:toggle-overlay")
        return;
    getOverlay().toggleVisibility();
});
getOverlay();
