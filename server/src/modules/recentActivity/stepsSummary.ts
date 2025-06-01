import type {
	ActivitySteps,
	ActivityStepsDB,
	ActivityStepsSummaryDB,
} from "./types.js";

const normalizeActivitySteps = (steps: ActivityStepsDB): ActivitySteps => {
	const newSteps: ActivitySteps = {
		startDate: steps.start_date,
		endDate: steps.end_date,
		avgDailyMiles: steps.avg_daily_miles,
		avgDailySteps: steps.avg_daily_steps,
		totalMiles: steps.total_miles,
		totalSteps: steps.total_steps,
		totalWorkouts: steps.total_workouts,
	};

	return newSteps;
};

const normalizeStepsSummary = (summary: ActivityStepsSummaryDB) => {
	const { prev, current } = summary;

	const newPrev: ActivitySteps = normalizeActivitySteps(prev);

	const newCurrent: ActivitySteps = normalizeActivitySteps(current);

	return {
		prev: newPrev,
		current: newCurrent,
	};
};

export { normalizeActivitySteps, normalizeStepsSummary };
