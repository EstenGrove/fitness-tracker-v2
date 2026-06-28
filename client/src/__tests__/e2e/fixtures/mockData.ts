import type { CurrentUser, CurrentSession } from "../../../features/user/types";
import type { DashboardSummary } from "../../../features/dashboard/types";

// Fake JWT that won't be verified in tests (far-future exp)
export const FAKE_JWT =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
	".eyJ1c2VySUQiOiJ0ZXN0LXVzZXItMSIsImV4cCI6OTk5OTk5OTk5OX0" +
	".fake_signature_for_tests_only";

export const mockUser: CurrentUser = {
	userID: "test-user-1",
	username: "testuser",
	password: "",
	firstName: "Test",
	lastName: "User",
	userAvatar: null,
	isActive: true,
	createdDate: "2024-01-01",
	lastLoginDate: "2026-06-28",
	token: FAKE_JWT,
};

export const mockSession: CurrentSession = {
	token: FAKE_JWT,
	userID: "test-user-1",
	sessionID: "test-session-1",
	expiry: "2099-01-01",
	lastRefreshedDate: "2026-06-28",
};

const emptyDay = (date: string, weekDay: string) => ({ date, weekDay });

export const mockDashboardSummary: DashboardSummary = {
	dailyMins: [
		{ ...emptyDay("2026-06-22", "Sun"), mins: 30 },
		{ ...emptyDay("2026-06-23", "Mon"), mins: 45 },
		{ ...emptyDay("2026-06-24", "Tue"), mins: 0 },
		{ ...emptyDay("2026-06-25", "Wed"), mins: 60 },
		{ ...emptyDay("2026-06-26", "Thu"), mins: 20 },
		{ ...emptyDay("2026-06-27", "Fri"), mins: 35 },
		{ ...emptyDay("2026-06-28", "Sat"), mins: 0 },
	],
	dailySteps: [
		{ ...emptyDay("2026-06-22", "Sun"), steps: 5000 },
		{ ...emptyDay("2026-06-23", "Mon"), steps: 8000 },
		{ ...emptyDay("2026-06-24", "Tue"), steps: 3000 },
		{ ...emptyDay("2026-06-25", "Wed"), steps: 10000 },
		{ ...emptyDay("2026-06-26", "Thu"), steps: 6000 },
		{ ...emptyDay("2026-06-27", "Fri"), steps: 7500 },
		{ ...emptyDay("2026-06-28", "Sat"), steps: 0 },
	],
	dailyCalories: [
		{ ...emptyDay("2026-06-22", "Sun"), calories: 300 },
		{ ...emptyDay("2026-06-23", "Mon"), calories: 450 },
		{ ...emptyDay("2026-06-24", "Tue"), calories: 0 },
		{ ...emptyDay("2026-06-25", "Wed"), calories: 600 },
		{ ...emptyDay("2026-06-26", "Thu"), calories: 200 },
		{ ...emptyDay("2026-06-27", "Fri"), calories: 350 },
		{ ...emptyDay("2026-06-28", "Sat"), calories: 0 },
	],
	dailyWorkouts: [
		{ ...emptyDay("2026-06-22", "Sun"), workouts: 1 },
		{ ...emptyDay("2026-06-23", "Mon"), workouts: 2 },
		{ ...emptyDay("2026-06-24", "Tue"), workouts: 0 },
		{ ...emptyDay("2026-06-25", "Wed"), workouts: 3 },
		{ ...emptyDay("2026-06-26", "Thu"), workouts: 1 },
		{ ...emptyDay("2026-06-27", "Fri"), workouts: 1 },
		{ ...emptyDay("2026-06-28", "Sat"), workouts: 0 },
	],
	totalWorkouts: {
		startDate: "2026-06-22",
		endDate: "2026-06-28",
		totalWorkouts: 8,
	},
	totalMiles: {
		startDate: "2026-06-22",
		endDate: "2026-06-28",
		totalMiles: 12.5,
	},
	totalSteps: {
		startDate: "2026-06-22",
		endDate: "2026-06-28",
		totalSteps: 39500,
	},
	recentWorkouts: [],
	workoutProgress: {
		todaysCalories: 0,
		todaysScheduled: 2,
		todaysLogged: 0,
		todaysLogs: [],
	},
	habitProgress: {
		todaysHabits: 3,
		todaysSummaries: [],
		todaysLogs: [],
	},
};

// Wrap any data in the server's TResponse envelope
export const wrapResponse = <T>(data: T) => ({
	Status: "FULFILLED",
	Data: data,
	Message: "Success",
	ErrorMsg: null,
	StackTrace: null,
});
