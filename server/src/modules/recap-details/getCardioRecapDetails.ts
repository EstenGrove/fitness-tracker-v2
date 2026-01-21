import { recapsAndDetailsService } from "../../services/index.js";
import type { CardioRecapDetails } from "./types.js";

const getCardioRecapDetails = async (
	userID: string
): Promise<CardioRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForCardio(
		userID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getCardioRecapDetails };
