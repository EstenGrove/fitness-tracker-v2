import { recapsService } from "../../services/index.js";
import type { WalkRecap } from "./types.js";

const getWalkRecap = async (userID: string): Promise<WalkRecap | unknown> => {
	const recap = await recapsService.getWalkRecap(userID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getWalkRecap };
