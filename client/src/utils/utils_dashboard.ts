import { DashboardSummary } from "../features/dashboard/types";
import { AsyncResponse, DateRange } from "../features/types";
import { dashboardApis, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type DashboardSummaryResp = AsyncResponse<DashboardSummary>;

const fetchDashboardSummary = async (
	userID: string,
	targetDate: string
): DashboardSummaryResp => {
	let url = currentEnv.base + dashboardApis.getSummary;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchDashboardSummaryByRange = async (
	userID: string,
	dateRange: DateRange
): DashboardSummaryResp => {
	const { startDate, endDate } = dateRange;
	let url = currentEnv.base + dashboardApis.getSummary;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ startDate, endDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchDashboardSummary, fetchDashboardSummaryByRange };
