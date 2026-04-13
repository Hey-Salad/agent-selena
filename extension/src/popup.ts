type PopupOpenOverlayResult = {
	ok: boolean;
	message: string;
};

function isInjectablePopupUrl(url: string | undefined): boolean {
	if (!url) return false;

	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "file:";
	} catch {
		return false;
	}
}

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	return tabs[0];
}

async function updateStatus(): Promise<void> {
	const status = document.getElementById("status") as HTMLDivElement;
	const button = document.getElementById("open-recorder") as HTMLButtonElement;
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

async function openRecorder(): Promise<void> {
	const status = document.getElementById("status") as HTMLDivElement;
	const button = document.getElementById("open-recorder") as HTMLButtonElement;
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
	})) as PopupOpenOverlayResult;

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
