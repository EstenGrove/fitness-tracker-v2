import { insightsService } from "../../services/index.js";
import type { OtherInsights } from "./types.js";

const getOtherInsights = async (
	userID: string
): Promise<OtherInsights | unknown> => {
	const insights = (await insightsService.getOtherInsights(
		userID
	)) as OtherInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getOtherInsights };
