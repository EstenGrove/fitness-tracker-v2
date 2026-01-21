import { recapsService } from "../../services/index.js";
import type { OtherRecap } from "./types.js";

const getOtherRecap = async (userID: string): Promise<OtherRecap | unknown> => {
	const recap = await recapsService.getOtherRecap(userID);

	if (recap instanceof Error) {
		return recap;
	}

	return recap;
};

export { getOtherRecap };
