import type {
	EditCardioPartial,
	EditOtherPartial,
	EditStrengthPartial,
	EditStretchPartial,
	EditTimedPartial,
	EditWalkPartial,
	EditWorkoutParams,
	EditWorkoutPartial,
} from "./types.js";

const editStrengthWorkout = async (data: EditStrengthPartial) => {
	const { startTime, endTime, duration, effort, workoutSets } = data;
};

const editCardioWorkout = async (data: EditCardioPartial) => {
	// do stuff
};

const editStretchWorkout = async (data: EditStretchPartial) => {
	// do stuff
};

const editWalkWorkout = async (data: EditWalkPartial) => {
	// do stuff
};

const editTimedWorkout = async (data: EditTimedPartial) => {
	// do stuff
};

const editOtherWorkout = async (data: EditOtherPartial) => {
	// do stuff
};

const editWorkout = async (data: EditWorkoutPartial) => {
	const { activityType } = data;
	switch (activityType) {
		case "Strength":
			return await editStrengthWorkout(data as EditStrengthPartial);
		case "Cardio":
			return await editCardioWorkout(data as EditCardioPartial);
		case "Stretch":
			return await editStretchWorkout(data as EditStretchPartial);
		case "Walk":
			return await editWalkWorkout(data as EditWalkPartial);
		case "Timed":
			return await editTimedWorkout(data as EditTimedPartial);
		case "Other":
			return await editOtherWorkout(data as EditOtherPartial);
		default:
			throw new Error(`Unknown activity type: ${activityType}`);
	}
};

export { editWorkout };
