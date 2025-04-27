import type {
	ActivityOther,
	ActivityOtherDB,
	ActivityOtherSummary,
	ActivityOtherSummaryDB,
} from "./types.ts";

const normalizeActivityOther = (other: ActivityOtherDB): ActivityOther => {
	const newOther: ActivityOther = {
		startDate: other.start_date,
		endDate: other.end_date,
		totalDuration: other.total_duration,
		totalReps: other.total_reps,
		totalWorkouts: other.total_workouts,
		avgDailyDuration: other.avg_daily_duration,
		avgDailyReps: other.avg_daily_reps,
	};

	return newOther;
};

const normalizeOtherSummary = (
	summary: ActivityOtherSummaryDB
): ActivityOtherSummary => {
	const { prev, current } = summary;
	const newPrev: ActivityOther = normalizeActivityOther(prev);
	const newCurrent: ActivityOther = normalizeActivityOther(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeOtherSummary, normalizeActivityOther };
