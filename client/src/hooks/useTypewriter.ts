import { useLayoutEffect, useState } from "react";

interface HookOpts {
	speed?: number;
	start?: boolean;
}

const defaultOpts: HookOpts = {
	speed: 25,
	start: true,
};

const useTypewriter = (text: string, opts: HookOpts = defaultOpts) => {
	const { speed, start } = opts;
	const [output, setOutput] = useState<string>("");

	useLayoutEffect(() => {
		if (!start) return;

		let index = 0;
		setOutput("");

		const tick = () => {
			index++;
			setOutput(text.slice(0, index));
			if (index < text.length) {
				timeout = setTimeout(tick, speed);
			}
		};

		let timeout = setTimeout(tick, speed);
		return () => {
			clearTimeout(timeout);
		};
	}, [text, speed, start]);

	return output;
};

export { useTypewriter };
