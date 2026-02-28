import type { Activity } from "../types.js";
import type { AIInsightsData } from "./types.js";
import { getAICardioInsights } from "./getAICardioInsights.js";
import { getAIStrengthInsights } from "./getAIStrengthInsights.js";
import { getAIStretchInsights } from "./getAIStretchInsights.js";
import { getAIWalkInsights } from "./getAIWalkInsights.js";
import { getAITimedInsights } from "./getAITimedInsights.js";
import { getAIOtherInsights } from "./getAIOtherInsights.js";

/**
 * Returns the AI-formatted insights data for a given activity type that will be plugged into the AI model
 */

export interface AIInsightParams<T extends Activity> {
	activityType: T;
	startDate: string;
	endDate: string;
}

const getAIInsightsData = async <T extends Activity>(
	userID: string,
	params: AIInsightParams<T>
): Promise<AIInsightsData<T> | unknown> => {
	const { activityType, startDate, endDate } = params;

	switch (activityType) {
		case "Strength": {
			return (await getAIStrengthInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Strength">;
		}
		case "Cardio": {
			return (await getAICardioInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Cardio">;
		}
		case "Stretch": {
			return (await getAIStretchInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Stretch">;
		}
		case "Walk": {
			return (await getAIWalkInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Walk">;
		}
		case "Timed": {
			return (await getAITimedInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Timed">;
		}
		case "Other": {
			return (await getAIOtherInsights(
				userID,
				startDate,
				endDate
			)) as AIInsightsData<"Other">;
		}
		default: {
			throw new Error(`Invalid activity type: ${activityType}`);
		}
	}
};

export { getAIInsightsData };
