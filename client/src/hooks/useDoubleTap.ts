import { SyntheticEvent, useRef } from "react";

const useDoubleTap = (
	delay: number = 300,
	onDoubleTap?: (e: SyntheticEvent) => void
) => {
	const lastTap = useRef<number>(0);

	const handleTap = (e: SyntheticEvent) => {
		const now = Date.now();
		if (now - lastTap.current < delay) {
			if (onDoubleTap) onDoubleTap(e);
		}
		lastTap.current = now;
	};

	return {
		onClick: handleTap, // desktop
		onTouchEnd: handleTap, // mobile
	};
};

export { useDoubleTap };
