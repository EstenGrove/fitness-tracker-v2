import { createContext, ReactNode } from "react";
import { isOffline } from "../utils/utils_offline";
import { formatDateTime } from "../utils/utils_dates";
import { useOffline } from "../hooks/useOffline";

export interface OfflineState {
	isOffline: boolean;
	lastOnline: string | null;
}

const OfflineContext = createContext<OfflineState>({
	isOffline: isOffline(),
	lastOnline: formatDateTime(new Date(), "longMs"),
});

const OfflineContextProvider = ({ children }: { children?: ReactNode }) => {
	const offlineState = useOffline();

	if (offlineState.isOffline) {
		console.log("🔴 [OFFLINE] at ", offlineState.lastOnline);
	}

	return (
		<OfflineContext.Provider value={offlineState}>
			{children}
		</OfflineContext.Provider>
	);
};

export { OfflineContext, OfflineContextProvider };
