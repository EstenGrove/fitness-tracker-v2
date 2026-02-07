import type { Activity } from "../types.js";
import { getCardioTrends } from "./getCardioTrends.js";
import { getOtherTrends } from "./getOtherTrends.js";
import { getStrengthTrends } from "./getStrengthTrends.js";
import { getStretchTrends } from "./getStretchTrends.js";
import { getTimedTrends } from "./getTimedTrends.js";
import { getWalkTrends } from "./getWalkTrends.js";

const getActivityTrends = async (
	userID: string,
	activityType: Activity,
	workoutID: number
) => {
	switch (activityType) {
		case "Strength": {
			return await getStrengthTrends(userID, workoutID);
		}
		case "Walk": {
			return await getWalkTrends(userID);
		}
		case "Stretch": {
			return await getStretchTrends(userID);
		}
		case "Cardio": {
			return await getCardioTrends(userID);
		}
		case "Timed": {
			return await getTimedTrends(userID);
		}
		case "Other": {
			return await getOtherTrends(userID);
		}

		default:
			throw new Error(`Invalid activity type: ${activityType}`);
	}
};

export { getActivityTrends };
