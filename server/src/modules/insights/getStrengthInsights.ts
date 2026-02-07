import { insightsService } from "../../services/index.js";
import type { StrengthInsights } from "./types.js";

const getStrengthInsights = async (
	userID: string,
	workoutID: number
): Promise<StrengthInsights | unknown> => {
	const insights = (await insightsService.getStrengthInsights(
		userID,
		workoutID
	)) as StrengthInsights;

	if (insights instanceof Error) {
		return insights;
	}

	return insights;
};

export { getStrengthInsights };
