import type { Activity } from "../types.js";
import { getCardioRecapDetails } from "./getCardioRecapDetails.js";
import { getOtherRecapDetails } from "./getOtherRecapDetails.js";
import { getStrengthRecapDetails } from "./getStrengthRecapDetails.js";
import { getStretchRecapDetails } from "./getStretchRecapDetails.js";
import { getTimedRecapDetails } from "./getTimedRecapDetails.js";
import { getWalkRecapDetails } from "./getWalkRecapDetails.js";
import type { ActivityRecapDetails } from "./types.js";

/**
 * Returns the 'recap', 'trends' & 'insights' data for a given activity type
 * @param userID string
 * @param activityType string
 * @param workoutID number
 * @returns ActivityRecapDetails
 */

const getActivityRecapDetails = async (
	userID: string,
	activityType: Activity,
	workoutID: number
): Promise<ActivityRecapDetails | unknown> => {
	switch (activityType) {
		case "Strength": {
			return await getStrengthRecapDetails(userID, workoutID);
		}
		case "Walk": {
			return await getWalkRecapDetails(userID);
		}
		case "Stretch": {
			return await getStretchRecapDetails(userID);
		}
		case "Cardio": {
			return await getCardioRecapDetails(userID);
		}
		case "Timed": {
			return await getTimedRecapDetails(userID);
		}
		case "Other": {
			return await getOtherRecapDetails(userID);
		}

		default:
			throw new Error(`Invalid activity type: ${activityType}`);
	}
};

export { getActivityRecapDetails };
