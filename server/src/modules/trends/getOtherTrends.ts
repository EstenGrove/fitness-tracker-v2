import { trendsService } from "../../services/index.js";

const getOtherTrends = async (userID: string) => {
	const data = await trendsService.getOtherTrends(userID);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

export { getOtherTrends };
