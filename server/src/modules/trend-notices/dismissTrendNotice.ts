import { trendNoticesService } from "../../services/index.js";
import type { AITrendNotice } from "./types.js";

const dismissTrendNotice = async (
	userID: string,
	noticeID: string,
): Promise<AITrendNotice | Error> => {
	const result = await trendNoticesService.dismissNotice(userID, noticeID);

	if (result instanceof Error) return result;
	if (!result) return new Error(`Trend notice not found: ${noticeID}`);

	return result;
};

export { dismissTrendNotice };
