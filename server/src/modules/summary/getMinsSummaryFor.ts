import { statsService } from "../../services/index.ts";
import type { MinSummaryParams } from "../../services/StatsService.ts";

const getMonthlyMins = async (userID: string, targetDate: string) => {
	const data = await statsService.getMonthlyMins(userID, targetDate);
};

const getMinsSummaryFor = async (params: MinSummaryParams) => {
	const { userID, targetDate, rangeType } = params;

	switch (rangeType) {
		case "Daily": {
			return;
		}
		case "Weekly": {
			return;
		}
		case "Monthly": {
			const resp = await getMonthlyMins(userID, targetDate);
			return resp;
		}
		case "Yearly": {
			return;
		}

		default:
			throw new Error("Invalid range type: " + rangeType);
	}
};
