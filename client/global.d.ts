export {};

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string;
						callback: (response: { credential: string }) => void;
					}) => void;

					renderButton: (
						element: HTMLElement | null,
						options: Record<string, unknown>
					) => void;

					prompt: () => void;
				};
			};
		};
	}
}
