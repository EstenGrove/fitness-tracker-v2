import { weeklyRecapService } from "../../services/index.js";
import type { DateRange } from "../types.js";
import type { RecapForRange, WeeklyRecap } from "./types.js";

export type RecapForRangeResp = Promise<RecapForRange | unknown>;

const getRecapForRange = async (
	userID: string,
	range: DateRange
): RecapForRangeResp => {
	const result = await weeklyRecapService.getWeeklyRecap(userID, range);

	if (result instanceof Error) {
		return result;
	}

	return {
		...result,
		range: range,
	};
};

export { getRecapForRange };
