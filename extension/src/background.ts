type BackgroundOpenOverlayResult = {
	ok: boolean;
	message: string;
};

type OpenOverlayMessage = {
	tabId?: number;
	type?: string;
	url?: string;
};

function isInjectableBackgroundUrl(url: string | undefined): boolean {
	if (!url) return false;

	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "file:";
	} catch {
		return false;
	}
}

async function ensureOverlay(tabId: number): Promise<void> {
	try {
		await chrome.tabs.sendMessage(tabId, { type: "selena:toggle-overlay" });
		return;
	} catch {
		await chrome.scripting.executeScript({
			target: { tabId },
			files: ["dist/content.js"],
		});
		await chrome.tabs.sendMessage(tabId, { type: "selena:toggle-overlay" });
	}
}

chrome.runtime.onMessage.addListener((message: OpenOverlayMessage, _sender, sendResponse) => {
	if (message.type !== "selena:open-overlay") return;

	(async () => {
		const tabId = message.tabId;
		if (!tabId) {
			sendResponse({
				ok: false,
				message: "Selena could not find the active tab.",
			} satisfies BackgroundOpenOverlayResult);
			return;
		}

		if (!isInjectableBackgroundUrl(message.url)) {
			sendResponse({
				ok: false,
				message: "Chrome blocks Selena on this page. Open a normal website tab and try again.",
			} satisfies BackgroundOpenOverlayResult);
			return;
		}

		try {
			await ensureOverlay(tabId);
			sendResponse({
				ok: true,
				message: "Selena is open on this page.",
			} satisfies BackgroundOpenOverlayResult);
		} catch (error) {
			sendResponse({
				ok: false,
				message: `Selena could not open on this page: ${error instanceof Error ? error.message : "unknown error"}.`,
			} satisfies BackgroundOpenOverlayResult);
		}
	})();

	return true;
});
