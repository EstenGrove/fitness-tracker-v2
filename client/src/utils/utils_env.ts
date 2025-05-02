export const BASE_URL: string = import.meta.env.VITE_API_BASE;
export const PORT: number = 3002;

const API_AUTH = {
	development: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
		enableHttps: import.meta.env.VITE_ENABLE_HTTPS,
	},
	production: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
		enableHttps: import.meta.env.VITE_ENABLE_HTTPS,
	},
	testing: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
		enableHttps: import.meta.env.VITE_ENABLE_HTTPS,
	},
	local: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
		enableHttps: import.meta.env.VITE_ENABLE_HTTPS,
	},
	// USED FOR TESTING ON LOCAL NETWORK
	network: {
		assets: import.meta.env.VITE_TEST_ASSETS_URL,
		base: import.meta.env.VITE_TEST_API_BASE,
		user: import.meta.env.VITE_TEST_API_USER,
		password: import.meta.env.VITE_TEST_API_USER_PASSWORD,
		enableHttps: import.meta.env.VITE_ENABLE_HTTPS,
	},
	ssl: {
		assets: import.meta.env.VITE_SSL_API_ASSETS_URL,
		base: import.meta.env.VITE_SSL_API_BASE,
		// base: `https://192.168.0.44:${PORT}/api/v1`,
		// base: "https://localhost:3000/api/v1",
		user: import.meta.env.VITE_SSL_API_USER,
		password: import.meta.env.VITE_SSL_API_USER_PASSWORD,
		enableHttps: true,
	},
};

const CURRENT_ENV_KEY = "local";
const CURRENT_ENV = API_AUTH[CURRENT_ENV_KEY];

const API_ENDPOINTS = {
	activity: {
		getTypes: "/activity/getActivityTypes",
	},
	auth: {
		login: "/auth/login",
		logout: "/auth/logout",
		refresh: "/auth/refresh",
	},
	user: {
		userExists: "/user/getUserExists",
		getByLogin: "/user/getUserByLogin",
		getByID: "/user/getUserByID",
	},
	stats: {
		getPostWorkoutStats: "/stats/getPostWorkoutStats",
		getWeeklyStrengthStats: "/stats/getWeeklyStrengthStats",
		getWeeklyWalkStats: "/stats/getWeeklyWalkStats",
		getWeeklyCardioStats: "/stats/getWeeklyCardioStats",
		getWeeklyStretchStats: "/stats/getWeeklyStretchStats",
		getWeeklyTimedStats: "/stats/getWeeklyTimedStats",
		getWeeklyOtherStats: "/stats/getWeeklyOtherStats",
	},
	workouts: {
		skipWorkout: "/workouts/skipWorkout",
		logWorkout: "/workouts/logWorkout",
		getAll: "/workouts/getAllWorkouts",
		getOpen: "/workouts/getOpenWorkouts",
		getUserWorkouts: "/workouts/getUserWorkouts",
		getUserWorkoutsByDate: "/workouts/getUserWorkoutsByDate",
		getWorkoutDetails: "/workouts/getWorkoutDetails",
		getCategories: "/workouts/getWorkoutCategories",
		getWorkoutPlan: "/workouts/getWorkoutPlan",
		getWorkoutHistory: "/workouts/getWorkoutHistory",
		getWorkoutsAndRelated: "/workouts/getWorkoutsAndRelated",
		getWorkoutSummaryByDate: "/workouts/getWorkoutSummaryByDate",
		getSelectedWorkout: "/workouts/getSelectedWorkout",
		getActiveWorkout: "/workouts/getActiveWorkout",
		getTodaysWorkouts: "/workouts/getTodaysWorkouts",
		endWorkout: "/workouts/endWorkout",
		markAsDone: "/workouts/markWorkoutAsDone",
		undoMarkAsDone: "/workouts/undoMarkAsDone",
	},
	history: {
		getByID: "/history/getWorkoutHistoryByID",
		getByDate: "/history/getWorkoutHistoryByDate",
		getByRange: "/history/getHistoryByRange",
		getSelectedHistory: "/history/getSelectedHistory",
		getByRangeAndActivity: "/history/getHistoryByRangeAndType",
		getStrengthByRange: "/history/getStrengthHistoryByRange",
		getStretchByRange: "/history/getStretchHistoryByRange",
		getCardioByRange: "/history/getCardioHistoryByRange",
		getWalkByRange: "/history/getWalkHistoryByRange",
		getTimedByRange: "/history/getTimedHistoryByRange",
		getOtherByRange: "/history/getOtherHistoryByRange",
	},
	meds: {
		logMed: "/medications/logMedication",
		getPillSummaryByDate: "/medications/getPillSummary",
		getSummaryByDate: "/medications/getMedSummaryByDate",
		getSummariesByDate: "/medications/getMedSummariesByDate",
		getUserMeds: "/medications/getUserMeds",
		getMedDetails: "/medications/getMedDetails",
		getSelectedMed: "/medications/getSelectedMed",
		getMedLogsByRange: "/medications/getMedLogsByRange",
	},
	shared: {
		getSharedAppData: "/shared/getSharedAppData",
	},
	dashboard: {
		getSummary: "/dashboard/getDashboardSummary",
	},
	recentActivity: {
		getSummary: "/recentActivity/getRecentActivitySummary",
	},
};

export const {
	auth: authApis,
	user: userApis,
	stats: statsApis,
	activity: activityApis,
	workouts: workoutApis,
	shared: sharedApis,
	history: historyApis,
	meds: medicationApis,
	dashboard: dashboardApis,
	recentActivity: recentActivityApis,
} = API_ENDPOINTS;

export {
	BASE_URL as baseUrl,
	API_AUTH as apiAuth,
	CURRENT_ENV as currentEnv,
	CURRENT_ENV_KEY as currentEnvKey,
	API_ENDPOINTS as apiEndpoints,
};
