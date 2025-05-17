import { useEffect, useState } from "react";

const useDebouncedInput = (value: string, delay: number) => {
	const [debounced, setDebounced] = useState<string>(value);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;
		const timer = setTimeout(() => setDebounced(value), delay);

		return () => {
			isMounted = false;
			clearTimeout(timer);
		};
	}, [delay, value]);

	return debounced;
};

export { useDebouncedInput };
