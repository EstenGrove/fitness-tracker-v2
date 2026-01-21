import { recapsAndDetailsService } from "../../services/index.js";
import type { StretchRecapDetails } from "./types.js";

const getStretchRecapDetails = async (
	userID: string
): Promise<StretchRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForStretch(
		userID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getStretchRecapDetails };
