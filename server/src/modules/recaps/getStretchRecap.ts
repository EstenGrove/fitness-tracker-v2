import { recapsService } from "../../services/index.js";
import type { StretchRecap } from "./types.js";

const getStretchRecap = async (
	userID: string
): Promise<StretchRecap | unknown> => {
	const recap = await recapsService.getStretchRecap(userID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getStretchRecap };
