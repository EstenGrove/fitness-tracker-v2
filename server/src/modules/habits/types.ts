import type { RepeatType } from "../types.js";

export type HabitIntent = "BUILD" | "ELIMINATE" | "REDUCE" | "LAPSE";

export type HabitFrequency = Omit<RepeatType, "None"> | "Custom";

export type HabitStatus =
	| "On Track"
	| "Above Goal"
	| "Below Goal"
	| "Lapsed"
	| "Eliminated";

export interface Habit {
	userID: string;
	habitID: number;
	habitName: string;
	habitDesc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	icon: string;
	iconColor: string;
	startDate: string;
	endDate: string | null;
	isActive: boolean;
	createdDate: string;
}
export interface HabitDB {
	user_id: string;
	habit_id: number;
	habit_name: string;
	habit_desc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	target_value: number;
	target_unit: string;
	icon: string;
	icon_color: string;
	start_date: string;
	end_date: string | null;
	isActive: boolean;
	createdDate: string;
}
export interface HabitLog {
	logID: number;
	habitID: number;
	logTime: string;
	loggedValue: number;
	notes: string;
	createdDate: string;
}
export interface HabitLogDB {
	log_id: number;
	habit_id: number;
	log_time: string;
	logged_value: number;
	notes: string;
	created_date: string;
}
export interface HabitLogValues {
	userID: string;
	habitID: number;
	loggedAmount: number;
	notes: string;
	loggedAt: string;
}
export interface HabitDetailParams {
	userID: string;
	habitID: number;
	targetDate: string;
}

export interface HabitSummaryDB {
	start_date: string;
	end_date: string;
	habit_goal: number;
	max_streak: number;
	habit_intent: HabitIntent;
	habit_status: HabitStatus;
	total_logged: number;
}
export interface HabitSummary {
	startDate: string;
	endDate: string;
	habitGoal: number;
	maxStreak: number;
	habitIntent: HabitIntent;
	habitStatus: HabitStatus;
	totalLogged: number;
}

export interface HabitDetailsDB {
	habit: HabitDB;
	allLogs: HabitLogDB[];
	summary: HabitSummaryDB;
	logsForRange: HabitLogDB[];
}
export interface HabitDetails {
	habit: Habit;
	allLogs: HabitLog[];
	summary: HabitSummary;
	logsForRange: HabitLog[];
}

export interface HabitCardDB {
	user_id: string;
	habit_id: number;
	habit_name: string;
	habit_desc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habit_target: number;
	habit_unit: string;
	habits_logged: number; // current habit
	max_streak: string; // 3 (days|weeks|months)
	icon: string;
	icon_color: string;
	start_date: string;
	end_date: string | null;
}
export interface HabitCard {
	userID: string;
	habitID: number;
	habitName: string;
	habitDesc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	habitsLogged: number; // current habit
	maxStreak: string; // 3 (days|weeks|months)
	icon: string;
	iconColor: string;
	startDate: string;
	endDate: string | null;
}

export interface NewHabitValues {
	habitName: string;
	habitDesc: string;
	habitTarget: string;
	habitUnit: string;
	intent: HabitIntent | string;
	frequency: HabitFrequency | string;
	startDate: string;
	endDate: string | null;
	icon: string;
	iconColor: string;
}

export interface RecentHabitLogDB {
	log_id: number;
	habit_id: number;
	habit_name: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	target_value: number;
	target_unit: string;
	unit_desc: string;
	log_time: string;
	logged_value: number;
	notes: string;
	created_date: string;
	icon: string;
	icon_color: string;
}
export interface RecentHabitLog {
	logID: number;
	habitID: number;
	habitName: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	unitDesc: string;
	logTime: string;
	loggedValue: number;
	notes: string;
	createdDate: string;
	icon: string;
	iconColor: string;
}

export interface HabitHistoryDay {
	date: string;
	habitID: number;
	habitTarget: number;
	habitValue: number;
	percentage: number;
	reachedGoal: boolean;
}
export interface HabitHistoryDayDB {
	date: string;
	habit_id: number;
	total_logged: number;
	percentage: number;
	target_value: number;
	reached_goal: boolean;
}

export type HabitHistory = HabitHistoryDay[];
export type HabitHistoryDB = HabitHistoryDayDB[];

export type WeekDay =
	| "Sunday"
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday";

export interface HabitSummaryItem {
	habitID: number;
	metGoal: boolean;
	weekDay: WeekDay;
	loggedDate: string;
	totalLogged: number;
	goal: number;
}

export interface HabitWeekSummary {
	habit: Habit;
	summary: HabitSummaryItem[];
	dateRange: {
		startDate: string;
		endDate: string;
	};
}
export interface HabitMonthSummary {
	habit: Habit;
	summary: HabitSummaryItem[];
	dateRange: {
		startDate: string;
		endDate: string;
		monthStart: string;
		monthEnd: string;
	};
}

export interface HabitYearSummary {
	habit: Habit;
	summary: HabitSummaryItem[];
	dateRange: {
		startDate: string;
		endDate: string;
		yearStart: string;
		yearEnd: string;
	};
}

export interface HabitHistoryForRangeDB {
	habit: HabitDB;
	history: HabitLogDB[];
	summary: Array<HabitSummaryItem[]>;
}
export interface HabitHistoryForRange {
	habit: Habit;
	history: HabitLog[];
	summary: HabitSummaryItem[];
}

export interface HabitGoalHistoryDB {
	user_id: string;
	habit_id: number;
	habit_intent: HabitIntent;
	habit_goal: number;
	habit_unit: string;
	start_date: string;
	end_date: string;
}
export interface HabitGoalHistory {
	userID: string;
	habitID: number;
	habitIntent: HabitIntent;
	habitGoal: number;
	habitUnit: string;
	startDate: string;
	endDate: string;
}
