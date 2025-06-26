import { workoutsService } from "../../services/index.js";
import {
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../history/allHistory.js";
import type { HistoryOfType, HistoryOfTypeDB } from "../history/types.js";
import type { Activity } from "../types.js";
import type { LogWorkoutBody } from "./types.js";

const logWorkout = async (values: LogWorkoutBody) => {
	const type: Activity = values.activityType;

	switch (type) {
		case "Strength": {
			return (await workoutsService.logStrength(values)) as HistoryOfTypeDB;
		}
		case "Stretch": {
			return (await workoutsService.logStretch(values)) as HistoryOfTypeDB;
		}
		case "Cardio": {
			return (await workoutsService.logCardio(values)) as HistoryOfTypeDB;
		}
		case "Walk": {
			return (await workoutsService.logWalk(values)) as HistoryOfTypeDB;
		}
		case "Timed": {
			return (await workoutsService.logTimed(values)) as HistoryOfTypeDB;
		}
		case "Other": {
			return (await workoutsService.logOther(values)) as HistoryOfTypeDB;
		}
		default:
			throw new Error(`Invalid activity type: ${type}`);
	}
};

const normalizeWorkoutLog = (log: HistoryOfTypeDB): HistoryOfType => {
	const type = log.activity_type as Activity;
	const newLog = normalizeHistoryEntryByType(type, log);

	return newLog;
};

export { logWorkout, normalizeWorkoutLog };
