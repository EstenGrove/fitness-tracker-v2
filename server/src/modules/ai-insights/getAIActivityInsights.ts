import { generateText } from "ai";
import type { DateRange } from "../types.js";
import { AI_MODELS } from "../chat/models.js";
import { aiInsightsService } from "../../services/index.js";
import { AI_ACTIVITY_INSIGHTS_PROMPT } from "./prompts.js";
import type { AIInsights, AIInsightsForAllActivities } from "./types.js";
import {
	convertAInsightsDataToAIMessage,
	convertAllAIInsightsDataToAIMessage,
} from "./utils.js";

const { google } = AI_MODELS;

/**
 * Gets an AI insights summary for ALL activities for a given date range.
 * @returns The AI insights summary text for all activities
 */
const getAIActivityInsights = async (
	userID: string,
	range: DateRange
): Promise<AIInsights | unknown> => {
	const { startDate, endDate } = range;
	// Get the insights for the activity
	const insightsData = await aiInsightsService.getAIActivityInsights(
		userID,
		startDate,
		endDate
	);

	const message = convertAllAIInsightsDataToAIMessage(
		insightsData as AIInsightsForAllActivities
	);

	const insights = await generateText({
		model: google,
		messages: [message],
		system: AI_ACTIVITY_INSIGHTS_PROMPT,
	});

	return {
		insightsData: insightsData,
		insightsMessage: insights.text,
	};
};

export { getAIActivityInsights };
