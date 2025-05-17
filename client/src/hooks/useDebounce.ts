import { useRef, useEffect, useCallback } from "react";

const useDebounced = <T extends (...args: unknown[]) => void>(
	callback: T,
	delay: number = 500
): ((...args: Parameters<T>) => void) => {
	const timer = useRef<ReturnType<typeof setTimeout>>(null);

	const debouncedFn = useCallback(
		(...args: Parameters<T>) => {
			if (timer.current) clearTimeout(timer.current);

			timer.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay]
	);

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	return debouncedFn;
};

export { useDebounced };
