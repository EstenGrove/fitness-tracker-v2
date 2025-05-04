import { useLayoutEffect } from "react";

const useBackgroundBlur = () => {
	useLayoutEffect(() => {
		const el = document.createElement("div");
		el.classList.add("blurOverlay");
		document.body.appendChild(el);
		el.style.zIndex = "9995";

		return () => {
			el.classList.remove("blurOverlay");
			document.body.removeChild(el);
		};
	}, []);
};

export { useBackgroundBlur };
