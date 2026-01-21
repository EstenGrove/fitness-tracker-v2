import { recapsService } from "../../services/index.js";
import type { TimedRecap } from "./types.js";

const getTimedRecap = async (userID: string): Promise<TimedRecap | unknown> => {
	const recap = await recapsService.getTimedRecap(userID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getTimedRecap };
