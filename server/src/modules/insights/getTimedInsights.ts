import { insightsService } from "../../services/index.js";
import type { TimedInsights } from "./types.js";

const getTimedInsights = async (
	userID: string
): Promise<TimedInsights | unknown> => {
	const insights = (await insightsService.getTimedInsights(
		userID
	)) as TimedInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getTimedInsights };
