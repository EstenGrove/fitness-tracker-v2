import { habitsService } from "../../services/index.js";
import type { HabitYearSummary } from "./types.js";

const getHabitHistorySummary = async (
	userID: string,
	habitID: number,
	year: number
) => {
	const summary = (await habitsService.getHabitYearSummary(
		userID,
		habitID,
		year
	)) as HabitYearSummary;

	if (summary instanceof Error) {
		return summary;
	}

	return summary as HabitYearSummary;
};

export { getHabitHistorySummary };
