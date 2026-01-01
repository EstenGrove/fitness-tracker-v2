import { weeklyRecapService } from "../../services/index.js";
import type { DateRange } from "../types.js";
import type { WeeklyRecap } from "./types.js";

export type WeeklyRecapResp = Promise<WeeklyRecap | unknown>;

const getWeeklyRecap = async (
	userID: string,
	range: DateRange
): WeeklyRecapResp => {
	const result = await weeklyRecapService.getWeeklyRecap(userID, range);

	if (result instanceof Error) {
		return result;
	}

	return result;
};

export { getWeeklyRecap };
