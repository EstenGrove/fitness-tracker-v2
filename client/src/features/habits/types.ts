import { WeekDay } from "../../utils/utils_dates";
import { habitIcons } from "../../utils/utils_habits";
import { RepeatType } from "../shared/types";

export type HabitIntent = "BUILD" | "ELIMINATE" | "REDUCE" | "LAPSE";

export type HabitFrequency = Omit<RepeatType, "None"> | "Custom";

export type HabitStatus =
	| "Not Started"
	| "On Track"
	| "Above Goal"
	| "Below Goal"
	| "Lapsed"
	| "Eliminated"
	| "Over Target";

export enum EHabitStatus {
	OK = "On Track", // Reached Goal minimum!
	ABOVE = "Above Goal",
	BELOW = "Below Goal",
	OVER = "Over Target",
	LAPSED = "Lapsed",
	ELIMINATED = "Eliminated",
	NONE = "Not Started",
}

export interface Habit {
	userID: string;
	habitID: number;
	habitName: string;
	habitDesc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	icon: keyof typeof habitIcons;
	iconColor: string;
	startDate: string;
	endDate: string | null;
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
	icon: keyof typeof habitIcons;
	iconColor: string;
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
	icon: keyof typeof habitIcons;
	iconColor: string;
	startDate: string;
	endDate: string | null;
}

export interface HabitCardInfo {
	userID: string;
	habitID: number;
	habitName: string;
	habitDesc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	habitsLogged: number; // current habit
	habitStatus: HabitStatus;
	maxStreak: string; // 3 (days|weeks|months)
	icon: keyof typeof habitIcons;
	iconColor: string;
	startDate: string;
	endDate: string | null;
}

export interface HabitSummary {
	habitID: number;
	startDate: string;
	endDate: string;
	habitGoal: number;
	maxStreak: number;
	habitIntent: HabitIntent;
	habitStatus: HabitStatus;
	totalLogged: number;
}

export interface HabitLogValues {
	userID: string;
	habitID: number;
	loggedAmount: number;
	notes: string;
	loggedAt: string;
}

export interface HabitDetails {
	habit: Habit;
	allLogs: HabitLog[];
	summary: HabitSummary;
	logsForRange: HabitLog[];
}

export interface HabitHistoryDay {
	habitID: number;
	metGoal: boolean;
	weekDay: WeekDay;
	loggedDate: string;
	totalLogged: number;
	goal: number;
}

export type HabitHistory = HabitHistoryDay[];

export interface HabitHistoryMonth {
	date: string;
	month: string;
	summary: HabitHistoryDay[];
}

export interface HabitWeekSummary {
	habit: Habit;
	summary: HabitHistoryDay[];
	dateRange: {
		startDate: string;
		endDate: string;
	};
}
export interface HabitMonthSummary {
	habit: Habit;
	summary: HabitHistoryDay[];
	dateRange: {
		startDate: string;
		endDate: string;
		monthStart: string;
		monthEnd: string;
	};
}
export interface HabitYearSummary {
	habit: Habit;
	summary: HabitHistoryDay[];
	dateRange: {
		startDate: string;
		endDate: string;
		yearStart: string;
		yearEnd: string;
	};
}
