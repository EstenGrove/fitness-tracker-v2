import { generateText } from "ai";
import { AI_MODELS } from "../chat/models.js";
import {
	getAIInsightsData,
	type AIInsightParams,
} from "./getAIInsightsData.js";
import type { Activity } from "../types.js";
import type { AIInsightsData } from "./types.js";
import { convertAInsightsDataToAIMessage } from "./utils.js";
import { AI_INSIGHTS_PROMPT } from "./prompts.js";

const { google } = AI_MODELS;

const getAIInsights = async <T extends Activity>(
	userID: string,
	params: AIInsightParams<T>
): Promise<AIInsightsData<T> | unknown> => {
	try {
		const insights = await getAIInsightsData(userID, params);
		const message = convertAInsightsDataToAIMessage(
			params.activityType,
			insights as AIInsightsData<T>
		);
		const result = await generateText({
			model: google,
			messages: [message],
			system: AI_INSIGHTS_PROMPT,
		});
		return {
			insightsData: insights,
			insightsMessage: result.text,
		};
	} catch (error) {
		return error;
	}
};

export { getAIInsights };
