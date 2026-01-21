import { trendsService } from "../../services/index.js";

const getStretchTrends = async (userID: string) => {
	const data = await trendsService.getStretchTrends(userID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getStretchTrends };
