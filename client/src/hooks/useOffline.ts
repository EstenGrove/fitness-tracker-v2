import { useState, useEffect } from "react";
import { formatDateTime } from "../utils/utils_dates";

const useOffline = () => {
	const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
	const [lastOnline, setLastOnline] = useState<string>(
		formatDateTime(new Date(), "longMs")
	);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		// When we re-connect, just force refresh the page
		const markAsOnline = () => {
			window.location.reload();
			// no need to set state, since we force a refresh
		};
		const markAsOffline = () => {
			const timestamp = formatDateTime(new Date(), "longMs");
			setIsOffline(true);
			setLastOnline(timestamp);
		};

		window.addEventListener("online", markAsOnline);
		window.addEventListener("offline", markAsOffline);

		return () => {
			isMounted = false;
		};
	}, []);

	return {
		isOffline,
		lastOnline,
	};
};

export { useOffline };
