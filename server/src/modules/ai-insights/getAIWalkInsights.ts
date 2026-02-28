import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAIWalkInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Walk"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAIWalkInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAIWalkInsights };
