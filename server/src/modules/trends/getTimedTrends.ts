import { trendsService } from "../../services/index.js";

const getTimedTrends = async (userID: string) => {
	const data = await trendsService.getTimedTrends(userID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getTimedTrends };
