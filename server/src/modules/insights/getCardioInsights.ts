import { insightsService } from "../../services/index.js";
import type { CardioInsights } from "./types.js";

const getCardioInsights = async (
	userID: string
): Promise<CardioInsights | unknown> => {
	const insights = (await insightsService.getCardioInsights(
		userID
	)) as CardioInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getCardioInsights };
