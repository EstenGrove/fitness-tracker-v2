import type {
	ActivityStrength,
	ActivityStrengthDB,
	ActivityStrengthSummary,
	ActivityStrengthSummaryDB,
} from "./types.ts";

const normalizeActivityStrength = (
	strength: ActivityStrengthDB
): ActivityStrength => {
	const newStrength: ActivityStrength = {
		startDate: strength.start_date,
		endDate: strength.end_date,
		totalVolume: strength.total_volume,
		totalReps: strength.total_reps,
		totalWorkouts: strength.total_workouts,
		avgDailyVolume: strength.avg_daily_volume,
		avgDailyReps: strength.avg_daily_reps,
	};

	return newStrength;
};

const normalizeStrengthSummary = (
	summary: ActivityStrengthSummaryDB
): ActivityStrengthSummary => {
	const { prev, current } = summary;

	const newPrev: ActivityStrength = normalizeActivityStrength(prev);
	const newCurrent: ActivityStrength = normalizeActivityStrength(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeActivityStrength, normalizeStrengthSummary };
