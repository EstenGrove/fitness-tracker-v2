import { recapsService } from "../../services/index.js";
import type { CardioRecap } from "./types.js";

const getCardioRecap = async (
	userID: string
): Promise<CardioRecap | unknown> => {
	const recap = await recapsService.getCardioRecap(userID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getCardioRecap };
