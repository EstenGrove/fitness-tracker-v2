import { trendsService } from "../../services/index.js";

const getCardioTrends = async (userID: string) => {
	const data = await trendsService.getCardioTrends(userID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getCardioTrends };
