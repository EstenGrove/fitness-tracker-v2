import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAIStretchInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Stretch"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAIStretchInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAIStretchInsights };
