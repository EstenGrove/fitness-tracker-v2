import { useLayoutEffect } from "react";

const useBackgroundBlur = () => {
	useLayoutEffect(() => {
		const el = document.createElement("div");
		el.classList.add("blurOverlay");
		document.body.appendChild(el);

		return () => {
			el.classList.remove("blurOverlay");
			document.body.removeChild(el);
		};
	}, []);
};

export { useBackgroundBlur };
