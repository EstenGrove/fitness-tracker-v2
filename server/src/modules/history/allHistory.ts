import type { Activity } from "../types.js";
import type {
	AllHistory,
	AllHistoryDB,
	CardioHistory,
	CardioHistoryDB,
	HistoryOfType,
	HistoryOfTypeDB,
	OtherHistory,
	OtherHistoryDB,
	StrengthHistory,
	StrengthHistoryDB,
	StretchHistory,
	StretchHistoryDB,
	TimedHistory,
	TimedHistoryDB,
	WalkHistory,
	WalkHistoryDB,
} from "./types.js";

const normalizeWalkHistory = (entry: WalkHistoryDB): WalkHistory => {
	const client: WalkHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		steps: entry.steps,
		miles: entry.miles,
		pace: entry.pace,
	};

	return client;
};
const normalizeStrengthHistory = (
	entry: StrengthHistoryDB
): StrengthHistory => {
	const client: StrengthHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		sets: entry.sets,
	};

	return client;
};
const normalizeCardioHistory = (entry: CardioHistoryDB): CardioHistory => {
	const client: CardioHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		sets: entry.sets,
		exercise: entry.exercise,
	};

	return client;
};
const normalizeStretchHistory = (entry: StretchHistoryDB): StretchHistory => {
	const client: StretchHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		reps: entry.reps,
	};

	return client;
};
const normalizeTimedHistory = (entry: TimedHistoryDB): TimedHistory => {
	const client: TimedHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		sets: entry.sets,
		exercise: entry.exercise,
	};

	return client;
};
const normalizeOtherHistory = (entry: OtherHistoryDB): OtherHistory => {
	const client: OtherHistory = {
		userID: entry.user_id,
		historyID: entry.history_id,
		workoutID: entry.workout_id,
		activityType: entry.activity_type,
		workoutDate: entry.workout_date,
		workoutName: entry.workout_name,
		startTime: entry.start_time,
		endTime: entry.end_time,
		effort: entry.effort,
		duration: entry.duration,
		targetDuration: entry.target_duration,
		calories: entry.calories,
		createdDate: entry.created_date,
		sets: entry.sets,
		exercise: entry.exercise,
	};

	return client;
};

const normalizeHistoryByType = (
	type: Activity,
	history: HistoryOfTypeDB[]
): HistoryOfType[] => {
	if (!history || !type) return [];

	switch (type) {
		case "Strength": {
			const records = history.map((entry) =>
				normalizeStrengthHistory(entry as StrengthHistoryDB)
			);
			return records;
		}
		case "Cardio": {
			const records = history.map((entry) =>
				normalizeCardioHistory(entry as CardioHistoryDB)
			);
			return records;
		}
		case "Walk": {
			const records = history.map((entry) =>
				normalizeWalkHistory(entry as WalkHistoryDB)
			);
			return records;
		}
		case "Stretch": {
			const records = history.map((entry) =>
				normalizeStretchHistory(entry as StretchHistoryDB)
			);
			return records;
		}
		case "Timed": {
			const records = history.map((entry) =>
				normalizeTimedHistory(entry as TimedHistoryDB)
			);
			return records;
		}
		case "Other": {
			const records = history.map((entry) =>
				normalizeOtherHistory(entry as OtherHistoryDB)
			);
			return records;
		}

		default:
			throw new Error(`Invalid activity type: ${type}`);
	}
};

const normalizeHistoryEntryByType = (
	type: Activity,
	history: HistoryOfTypeDB
): HistoryOfType => {
	if (!type || !history) return {} as HistoryOfType;

	switch (type) {
		case "Strength": {
			const entry = normalizeStrengthHistory(history as StrengthHistoryDB);
			return {
				...entry,
				activityType: "Strength",
			};
		}
		case "Cardio": {
			const entry = normalizeCardioHistory(history as CardioHistoryDB);
			return {
				...entry,
				activityType: "Cardio",
			};
		}
		case "Walk": {
			const entry = normalizeWalkHistory(history as WalkHistoryDB);
			return {
				...entry,
				activityType: "Walk",
			};
		}
		case "Stretch": {
			const entry = normalizeStretchHistory(history as StretchHistoryDB);
			return {
				...entry,
				activityType: "Stretch",
			};
		}
		case "Timed": {
			const entry = normalizeTimedHistory(history as TimedHistoryDB);
			return {
				...entry,
				activityType: "Timed",
			};
		}
		case "Other": {
			const entry = normalizeOtherHistory(history as OtherHistoryDB);
			return {
				...entry,
				activityType: "Other",
			};
		}

		default:
			throw new Error(`Invalid activity type: ${type}`);
	}
};

const normalizeAllHistory = (allHistory: AllHistoryDB): AllHistory => {
	const { all, strength, stretch, cardio, walk, timed, other } = allHistory;

	const allRecords = all.map((entry) =>
		normalizeHistoryEntryByType(entry.activity_type, entry)
	);
	const newStrength = normalizeHistoryByType("Strength", strength);
	const newStretch = normalizeHistoryByType("Stretch", stretch);
	const newCardio = normalizeHistoryByType("Cardio", cardio);
	const newWalk = normalizeHistoryByType("Walk", walk);
	const newTimed = normalizeHistoryByType("Timed", timed);
	const newOther = normalizeHistoryByType("Other", other);

	const newAll: AllHistory = {
		all: allRecords,
		strength: newStrength as StrengthHistory[],
		stretch: newStretch as StretchHistory[],
		cardio: newCardio as CardioHistory[],
		walk: newWalk as WalkHistory[],
		timed: newTimed as TimedHistory[],
		other: newOther as OtherHistory[],
	};

	return newAll;
};

export {
	normalizeWalkHistory,
	normalizeStretchHistory,
	normalizeStrengthHistory,
	normalizeCardioHistory,
	normalizeTimedHistory,
	normalizeOtherHistory,
	// all types
	normalizeAllHistory,
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
};
