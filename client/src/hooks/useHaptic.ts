import { RefObject, useCallback, useRef } from "react";

type HapticLevel = "light" | "medium" | "heavy";

const VIBRATION: Record<HapticLevel, number | number[]> = {
	light: 10,
	medium: 20,
	heavy: [20, 30, 20],
};

// Tuned specifically for iPhone speaker feel
const AUDIO: Record<
	HapticLevel,
	{ duration: number; frequency: number; gain: number }
> = {
	light: { duration: 0.012, frequency: 130, gain: 0.6 },
	medium: { duration: 0.018, frequency: 95, gain: 0.9 },
	heavy: { duration: 0.025, frequency: 70, gain: 1.2 },
};

const createContext = (
	audioRef: RefObject<AudioContext | null>,
	newContext?: AudioContext
) => {
	if (newContext) {
		audioRef.current = newContext;
	} else {
		audioRef.current = new AudioContext({
			latencyHint: "interactive",
		});
	}
};

const useHaptic = () => {
	const audioCtx = useRef<AudioContext | null>(null);
	const gainNode = useRef<GainNode | null>(null);
	const oscillatorNode = useRef<OscillatorNode | null>(null);

	const createAudioNodes = (audioRef: RefObject<AudioContext | null>) => {
		if (!audioRef.current) {
			createContext(audioRef);
		}
	};
};

export { useHaptic };
