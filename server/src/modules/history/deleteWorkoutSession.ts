import type { Activity } from "../types.js";
import { historyService } from "../../services/index.js";

export type DeletedSessionDB = {
	was_deleted: boolean;
	history_id: number;
	activity_type: Activity;
};
export type DeletedSession = {
	wasDeleted: boolean;
	historyID: number;
	activityType: Activity;
};

export type DeletedSessionResp = Promise<DeletedSessionDB | unknown>;

const deleteWorkoutSession = async (
	userID: string,
	historyID: number,
	activityType: Activity
): DeletedSessionResp => {
	try {
		const response = await historyService.deleteWorkoutSession(
			userID,
			historyID,
			activityType
		);
		return response;
	} catch (error) {
		return error;
	}
};

export { deleteWorkoutSession };
