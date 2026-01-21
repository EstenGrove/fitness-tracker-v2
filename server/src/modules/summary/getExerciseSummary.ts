import { summaryService } from "../../services/index.js";
import type { DateRange } from "../types.js";

export interface ExerciseSummaryDB {
	start_date: string;
	end_date: string;
	total_workouts: number;
	total_mins: number;
	total_steps: number;
	total_calories: number;
	avg_mins_per_day: number;
	avg_steps_per_day: number;
	avg_calories_per_day: number;
}

export interface ExerciseSummary {
	dateRange: DateRange;
	summary: {
		totalWorkouts: number;
		totalMins: number;
		totalSteps: number;
		totalCalories: number;
		avgMinsPerDay: number;
		avgStepsPerDay: number;
		avgCaloriesPerDay: number;
	};
}

const getExerciseSummaryForRange = async (
	userID: string,
	range: DateRange
): Promise<ExerciseSummary | unknown> => {
	const summaryDB = (await summaryService.getExerciseSummaryForRange(
		userID,
		range
	)) as ExerciseSummaryDB;

	if (summaryDB instanceof Error) {
		return summaryDB;
	}

	const exerciseSummary: ExerciseSummary = {
		dateRange: { startDate: summaryDB.start_date, endDate: summaryDB.end_date },
		summary: {
			totalWorkouts: summaryDB.total_workouts,
			totalMins: summaryDB.total_mins,
			totalSteps: summaryDB.total_steps,
			totalCalories: summaryDB.total_calories,
			avgMinsPerDay: summaryDB.avg_mins_per_day,
			avgStepsPerDay: summaryDB.avg_steps_per_day,
			avgCaloriesPerDay: summaryDB.avg_calories_per_day,
		},
	};

	return exerciseSummary;
};

export { getExerciseSummaryForRange };
