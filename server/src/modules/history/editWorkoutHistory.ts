import type { UpdateHistoryData } from "../../services/HistoryService.js";
import { historyService } from "../../services/index.js";

const editWorkoutHistory = async (data: UpdateHistoryData) => {
	const hasFields = data?.activityType && data?.userID && data?.historyID;
	if (!hasFields)
		throw new Error(
			`'activityType', 'userID' & 'historyID' are required fields!`
		);

	const result = await historyService.updateWorkoutHistoryEntry(data);
	// normalize the 'result'

	if (result instanceof Error) {
		return result;
	}

	return result;
};

export { editWorkoutHistory };
