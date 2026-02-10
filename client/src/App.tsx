import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RouterProvider } from "react-router";
import { AppProviders } from "./context/AppProviders";
import { router } from "./routes/routes";
import { useRefreshOnFocus } from "./hooks/useRefreshOnFocus";
import OfflineIndicator from "./components/offline/OfflineIndicator";

function App() {
	useRefreshOnFocus();
	return (
		<Provider store={store}>
			<AppProviders>
				<div className="App">
					<div className="App_main">
						<RouterProvider router={router} />
						<OfflineIndicator />
					</div>
				</div>
			</AppProviders>
		</Provider>
	);
}

export default App;
