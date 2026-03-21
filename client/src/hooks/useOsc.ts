import { useRef } from "react";

interface OscSound {
	type: OscillatorType;
	frequency: number;
	duration: number;
	volume?: number;
	frequencySlide?: [number, number];
	chord?: [number, number];
}

const useOsc = () => {
	const ctx = useRef<AudioContext | null>(null);

	// Initialize context synchronously - MUST be called from user gesture on iOS
	const initContext = () => {
		if (!ctx.current) {
			ctx.current = new AudioContext();
		}
		return ctx.current;
	};

	const getContext = async () => {
		// Ensure context exists (should already be initialized via initContext)
		if (!ctx.current) {
			ctx.current = new AudioContext();
		}

		// Resume if suspended - MUST await on iOS
		if (ctx.current.state === "suspended") {
			await ctx.current.resume();
		}

		return ctx.current;
	};

	const createGain = async (level: number = 0.7) => {
		const audioCtx = await getContext();
		const gain = audioCtx.createGain();
		gain.gain.value = level;
		return gain;
	};

	const createOscillator = async (
		frequency: number,
		type: OscillatorType = "sine"
	) => {
		const audioCtx = await getContext();
		const oscillator = audioCtx.createOscillator();
		oscillator.type = type;
		oscillator.frequency.value = frequency;
		return oscillator;
	};

	const playOsc = async ({
		volume = 0.7,
		frequency = 440,
		duration = 5,
		type = "sine",
	}: OscSound) => {
		// Get context and ensure it's resumed (critical for iOS)
		const audioContext = await getContext();

		// Create audio nodes
		const oscillator = await createOscillator(frequency, type);
		const gain = await createGain(volume);

		// Connect nodes
		oscillator.connect(gain);
		gain.connect(audioContext.destination);

		const now = audioContext.currentTime;

		// Start and stop oscillator
		oscillator.start(now);
		oscillator.stop(now + duration);

		return oscillator;
	};

	return {
		init: initContext,
		play: playOsc,
	};
};

export { useOsc };
