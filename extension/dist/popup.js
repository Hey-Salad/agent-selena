"use strict";
function isInjectablePopupUrl(url) {
    if (!url)
        return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "file:";
    }
    catch {
        return false;
    }
}
async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}
async function updateStatus() {
    const status = document.getElementById("status");
    const button = document.getElementById("open-recorder");
    const tab = await getActiveTab();
    if (!tab?.id) {
        status.textContent = "No active tab found.";
        button.disabled = true;
        return;
    }
    if (!isInjectablePopupUrl(tab.url)) {
        status.textContent = "Selena cannot run on this page. Open a normal website tab, then try again.";
        button.disabled = true;
        return;
    }
    status.textContent = "Ready. Open the floating Selena panel on this page.";
    button.disabled = false;
}
async function openRecorder() {
    const status = document.getElementById("status");
    const button = document.getElementById("open-recorder");
    button.disabled = true;
    status.textContent = "Opening Selena on this page...";
    const tab = await getActiveTab();
    if (!tab?.id) {
        status.textContent = "No active tab found.";
        return;
    }
    const response = (await chrome.runtime.sendMessage({
        type: "selena:open-overlay",
        tabId: tab.id,
        url: tab.url,
    }));
    status.textContent = response.message;
    button.disabled = !response.ok;
    if (response.ok) {
        window.close();
    }
}
document.getElementById("open-recorder")?.addEventListener("click", () => {
    void openRecorder();
});
void updateStatus();
