import { trendsService } from "../../services/index.js";

const getWalkTrends = async (userID: string) => {
	const data = await trendsService.getWalkTrends(userID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getWalkTrends };
