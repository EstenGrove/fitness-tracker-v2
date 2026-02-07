import { trendsService } from "../../services/index.js";

const getStrengthTrends = async (userID: string, workoutID: number) => {
	const data = await trendsService.getStrengthTrends(userID, workoutID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getStrengthTrends };
