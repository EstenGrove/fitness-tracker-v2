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
	const { delay, interval, onPress } = options;
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

	const start = () => {
		// First delay before repeat starts
		timeoutRef.current = setTimeout(() => {
			onPress();
			intervalRef.current = setInterval(onPress, interval);
		}, delay);
	};

	const clear = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (intervalRef.current) clearInterval(intervalRef.current);
	};

	return {
		onMouseDown: start,
		onMouseUp: clear,
		onMouseLeave: clear,
		onTouchStart: start,
		onTouchEnd: clear,
		onTouchCancel: clear,
	};
}
