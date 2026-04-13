type SelenaMode = "human" | "ai";
type SelenaSurface = "browser" | "desktop";
type WorkerEnv = Env & { ASSETS: Fetcher };

const HUMAN_BLUEPRINT = {
	id: "human-browser-capture",
	label: "Human-triggered capture",
	actor: "human",
	scope: "Local screen, tab, or window capture from the browser.",
	shippingOrder: "now",
	stack: [
		"Screen Capture API",
		"MediaRecorder",
		"Cloudflare Stream direct upload",
	],
	blockers: [
		"Recording must start from an explicit user action.",
		"Users still choose which screen, tab, or window to share.",
	],
};

const AI_BLUEPRINT = {
	id: "ai-remote-session",
	label: "AI-triggered capture",
	actor: "agent",
	scope: "Remote browser or desktop sessions that Selena controls for the user.",
	shippingOrder: "next",
	stack: [
		"Cloudflare Worker orchestration",
		"Remote browser automation",
		"Session recording and export",
		"Cloudflare Stream publishing",
	],
	blockers: [
		"Do not depend on silent local screen capture in the user's browser.",
		"Desktop-app recording needs a remote desktop lane beyond the browser MVP.",
	],
};

const LAUNCH_PLAN = [
	{
		phase: "Phase 1",
		timeline: "Days 1-5",
		outcome: "Ship browser-based human recording and upload.",
	},
	{
		phase: "Phase 2",
		timeline: "Week 2",
		outcome: "Add Selena-run browser walkthroughs for web apps and browser decks.",
	},
	{
		phase: "Phase 3",
		timeline: "Week 3+",
		outcome: "Add remote desktop capture for PowerPoint, native apps, and full desktop demos.",
	},
];

function json(data: unknown, init: ResponseInit = {}): Response {
	const headers = new Headers(init.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	headers.set("cache-control", "no-store");
	return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}

function getMode(value: unknown): SelenaMode {
	return value === "ai" ? "ai" : "human";
}

function getSurface(value: unknown): SelenaSurface {
	return value === "desktop" ? "desktop" : "browser";
}

function getBlueprint(mode: SelenaMode) {
	return mode === "ai" ? AI_BLUEPRINT : HUMAN_BLUEPRINT;
}

function getActor(mode: SelenaMode, actor: unknown): string {
	if (typeof actor === "string" && actor.trim()) return actor.trim();
	return mode === "ai" ? "agent" : "human";
}

function getTarget(target: unknown): string {
	if (typeof target === "string" && target.trim()) return target.trim();
	return "Product walkthrough";
}

function getNextAction(mode: SelenaMode, surface: SelenaSurface): string {
	if (mode === "human") return "Open the recorder, let the user choose the screen, and upload to Stream.";
	if (surface === "desktop") return "Run Selena inside a remote desktop and record the session before publishing.";
	return "Run Selena in a remote browser, script the flow, and publish the recording.";
}

function getWarnings(mode: SelenaMode, surface: SelenaSurface): string[] {
	if (mode === "human") return HUMAN_BLUEPRINT.blockers;
	if (surface === "desktop") return [...AI_BLUEPRINT.blockers, "Plan explicit export and encoding for desktop sessions."];
	return AI_BLUEPRINT.blockers;
}

function buildJob(payload: Record<string, unknown>) {
	const mode = getMode(payload.mode);
	const surface = getSurface(payload.surface);
	return {
		id: crypto.randomUUID(),
		mode,
		surface,
		actor: getActor(mode, payload.actor),
		target: getTarget(payload.target),
		blueprint: getBlueprint(mode).id,
		status: mode === "ai" && surface === "desktop" ? "planned" : "ready",
		nextAction: getNextAction(mode, surface),
		warnings: getWarnings(mode, surface),
		createdAt: new Date().toISOString(),
	};
}

async function readPayload(request: Request): Promise<Record<string, unknown>> {
	if (request.headers.get("content-length") === "0") return {};
	try {
		return (await request.json()) as Record<string, unknown>;
	} catch {
		return {};
	}
}

function handleGet(pathname: string): Response | null {
	if (pathname === "/api/health") {
		return json({
			name: "Selena",
			company: "HeySalad",
			status: "ready",
			fastPath: "Ship human browser recording first, then add AI-run remote sessions.",
		});
	}
	if (pathname === "/api/recording-modes") {
		return json({ modes: [HUMAN_BLUEPRINT, AI_BLUEPRINT] });
	}
	if (pathname === "/api/launch-plan") return json({ phases: LAUNCH_PLAN });
	if (pathname === "/api/blueprint") {
		return json({
			product: "Selena",
			tagline: "A HeySalad agent for human-led and AI-led screen recordings.",
			recommendation: "Start with browser capture. Expand AI automation from remote browser to remote desktop.",
			modes: [HUMAN_BLUEPRINT, AI_BLUEPRINT],
		});
	}
	return null;
}

async function handleApi(request: Request): Promise<Response | null> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith("/api/")) return null;
	if (request.method === "GET") return handleGet(url.pathname) ?? json({ error: "Not Found" }, { status: 404 });
	if (request.method === "POST" && url.pathname === "/api/jobs") {
		const payload = await readPayload(request);
		return json({ job: buildJob(payload) }, { status: 201 });
	}
	return json({ error: "Method Not Allowed" }, { status: 405 });
}

export default {
	async fetch(request, env): Promise<Response> {
		const apiResponse = await handleApi(request);
		if (apiResponse) return apiResponse;
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<WorkerEnv>;
