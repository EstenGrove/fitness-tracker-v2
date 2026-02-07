import { recapsService } from "../../services/index.js";
import type { StrengthRecap } from "./types.js";

const getStrengthRecap = async (
	userID: string,
	workoutID: number
): Promise<StrengthRecap | unknown> => {
	const recap = await recapsService.getStrengthRecap(userID, workoutID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getStrengthRecap };
