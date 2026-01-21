import { recapsAndDetailsService } from "../../services/index.js";
import type { OtherRecapDetails } from "./types.js";

const getOtherRecapDetails = async (
	userID: string
): Promise<OtherRecapDetails | unknown> => {
	const details = await recapsAndDetailsService.getRecapAndTrendsForOther(
		userID
	);

	if (details instanceof Error) {
		return details;
	}

	return details;
};

export { getOtherRecapDetails };
