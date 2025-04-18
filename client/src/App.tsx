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
// Active Workout
const ActiveWorkout = lazy(() => import("./pages/ActiveWorkoutPage"));
// History Views
const AllHistory = lazy(() => import("./views/AllHistory"));
const WalkHistory = lazy(() => import("./views/WalkHistory"));
const TimedHistory = lazy(() => import("./views/TimedHistory"));
const OtherHistory = lazy(() => import("./views/OtherHistory"));
const CardioHistory = lazy(() => import("./views/CardioHistory"));
const StretchHistory = lazy(() => import("./views/StretchHistory"));
const StrengthHistory = lazy(() => import("./views/StrengthHistory"));

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
									path="active/:id"
									element={
										<Suspense fallback={<Loader />}>
											<ActiveWorkout />
										</Suspense>
									}
								/>

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

								{/* MARK: HISTORY */}
								<Route
									path="/history"
									element={
										<Suspense fallback={<Loader />}>
											<History />
										</Suspense>
									}
								>
									<Route
										index
										element={
											<Suspense fallback={<Loader />}>
												<AllHistory />
											</Suspense>
										}
									/>
									<Route
										path="strength"
										element={
											<Suspense fallback={<Loader />}>
												<StrengthHistory />
											</Suspense>
										}
									/>
									<Route
										path="cardio"
										element={
											<Suspense fallback={<Loader />}>
												<CardioHistory />
											</Suspense>
										}
									/>
									<Route
										path="walk"
										element={
											<Suspense fallback={<Loader />}>
												<WalkHistory />
											</Suspense>
										}
									/>
									<Route
										path="stretch"
										element={
											<Suspense fallback={<Loader />}>
												<StretchHistory />
											</Suspense>
										}
									/>
									<Route
										path="timed"
										element={
											<Suspense fallback={<Loader />}>
												<TimedHistory />
											</Suspense>
										}
									/>
									<Route
										path="other"
										element={
											<Suspense fallback={<Loader />}>
												<OtherHistory />
											</Suspense>
										}
									/>
								</Route>

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
