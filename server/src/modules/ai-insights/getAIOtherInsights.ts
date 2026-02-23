import { aiInsightsService } from "../../services/index.js";
import type { AIInsightsData } from "./types.js";

const getAIOtherInsights = async (
	userID: string,
	startDate: string,
	endDate: string
): Promise<AIInsightsData<"Other"> | unknown> => {
	try {
		const insights = await aiInsightsService.getAIOtherInsights(
			userID,
			startDate,
			endDate
		);
		return insights;
	} catch (error) {
		return error;
	}
};

export { getAIOtherInsights };
