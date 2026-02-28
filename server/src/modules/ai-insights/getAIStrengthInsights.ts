import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAIStrengthInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Strength"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAIStrengthInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAIStrengthInsights };
