import type { Activity } from "../types.js";
import { getStrengthRecap } from "./getStrengthRecap.js";
import { getCardioRecap } from "./getCardioRecap.js";
import { getStretchRecap } from "./getStretchRecap.js";
import { getWalkRecap } from "./getWalkRecap.js";
import { getTimedRecap } from "./getTimedRecap.js";
import { getOtherRecap } from "./getOtherRecap.js";

import type { ActivityRecap } from "./types.js";

const getActivityRecap = async (
	userID: string,
	activityType: Activity,
	workoutID: number
): Promise<ActivityRecap | unknown> => {
	switch (activityType) {
		case "Strength": {
			return await getStrengthRecap(userID, workoutID);
		}
		case "Cardio": {
			return await getCardioRecap(userID);
		}
		case "Stretch": {
			return await getStretchRecap(userID);
		}
		case "Walk": {
			return await getWalkRecap(userID);
		}
		case "Timed": {
			return await getTimedRecap(userID);
		}
		case "Other": {
			return await getOtherRecap(userID);
		}

		default:
			throw new Error(`Invalid activity type: ${activityType}`);
	}
};

export { getActivityRecap };
