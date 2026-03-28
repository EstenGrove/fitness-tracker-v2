import { useRef } from "react";

type PlayArgs = {
	volume?: number;
	frequency?: number;
	duration?: number;
	type?: OscillatorType;
};

type HapticArgs = {
	intensity?: "light" | "medium" | "heavy";
	duration?: number; // in milliseconds
};

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
	}: PlayArgs) => {
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

	/**
	 * Creates a haptic-like buzz/vibration sound
	 * Uses low frequencies, short duration, and envelope shaping to mimic haptic feedback
	 */
	const playHaptic = async ({
		intensity = "medium",
		duration = 50, // milliseconds
	}: HapticArgs = {}) => {
		const audioContext = await getContext();

		// Haptic parameters based on intensity
		const hapticConfig = {
			light: {
				frequency: 250, // Hz - lower frequency for subtle vibration
				volume: 0.3,
				attack: 0.001, // 1ms attack
				decay: duration / 1000, // decay over full duration
			},
			medium: {
				frequency: 200, // Hz - slightly lower for more "buzz"
				volume: 0.5,
				attack: 0.002, // 2ms attack
				decay: duration / 1000,
			},
			heavy: {
				frequency: 150, // Hz - even lower for stronger vibration feel
				volume: 0.7,
				attack: 0.003, // 3ms attack
				decay: duration / 1000,
			},
		};

		const config = hapticConfig[intensity];
		const durationSeconds = duration / 1000;

		// Create multiple oscillators slightly detuned for richer buzz
		const osc1 = await createOscillator(config.frequency, "square");
		const osc2 = await createOscillator(config.frequency * 1.01, "square"); // Slight detune for texture

		// Create gain node with envelope (attack/decay)
		const gain = await createGain(0);
		const now = audioContext.currentTime;

		// Envelope: quick attack, then decay to zero
		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(config.volume, now + config.attack);
		gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

		// Connect oscillators to gain
		osc1.connect(gain);
		osc2.connect(gain);
		gain.connect(audioContext.destination);

		// Start and stop
		osc1.start(now);
		osc2.start(now);
		osc1.stop(now + durationSeconds);
		osc2.stop(now + durationSeconds);

		// Cleanup after sound finishes
		setTimeout(() => {
			osc1.disconnect();
			osc2.disconnect();
			gain.disconnect();
		}, duration + 10);

		return { osc1, osc2, gain };
	};

	return {
		ctx: ctx.current,
		initContext, // Expose for synchronous initialization from user gesture
		play: playOsc,
		playHaptic, // Haptic-like buzz/vibration
	};
};

export { useOsc };
