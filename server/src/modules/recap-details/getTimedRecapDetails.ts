import { recapsAndDetailsService } from "../../services/index.js";
import type { TimedRecapDetails } from "./types.js";

const getTimedRecapDetails = async (
	userID: string
): Promise<TimedRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForTimed(
		userID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getTimedRecapDetails };
