import { recapsAndDetailsService } from "../../services/index.js";
import type { StrengthRecapDetails } from "./types.js";

const getStrengthRecapDetails = async (
	userID: string,
	workoutID: number
): Promise<StrengthRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForStrength(
		userID,
		workoutID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getStrengthRecapDetails };
