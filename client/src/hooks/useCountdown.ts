import { useCallback, useEffect, useRef, useState } from "react";

const useCountdown = (interval: number = 5, onEnd?: () => void) => {
	const timerRef = useRef<number | null>(null);
	const [count, setCount] = useState<number>(interval);
	const [isCounting, setIsCounting] = useState<boolean>(false);

	const start = () => {
		setIsCounting(true);
		setCount(interval);
	};
	const end = useCallback(() => {
		setIsCounting(false);

		return onEnd && onEnd();
	}, [onEnd]);

	const reset = () => {
		setCount(interval);
		setIsCounting(false);

		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
	};

	// Start countdown
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (isCounting && count > 0) {
			timerRef.current = setInterval(() => {
				setCount((prev) => prev - 1);
			}, 1000);
		}

		return () => {
			isMounted = false;
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [count, isCounting]);

	// auto-end countdown when we reach zero (eg. 0)
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (isCounting && count <= 0) {
			end();
		}

		return () => {
			isMounted = false;
		};
	}, [count, end, isCounting]);

	return {
		isActive: isCounting,
		count: count,
		start: start,
		end: end,
		reset: reset,
	};
};

export { useCountdown };
