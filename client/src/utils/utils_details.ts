import { StrengthHistory } from "../features/history/types";
import { PostWorkoutHistory } from "../features/stats/types";
import { StrengthSet, StrengthWorkout } from "../features/workouts/types";
import { WorkoutSet } from "./utils_workouts";

const formatDuration = (duration: number) => {
	const secs = ":00";
	const time = duration + secs;

	return time;
};

const getTotalDetailMins = (entry: PostWorkoutHistory) => {
	return entry.duration;
};

const getReps = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const reps = record.sets.reduce((total, item) => (total += item.reps), 0);
		return reps + "reps";
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.reps + "reps/set";
	}
};
const getSets = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const sets = record.sets.length || 0;
		return sets;
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.sets;
	}
};
const getWeight = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const weight = record.sets.reduce(
			(total, item) => (total = item.weight > total ? item.weight : total),
			0
		);
		return weight + "lbs.";
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.weight + "lbs.";
	}
};

const getSetsSummary = (sets: WorkoutSet[]) => {
	if (!sets || !sets.length) return [];
	const numOfSets = sets.length;
	// one set of X reps
	const setDescs: string[] = [];
	for (let i = 0; i < numOfSets; i++) {
		const set = sets[i];
		const setCount = set?.sets ?? 1;
		const reps = set.reps;
		let desc = `${setCount} set of ${reps} reps`;
		if ("weight" in set) {
			const weight = set.weight;
			desc += ` at ${weight} lbs.`;
		}
		setDescs.push(desc);
	}

	return setDescs;
};

const getTotalReps = (sets: StrengthSet[]): number => {
	if (!sets || !sets.length) return 0;
	const total = sets.reduce((total, set) => (total += Number(set.reps)), 0);

	return total;
};
const getTotalDetailsCalories = (entry: PostWorkoutHistory) => {
	const total = entry.calories ?? 0;

	return total.toFixed(2);
};

export {
	getTotalDetailMins,
	getTotalDetailsCalories,
	getWeight,
	getReps,
	getSets,
	getTotalReps,
	getSetsSummary,
	formatDuration,
};
