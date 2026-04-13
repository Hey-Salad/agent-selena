import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Selena worker", () => {
	it("returns Selena health data", async () => {
		const request = new Request<unknown, IncomingRequestCfProperties>(
			"http://example.com/api/health"
		);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env as Env & { ASSETS: Fetcher }, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toMatchObject({
			name: "Selena",
			company: "HeySalad",
			status: "ready",
		});
	});

	it("returns both recording modes", async () => {
		const response = await SELF.fetch("http://example.com/api/recording-modes");
		const data = (await response.json()) as { modes: Array<{ id: string }> };

		expect(response.status).toBe(200);
		expect(data.modes.map((mode) => mode.id)).toEqual([
			"human-browser-capture",
			"ai-remote-session",
		]);
	});

	it("creates an AI browser job", async () => {
		const request = new Request("http://example.com/api/jobs", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				mode: "ai",
				surface: "browser",
				target: "Pitch deck walkthrough",
			}),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env as Env & { ASSETS: Fetcher }, ctx);
		await waitOnExecutionContext(ctx);
		const data = (await response.json()) as { job: { mode: string; nextAction: string } };

		expect(response.status).toBe(201);
		expect(data.job.mode).toBe("ai");
		expect(data.job.nextAction).toContain("remote browser");
	});

	it("falls back to the Selena landing page", async () => {
		const response = await SELF.fetch("http://example.com/");
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(html).toContain("Selena");
		expect(html).toContain("Record it yourself or send Selena.");
	});
});
