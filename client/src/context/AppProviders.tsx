import { ReactNode } from "react";
import { OfflineContextProvider } from "./OfflineContext";

const AppProviders = ({ children }: { children?: ReactNode }) => {
	return <OfflineContextProvider>{children}</OfflineContextProvider>;
};

export { AppProviders };
