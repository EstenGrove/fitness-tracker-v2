import type { Activity } from "../types.js";
import type { AIInsightsData, AIInsightsForAllActivities } from "./types.js";
import type { ModelMessage } from "ai";

const convertAInsightsDataToAIMessage = (
	activityType: Activity,
	data: AIInsightsData<Activity>
) => {
	const text = `
    Activity Type: ${activityType}
    Current Period Metrics: ${JSON.stringify(data.current, null, 2)}
    Previous Period Metrics: ${JSON.stringify(data.previous, null, 2)}

    Analyze the current period metrics and compare them to the previous period metrics.
  `;

	const newMessage = {
		role: "user",
		content: text,
	};

	return newMessage as ModelMessage;
};

const convertAllAIInsightsDataToAIMessage = (
	data: AIInsightsForAllActivities
) => {
	const newMessage = {
		role: "user",
		content: JSON.stringify(data, null, 2),
	};

	return newMessage as ModelMessage;
};

const convertDataIntoMessage = (data: any) => {
	const newMessage = {
		role: "user",
		content: JSON.stringify(data, null, 2),
	};

	return newMessage as ModelMessage;
};

export {
	convertAInsightsDataToAIMessage,
	convertAllAIInsightsDataToAIMessage,
	convertDataIntoMessage,
};
