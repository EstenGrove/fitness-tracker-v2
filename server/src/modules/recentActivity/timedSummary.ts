import type {
	ActivityTimed,
	ActivityTimedDB,
	ActivityTimedSummary,
	ActivityTimedSummaryDB,
} from "./types.ts";

const normalizeActivityTimed = (timed: ActivityTimedDB): ActivityTimed => {
	const newTimed: ActivityTimed = {
		startDate: timed.start_date,
		endDate: timed.end_date,
		totalDuration: timed.total_duration,
		totalReps: timed.total_reps,
		totalWorkouts: timed.total_workouts,
		avgDailyDuration: timed.avg_daily_duration,
		avgDailyReps: timed.avg_daily_reps,
	};

	return newTimed;
};

const normalizeTimedSummary = (
	summary: ActivityTimedSummaryDB
): ActivityTimedSummary => {
	const { prev, current } = summary;
	const newPrev: ActivityTimed = normalizeActivityTimed(prev);
	const newCurrent: ActivityTimed = normalizeActivityTimed(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeTimedSummary, normalizeActivityTimed };
