import {
	ActivitySummaryParams,
	ActivitySummaryFor,
} from "../features/recent-activity/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, recentActivityApis } from "./utils_env";

export type ActivitySummaryResp = AsyncResponse<ActivitySummaryFor>;

const fetchRecentActivitySummary = async (
	userID: string,
	params: ActivitySummaryParams
): ActivitySummaryResp => {
	const { targetDate, rangeType } = params;
	let url = currentEnv.base + recentActivityApis.getSummary;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ targetDate, rangeType });

	try {
		const request = await fetch(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchRecentActivitySummary };
