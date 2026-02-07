import { recapsAndDetailsService } from "../../services/index.js";
import type { WalkRecapDetails } from "./types.js";

const getWalkRecapDetails = async (
	userID: string
): Promise<WalkRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForWalk(
		userID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getWalkRecapDetails };
