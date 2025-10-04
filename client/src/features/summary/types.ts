import { WeekDay } from "../../utils/utils_dates";
import { Activity } from "../shared/types";

export type TotalMinsByActivity = {
	[key in Activity]?: number;
};

export interface WorkoutCalendarDay {
	date: string; // '2025-08-14'
	weekDay: WeekDay;
	metGoal: boolean;
	workoutsPerformed: number;
	workoutsScheduled: number;
	totalMinsPerformed: number;
	totalMinsScheduled: number;
	totalMinsByActivity: TotalMinsByActivity;
}
