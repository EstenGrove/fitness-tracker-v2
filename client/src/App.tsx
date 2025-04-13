import "./App.scss";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import Loader from "./components/layout/Loader";

const User = lazy(() => import("./pages/UserPage"));
const Login = lazy(() => import("./pages/LoginPage"));
const History = lazy(() => import("./pages/HistoryPage"));
const Workouts = lazy(() => import("./pages/WorkoutsPage"));
const Settings = lazy(() => import("./pages/SettingsPage"));
const Dashboard = lazy(() => import("./pages/DashboardPage"));
const Medications = lazy(() => import("./pages/MedicationsPage"));
// Layout page
const DashboardLayout = lazy(
	() => import("./components/layout/DashboardLayout")
);

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<div className="App_main">
						<Routes>
							{/* MARK: LOGIN */}
							<Route
								path="/login"
								element={
									<Suspense fallback={<Loader />}>
										<Login />
									</Suspense>
								}
							/>
							{/* MARK: MAIN ROUTES */}
							<Route
								path="/"
								element={
									<Suspense fallback={<Loader />}>
										<DashboardLayout />
									</Suspense>
								}
							>
								<Route index element={<Dashboard />} />

								<Route
									path="workouts"
									element={
										<Suspense fallback={<Loader />}>
											<Workouts />
										</Suspense>
									}
								/>

								<Route
									path="/meds"
									element={
										<Suspense fallback={<Loader />}>
											<Medications />
										</Suspense>
									}
								/>

								<Route
									path="/history"
									element={
										<Suspense fallback={<Loader />}>
											<History />
										</Suspense>
									}
								></Route>

								<Route
									path="/user"
									element={
										<Suspense fallback={<Loader />}>
											<User />
										</Suspense>
									}
								/>

								<Route
									path="/settings"
									element={
										<Suspense fallback={<Loader />}>
											<Settings />
										</Suspense>
									}
								/>
							</Route>
						</Routes>
					</div>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
