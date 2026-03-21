class MicroHaptics {
	private static instance: MicroHaptics;
	private ctx: AudioContext | null = null;

	static get() {
		if (!MicroHaptics.instance) {
			MicroHaptics.instance = new MicroHaptics();
		}
		return MicroHaptics.instance;
	}

	private async getCtx() {
		if (!this.ctx) {
			this.ctx = new (window.AudioContext ||
				(window as any).webkitAudioContext)({
				latencyHint: "interactive",
			});
		}

		if (this.ctx.state === "suspended") {
			await this.ctx.resume();
		}

		return this.ctx;
	}

	private async pulse(bassFreq: number, clickFreq: number, duration = 0.02) {
		const ctx = await this.getCtx();
		const now = ctx.currentTime;

		const bass = ctx.createOscillator();
		const click = ctx.createOscillator();
		const gain = ctx.createGain();
		const filter = ctx.createBiquadFilter();

		filter.type = "bandpass";
		filter.frequency.value = 100;
		filter.Q.value = 0.7;

		bass.type = "sine";
		bass.frequency.value = bassFreq;

		click.type = "square";
		click.frequency.value = clickFreq;

		gain.gain.setValueAtTime(0.5, now);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

		bass.connect(filter);
		click.connect(filter);

		filter.connect(gain);
		gain.connect(ctx.destination);

		bass.start(now);
		click.start(now + 0.002);

		bass.stop(now + duration);
		click.stop(now + duration * 0.7);
	}

	async impact(type: "light" | "medium" | "heavy" = "medium") {
		const patterns = {
			light: 10,
			medium: 20,
			heavy: 35,
		};

		if ("vibrate" in navigator) {
			navigator.vibrate(patterns[type]);
			return;
		}

		const configs = {
			light: [70, 200],
			medium: [55, 160],
			heavy: [40, 120],
		};

		const [bass, click] = configs[type];

		await this.pulse(bass, click);
	}

	async selection() {
		if ("vibrate" in navigator) {
			navigator.vibrate(8);
			return;
		}

		await this.pulse(80, 220, 0.015);
	}

	async success() {
		if ("vibrate" in navigator) {
			navigator.vibrate([20, 30, 20]);
			return;
		}

		await this.pulse(60, 180);
		setTimeout(() => this.pulse(90, 240, 0.015), 45);
	}

	async error() {
		if ("vibrate" in navigator) {
			navigator.vibrate([30, 40, 30]);
			return;
		}

		await this.pulse(35, 110);
		setTimeout(() => this.pulse(35, 110), 60);
	}
}

import { useMemo } from "react";

export function useHaptics() {
	const engine = useMemo(() => MicroHaptics.get(), []);

	return {
		impact: engine.impact.bind(engine),
		selection: engine.selection.bind(engine),
		success: engine.success.bind(engine),
		error: engine.error.bind(engine),
	};
}
