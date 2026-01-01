import { JSX, lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import Loader from "../components/layout/Loader";

// Lazy pages
const NotFound = lazy(() => import("../pages/NotFoundPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const CreateAccount = lazy(() => import("../pages/CreateAccountPage"));
const AIChatPage = lazy(() => import("../pages/AIChatPage"));
// Main Pages
const User = lazy(() => import("../pages/UserPage"));
const Goals = lazy(() => import("../pages/GoalsPage"));
const Trends = lazy(() => import("../pages/TrendsPage"));
const History = lazy(() => import("../pages/HistoryPage"));
const Workouts = lazy(() => import("../pages/WorkoutsPage"));
const Settings = lazy(() => import("../pages/SettingsPage"));
const Dashboard = lazy(() => import("../pages/DashboardPage"));
const Medications = lazy(() => import("../pages/MedicationsPage"));
const RecentActivity = lazy(() => import("../pages/RecentActivityPage"));
const MedicationDetails = lazy(() => import("../pages/MedicationDetailsPage"));
// Habits Pages
const Habits = lazy(() => import("../pages/HabitsPage"));
const HabitTracker = lazy(() => import("../pages/HabitTrackerPage"));
const RecentHabitHistory = lazy(
	() => import("../pages/RecentHabitHistoryPage")
);
const HabitHistory = lazy(() => import("../pages/HabitHistoryPage"));
// Stats Pages
const Stats = lazy(() => import("../pages/StatsPage"));
const MinsStats = lazy(() => import("../components/stats/MinsStats"));
const StepsStats = lazy(() => import("../components/stats/StepsStats"));
const WorkoutsStats = lazy(() => import("../components/stats/WorkoutsStats"));
const ActivityStats = lazy(() => import("../components/stats/ActivityStats"));

const DashboardLayout = lazy(
	() => import("../components/layout/DashboardLayout")
);
// Workouts Pages
const ActiveWorkout = lazy(() => import("../pages/ActiveWorkoutPage"));
const AllWorkouts = lazy(() => import("../pages/AllWorkoutsPage"));
const WorkoutDetails = lazy(() => import("../pages/WorkoutDetailsPage"));

// History Views
const AllHistory = lazy(() => import("../views/AllHistory"));
const WalkHistory = lazy(() => import("../views/WalkHistory"));
const TimedHistory = lazy(() => import("../views/TimedHistory"));
const OtherHistory = lazy(() => import("../views/OtherHistory"));
const CardioHistory = lazy(() => import("../views/CardioHistory"));
const StretchHistory = lazy(() => import("../views/StretchHistory"));
const StrengthHistory = lazy(() => import("../views/StrengthHistory"));

const SettingsOption = lazy(() => import("../pages/SettingsOptionPage"));

// Awards & Streaks' Pages
const Awards = lazy(() => import("../pages/AwardsPage"));

// Demo Page
const Demo = lazy(() => import("../pages/DemoPage"));

// Lazy-load helper fn; passes the <Loader/> to our <Suspense/> component as a fallback
const load = (el: JSX.Element) => (
	<Suspense fallback={<Loader />}>{el}</Suspense>
);

export const router = createBrowserRouter([
	/* LOGIN */
	{ path: "/login", element: load(<Login />) },
	{ path: "/signup", element: load(<CreateAccount />) },

	/* MAIN LAYOUT */
	{
		path: "/",
		element: load(<DashboardLayout />),
		children: [
			{ index: true, element: <Dashboard /> },

			{ path: "demo", element: load(<Demo />) },

			/* AI */
			{ path: "ai/*", element: load(<AIChatPage />) },

			/* AWARDS */
			{ path: "awards/*", element: load(<Awards />) },

			/* STATS */
			{
				path: "stats",
				element: load(<Stats />),
				children: [
					{ path: "mins", element: <MinsStats /> },
					{ path: "steps", element: <StepsStats /> },
					{ path: "workouts", element: <WorkoutsStats /> },
					{ path: "activity", element: <ActivityStats /> },
				],
			},

			/* MARK: HABITS */
			{ path: "habit-history", element: load(<HabitHistory />) },
			{ path: "habits", element: load(<Habits />) },
			{ path: "habits/:id/tracker", element: load(<HabitTracker />) },
			{ path: "habits/recents", element: load(<RecentHabitHistory />) },

			/* MARK: WORKOUTS */
			{ path: "active/:id", element: load(<ActiveWorkout />) },
			{ path: "workouts", element: load(<Workouts />) },
			{ path: "workouts/all", element: load(<AllWorkouts />) },
			{ path: "workouts/details/:id", element: load(<WorkoutDetails />) },

			/* MARK: MEDS */
			{ path: "meds", element: load(<Medications />) },
			{
				path: "meds/details/:id",
				element: load(<MedicationDetails />),
			},

			/* MARK: HISTORY */
			{
				path: "history",
				element: load(<History />),
				children: [
					{ index: true, element: load(<AllHistory />) },
					{ path: "strength", element: load(<StrengthHistory />) },
					{ path: "cardio", element: load(<CardioHistory />) },
					{ path: "walk", element: load(<WalkHistory />) },
					{ path: "stretch", element: load(<StretchHistory />) },
					{ path: "timed", element: load(<TimedHistory />) },
					{
						path: "other",
						element: load(<OtherHistory />),
						loader: async (params) => {
							return params;
						},
					},
				],
			},

			/* GOALS */
			{ path: "goals", element: load(<Goals />) },
			{ path: "trends", element: load(<Trends />) },

			/* ACTIVITY */
			{ path: "activity", element: load(<RecentActivity />) },

			/* USER */
			{ path: "user", element: load(<User />) },

			/* SETTINGS */
			{ path: "settings", element: load(<Settings />) },
			{ path: "settings/:id", element: load(<SettingsOption />) },
		],
	},

	/* 404 */
	{ path: "*", element: load(<NotFound />) },
]);
