"use strict";
function isInjectableBackgroundUrl(url) {
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
async function ensureOverlay(tabId) {
    try {
        await chrome.tabs.sendMessage(tabId, { type: "selena:toggle-overlay" });
        return;
    }
    catch {
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ["dist/content.js"],
        });
        await chrome.tabs.sendMessage(tabId, { type: "selena:toggle-overlay" });
    }
}
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "selena:open-overlay")
        return;
    (async () => {
        const tabId = message.tabId;
        if (!tabId) {
            sendResponse({
                ok: false,
                message: "Selena could not find the active tab.",
            });
            return;
        }
        if (!isInjectableBackgroundUrl(message.url)) {
            sendResponse({
                ok: false,
                message: "Chrome blocks Selena on this page. Open a normal website tab and try again.",
            });
            return;
        }
        try {
            await ensureOverlay(tabId);
            sendResponse({
                ok: true,
                message: "Selena is open on this page.",
            });
        }
        catch (error) {
            sendResponse({
                ok: false,
                message: `Selena could not open on this page: ${error instanceof Error ? error.message : "unknown error"}.`,
            });
        }
    })();
    return true;
});
