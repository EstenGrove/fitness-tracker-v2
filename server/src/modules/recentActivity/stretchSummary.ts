import type {
	ActivityStretch,
	ActivityStretchDB,
	ActivityStretchSummary,
	ActivityStretchSummaryDB,
} from "./types.ts";

const normalizeActivityStretch = (
	cardio: ActivityStretchDB
): ActivityStretch => {
	const newCardio: ActivityStretch = {
		startDate: cardio.start_date,
		endDate: cardio.end_date,
		totalDuration: cardio.total_duration,
		totalReps: cardio.total_reps,
		totalWorkouts: cardio.total_workouts,
		avgDailyDuration: cardio.avg_daily_duration,
		avgDailyReps: cardio.avg_daily_reps,
	};

	return newCardio;
};

const normalizeStretchSummary = (
	summary: ActivityStretchSummaryDB
): ActivityStretchSummary => {
	const { prev, current } = summary;
	const newPrev: ActivityStretch = normalizeActivityStretch(prev);
	const newCurrent: ActivityStretch = normalizeActivityStretch(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeStretchSummary, normalizeActivityStretch };
