import { Activity } from "../features/shared/types";
import { aiInsightsApis, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface AIInsightsParams {
	userID: string;
	activityType: Activity;
	startDate: string;
	endDate: string;
}

const getAIInsights = async (params: AIInsightsParams) => {
	const { userID, activityType, startDate, endDate } = params;
	let url = currentEnv.base + aiInsightsApis.getAIInsights;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ startDate, endDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { getAIInsights };
