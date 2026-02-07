import type { Activity } from "../types.js";
import { getCardioInsights } from "./getCardioInsights.js";
import { getOtherInsights } from "./getOtherInsights.js";
import { getStrengthInsights } from "./getStrengthInsights.js";
import { getStretchInsights } from "./getStretchInsights.js";
import { getTimedInsights } from "./getTimedInsights.js";
import { getWalkInsights } from "./getWalkInsights.js";
import type { ActivityInsights } from "./types.js";

const getActivityInsights = async (
	userID: string,
	activityType: Activity,
	workoutID: number
): Promise<ActivityInsights | unknown> => {
	switch (activityType) {
		case "Strength": {
			return await getStrengthInsights(userID, workoutID);
		}
		case "Cardio": {
			return await getCardioInsights(userID);
		}
		case "Stretch": {
			return await getStretchInsights(userID);
		}
		case "Walk": {
			return await getWalkInsights(userID);
		}
		case "Timed": {
			return await getTimedInsights(userID);
		}
		case "Other": {
			return await getOtherInsights(userID);
		}

		default:
			throw new Error(`Invalid activity type: ${activityType}`);
	}
};

export { getActivityInsights };
