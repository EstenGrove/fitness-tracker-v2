import { historyService } from "../../services/index.js";
import type { UpdateHistoryData } from "./types.js";

const editWorkoutHistory = async (data: UpdateHistoryData) => {
	try {
		const result = await historyService.updateWorkoutHistoryEntry(data);
		return result;
	} catch (error) {
		return error;
	}
};

export { editWorkoutHistory };
