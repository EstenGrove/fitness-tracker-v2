import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAICardioInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Cardio"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAICardioInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAICardioInsights };
