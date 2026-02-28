import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAITimedInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Timed"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAITimedInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAITimedInsights };
