import { AI_ACTIVITY_INSIGHTS_PROMPT } from "../ai-insights/prompts.js";
import type { AIInsights } from "../ai-insights/types.js";
import { convertDataIntoMessage } from "../ai-insights/utils.js";
import type { DateRange } from "../types.js";
import type { WeeklyRecaps } from "./types.js";
import { generateText } from "ai";
import { AI_MODELS } from "../chat/models.js";

const { google } = AI_MODELS;

const getAIInsightsFromRecaps = async (recaps: WeeklyRecaps) => {
	const { oneWeekAgo, currentWeek } = recaps;
	const { activities: oneWeekAgoActivities } = oneWeekAgo;
	const { activities: currentWeekActivities } = currentWeek;

	const oneWeekAgoMessage = convertDataIntoMessage(oneWeekAgoActivities);
	const currentWeekMessage = convertDataIntoMessage(currentWeekActivities);

	const insights = await generateText({
		model: google,
		messages: [oneWeekAgoMessage, currentWeekMessage],
		system: AI_ACTIVITY_INSIGHTS_PROMPT,
	});

	console.log("AI Insights from Recaps:", insights?.text);

	return insights?.text;
};

export { getAIInsightsFromRecaps };
