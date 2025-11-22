import { useEffect } from "react";

declare global {
	interface Window {
		// eslint-disable-next-line
		google?: unknown | any;
	}
}

type HookOptions = {
	onSuccess: (token: string) => void;
	onError?: (err: string | Error) => void;
	redirectTo?: string; // client-side route
};

const useGoogleAuth = (options: HookOptions) => {
	const { onSuccess, onError } = options;

	const signin = () => {
		google.accounts.id.prompt((notification) => {
			if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
				return (
					onError && onError(new Error("Google prompt failed to display!"))
				);
			}
			if (notification.isDismissedMoment()) {
				const fallback = new Error("Google prompt was dismissed by user!");
				const reason = notification.getDismissedReason();
				return onError && onError(reason || fallback);
			}
		});
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (typeof window === "undefined") return;
		if (!("google" in window)) return;

		// This gets us the user's Google JWT token;
		// ...then we decode it on the backend, find the user and send a response if found
		google.accounts.id.initialize({
			client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
			callback: (response: { credential: string }) => {
				onSuccess(response.credential);
			},
		});

		return () => {
			isMounted = false;
		};
	}, [onSuccess]);

	return {
		signin,
	};
};

export { useGoogleAuth };
