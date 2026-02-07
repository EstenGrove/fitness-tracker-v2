import { insightsService } from "../../services/index.js";
import type { StretchInsights } from "./types.js";

const getStretchInsights = async (
	userID: string
): Promise<StretchInsights | unknown> => {
	const insights = (await insightsService.getStretchInsights(
		userID
	)) as StretchInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getStretchInsights };
