import { recentActivityService } from "../../services/index.js";
import type { ActivityRangeType, ActivitySummaryFor } from "./types.js";

interface ActivityForParams {
	targetDate: string;
	rangeType: ActivityRangeType;
}

export type ActivitySummaryResp = Promise<ActivitySummaryFor | unknown>;

const getRecentActivityFor = async (
	userID: string,
	params: ActivityForParams
): ActivitySummaryResp => {
	const { targetDate, rangeType } = params;

	switch (rangeType) {
		case "DAY": {
			const rawSummary = await recentActivityService.getDayActivity(
				userID,
				targetDate
			);
			return rawSummary;
		}
		case "WEEK": {
			const rawSummary = await recentActivityService.getWeeklyActivity(
				userID,
				targetDate
			);
			return rawSummary;
		}
		case "MONTH": {
			const rawSummary = await recentActivityService.getMonthlyActivity(
				userID,
				targetDate
			);
			return rawSummary;
		}
		case "QUARTER": {
			const rawSummary = await recentActivityService.getWeeklyActivity(
				userID,
				targetDate
			);
			return rawSummary;
		}
		case "YEAR": {
			const rawSummary = await recentActivityService.getYearlyActivity(
				userID,
				targetDate
			);
			return rawSummary;
		}
		default:
			throw new Error(`Invalid range type: ${rangeType}`);
	}
};

export { getRecentActivityFor };
