import { SyntheticEvent, useCallback, useRef } from "react";

const useLongPress = (
	delay: number = 500,
	onLongPress: (e: SyntheticEvent) => void
) => {
	const timerRef = useRef<number | null>(null);

	const start = useCallback(
		(e: SyntheticEvent) => {
			timerRef.current = setTimeout(() => {
				onLongPress(e);
			}, delay);
		},
		[delay, onLongPress]
	);

	const clear = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	return {
		// desktop
		onMouseDown: start,
		onMouseUp: clear,
		onMouseLeave: clear,
		// mobile
		onTouchStart: start,
		onTouchEnd: clear,
		onTouchCancel: clear,
	};
};

export { useLongPress };
