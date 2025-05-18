import { useRef } from "react";

interface HookOpts {
	delay?: number;
	interval?: number;
	onPress: () => void;
}

const defaultOpts: HookOpts = {
	delay: 300,
	interval: 100,
	onPress: () => {},
};
export function useLongPressInterval(options: HookOpts = defaultOpts) {
	const { delay, interval, onPress } = { ...defaultOpts, ...options };

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const longPressActiveRef = useRef(false);

	const start = () => {
		longPressActiveRef.current = false;
		timeoutRef.current = setTimeout(() => {
			onPress();
			longPressActiveRef.current = true;
			intervalRef.current = setInterval(onPress, interval);
		}, delay);
	};

	const clear = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (intervalRef.current) clearInterval(intervalRef.current);
		timeoutRef.current = null;
		intervalRef.current = null;
	};

	const wasLongPress = () => {
		const active = longPressActiveRef.current;
		longPressActiveRef.current = false;
		return active;
	};

	return {
		handlers: {
			onMouseDown: start,
			onMouseUp: clear,
			onMouseLeave: clear,
			onTouchStart: start,
			onTouchEnd: clear,
			onTouchCancel: clear,
		},
		wasLongPress,
	};
}
