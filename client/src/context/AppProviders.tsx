import { ReactNode } from "react";
import { OfflineContextProvider } from "./OfflineContext";
import { WorkoutContextProvider } from "./WorkoutContext";

const AppProviders = ({ children }: { children?: ReactNode }) => {
	return (
		<OfflineContextProvider>
			<WorkoutContextProvider>{children}</WorkoutContextProvider>
		</OfflineContextProvider>
	);
};

export { AppProviders };
