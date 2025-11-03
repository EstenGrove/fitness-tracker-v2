import { chatService } from "../../services/index.js";
import type { DateRange } from "../types.js";

const getAIWorkoutSummary = async (userID: string, range: DateRange) => {
	const { startDate, endDate } = range;
	const data = await chatService.getAIWorkoutSummary(
		userID,
		startDate,
		endDate
	);

	return data;
};

export { getAIWorkoutSummary };
