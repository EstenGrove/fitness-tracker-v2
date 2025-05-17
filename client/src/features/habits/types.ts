import { habitIcons } from "../../utils/utils_habits";
import { RepeatType } from "../shared/types";

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
	userID: string;
	habitID: number;
	habitName: string;
	habitDesc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	habitTarget: number;
	habitUnit: string;
	maxStreak: string; // 3 (days|weeks|months)
	habitsLogged: number; // current habit
	habitStatus: HabitStatus;
	icon: keyof typeof habitIcons;
	iconColor: string;
	startDate: string;
	endDate: string | null;
}
