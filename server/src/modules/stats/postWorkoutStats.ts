import { statsService } from "../../services/index.js";
import type { PostWorkoutParams } from "./types.js";

const getPostWorkoutStats = async (params: PostWorkoutParams) => {
	const type = params.activityType;

	switch (type) {
		case "Strength": {
			const stats = await statsService.getPostWorkoutStrengthStats(params);
			return stats;
		}
		case "Cardio": {
			const stats = await statsService.getPostWorkoutCardioStats(params);
			return stats;
		}
		case "Stretch": {
			const stats = await statsService.getPostWorkoutStretchStats(params);
			return stats;
		}
		case "Walk": {
			const stats = await statsService.getPostWorkoutWalkStats(params);
			return stats;
		}
		case "Timed": {
			const stats = await statsService.getPostWorkoutTimedStats(params);
			return stats;
		}
		case "Other": {
			const stats = await statsService.getPostWorkoutOtherStats(params);
			return stats;
		}
		default:
			throw new Error(`Invalid activity type: ${type}`);
	}
};

const getPostWorkoutDetails = async (params: PostWorkoutParams) => {
	try {
		const details = await statsService.getPostWorkoutDetails(params);
		return details;
	} catch (error) {
		return error;
	}
};

export { getPostWorkoutStats, getPostWorkoutDetails };
