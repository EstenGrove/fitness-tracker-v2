import type {
	ActivityCardio,
	ActivityCardioDB,
	ActivityCardioSummary,
	ActivityCardioSummaryDB,
} from "./types.ts";

const normalizeActivityCardio = (cardio: ActivityCardioDB): ActivityCardio => {
	const newCardio: ActivityCardio = {
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

const normalizeCardioSummary = (
	summary: ActivityCardioSummaryDB
): ActivityCardioSummary => {
	const { prev, current } = summary;
	const newPrev: ActivityCardio = normalizeActivityCardio(prev);
	const newCurrent: ActivityCardio = normalizeActivityCardio(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeActivityCardio, normalizeCardioSummary };
