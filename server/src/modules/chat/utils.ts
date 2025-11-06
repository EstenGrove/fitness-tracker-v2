import { chatService } from "../../services/index.js";
import type { DateRange } from "../types.js";

const getAIWorkoutSummary = async (userID: string, range: DateRange) => {
	const { startDate, endDate } = range;

	try {
		const data = await chatService.getAIWorkoutSummary(
			userID,
			startDate,
			endDate
		);

		return data;
	} catch (error) {
		return error;
	}
};
const getAICaloriesSummary = async (userID: string, range: DateRange) => {
	const { startDate = "2025-08-01", endDate = "2025-11-04" } = range;

	const data = (await chatService.getAICaloriesSummary(
		userID,
		startDate,
		endDate
	)) as Array<object>;

	if (data.length <= 0) {
		return {
			calories: [],
			note: "No workouts found for this range: " + startDate + "-" + endDate,
		};
	}

	return {
		calories: data,
		note: "",
	};
};

export { getAIWorkoutSummary, getAICaloriesSummary };
