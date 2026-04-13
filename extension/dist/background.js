"use strict";
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id)
        return;
    try {
        await chrome.tabs.sendMessage(tab.id, { type: "selena:toggle-overlay" });
    }
    catch (error) {
        console.warn("Selena could not toggle the recorder on this page.", error);
    }
});
