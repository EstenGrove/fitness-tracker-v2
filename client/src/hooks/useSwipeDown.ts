import { TouchEvent, useState } from "react";

const useSwipeDown = (threshold: number = 100, onThreshold?: () => void) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [initialY, setInitialY] = useState<number>(0);
	const [translateY, setTranslateY] = useState<number>(0);

	const reset = () => {
		setIsDragging(false);
		setInitialY(0);
		setTranslateY(0);
	};

	const onTouchStart = (e: TouchEvent) => {
		const startY = e.touches[0].clientY;
		setInitialY(startY);
		setIsDragging(true);
	};

	const onTouchMove = (e: TouchEvent) => {
		const endY = e.touches[0].clientY;
		const newDeltaY = endY - initialY;

		if (isDragging) {
			if (endY > 0) {
				if (newDeltaY > threshold) {
					return onThreshold && onThreshold();
				}
				setTranslateY(newDeltaY);
			} else {
				setTranslateY(0);
			}
		}
	};

	const onTouchEnd = (e: TouchEvent) => {
		const endY = e.changedTouches[0].clientY;
		const newDeltaY = endY - initialY;

		if (newDeltaY >= threshold) {
			if (onThreshold) {
				onThreshold();
			}
			reset();
		} else {
			return reset();
		}
	};

	return {
		isDragging: isDragging,
		startY: initialY,
		translateY: translateY,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
	};
};

export { useSwipeDown };
