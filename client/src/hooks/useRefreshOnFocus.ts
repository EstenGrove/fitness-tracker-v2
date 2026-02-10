import { useEffect, useRef } from "react";

/**
 * When the user switches away from the tab, then comes back we want to trigger a refresh to restore/re-sync data & states
 */

const useRefreshOnFocus = () => {
	const wasInBackgroundRef = useRef(false);

	useEffect(() => {
		const onVisibilityChange = () => {
			const isVisible = document.visibilityState === "visible";
			const isInBackground = document.visibilityState === "hidden";

			if (isInBackground) {
				wasInBackgroundRef.current = true;
			}

			if (isVisible && wasInBackgroundRef.current) {
				wasInBackgroundRef.current = false;
				window.location.reload();
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);
		window.addEventListener("focus", onVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("focus", onVisibilityChange);
		};
	}, []);
};

export { useRefreshOnFocus };
