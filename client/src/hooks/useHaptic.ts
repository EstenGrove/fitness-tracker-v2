import { HapticInput } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

const HAPTIC_PRESETS = {
	success: [{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }],
	error: [
		{ duration: 40, intensity: 0.7 },
		{ delay: 40, duration: 40, intensity: 0.7 },
		{ delay: 40, duration: 40, intensity: 0.9 },
		{ delay: 40, duration: 50, intensity: 0.6 },
	],
	warning: [
		{ duration: 40, intensity: 0.8 },
		{ delay: 100, duration: 40, intensity: 0.6 },
	],
	info: [{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }],
	light: [{ duration: 15 }, { intensity: 0.4 }],
	medium: [{ duration: 25 }, { intensity: 0.7 }],
	heavy: [{ duration: 35 }, { intensity: 1 }],
	nudge: [
		{ duration: 80, intensity: 0.8 },
		{ delay: 80, duration: 50, intensity: 0.3 },
	],
	buzz: [{ duration: 1000, intensity: 0.5 }],
};

const useHaptic = () => {
	const haptics = useWebHaptics();

	// Triggers custom/built-in patterns
	const triggerPreset = async (
		preset: keyof typeof HAPTIC_PRESETS = "success",
	) => {
		await haptics.trigger(HAPTIC_PRESETS[preset] as HapticInput);
	};

	// Supports custom patterns
	const triggerHaptic = async (input: HapticInput) => {
		await haptics.trigger(input);
	};

	return { trigger: triggerHaptic, triggerPreset };
};

export { useHaptic };
