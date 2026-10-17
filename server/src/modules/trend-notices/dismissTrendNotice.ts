import { trendNoticesService } from "../../services/index.js";
import type { AITrendNotice } from "./types.js";

const dismissTrendNotice = async (
	userID: string,
	noticeID: string,
	dismissedAt: string,
): Promise<AITrendNotice | Error> => {
	const result = await trendNoticesService.dismissNotice(
		userID,
		noticeID,
		dismissedAt,
	);

	if (result instanceof Error) return result;
	if (!result) return new Error(`Trend notice not found: ${noticeID}`);

	return result;
};

export { dismissTrendNotice };
