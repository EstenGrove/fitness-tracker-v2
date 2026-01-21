import { insightsService } from "../../services/index.js";
import type { WalkInsights } from "./types.js";

const getWalkInsights = async (
	userID: string
): Promise<WalkInsights | unknown> => {
	const insights = (await insightsService.getWalkInsights(
		userID
	)) as WalkInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getWalkInsights };
