import { weeklyRecapService } from "../../services/index.js";
import type { DateRange } from "../types.js";
import type { WeeklyRecaps } from "./types.js";

export type WeeklyRecapsResp = Promise<WeeklyRecaps | unknown>;

const getWeeklyRecaps = async (
	userID: string,
	range: DateRange
): WeeklyRecapsResp => {
	const result = await weeklyRecapService.getWeeklyRecaps(userID, range);

	if (result instanceof Error) {
		return result;
	}

	return result as WeeklyRecaps;
};

export { getWeeklyRecaps };
