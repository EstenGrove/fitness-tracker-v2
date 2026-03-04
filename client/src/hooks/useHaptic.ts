import { useCallback, useRef } from "react";

type Intensity = "light" | "medium" | "heavy";

const VIBRATION_MAP: Record<Intensity, number | number[]> = {
	light: 10,
	medium: 20,
	heavy: [20, 30, 20],
};

const AUDIO_MAP: Record<Intensity, { duration: number; frequency: number }> = {
	light: { duration: 0.01, frequency: 120 },
	medium: { duration: 0.015, frequency: 90 },
	heavy: { duration: 0.02, frequency: 70 },
};

const useHaptic = () => {
	const audioCtxRef = useRef<AudioContext | null>(null);

	const supportsVibrate =
		typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

	const triggerAudioHaptic = useCallback((intensity: Intensity) => {
		if (typeof window === "undefined") return;

		if (!audioCtxRef.current) {
			audioCtxRef.current = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
		}

		const ctx = audioCtxRef.current;

		if (ctx.state === "suspended") {
			ctx.resume();
		}

		const { duration, frequency } = AUDIO_MAP[intensity];

		const oscillator = ctx.createOscillator();
		const gain = ctx.createGain();

		oscillator.type = "sine";
		oscillator.frequency.value = frequency;

		gain.gain.setValueAtTime(1, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

		oscillator.connect(gain);
		gain.connect(ctx.destination);

		oscillator.start();
		oscillator.stop(ctx.currentTime + duration);
	}, []);

	const triggerHaptic = useCallback(
		(intensity: Intensity = "light") => {
			if (supportsVibrate) {
				navigator.vibrate(VIBRATION_MAP[intensity]);
			} else {
				triggerAudioHaptic(intensity);
			}
		},
		[supportsVibrate, triggerAudioHaptic]
	);

	return { triggerHaptic };
};

export { useHaptic };
