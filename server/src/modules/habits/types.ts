import type { RepeatType } from "../types.ts";

export type HabitIntent = "BUILD" | "ELIMINATE" | "REDUCE" | "LAPSE";

export type HabitFrequency = Omit<RepeatType, "None"> | "Custom";

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
export interface HabitDB {
	user_id: string;
	habit_id: number;
	habit_name: string;
	habit_desc: string;
	intent: HabitIntent;
	frequency: HabitFrequency;
	target_value: number;
	target_unit: string;
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
