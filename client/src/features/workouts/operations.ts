import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWorkoutDetails } from "../../utils/utils_workouts";
import { Activity } from "../shared/types";
import { AwaitedResponse } from "../types";
import { WorkoutDetails } from "./types";

export interface WorkoutDetailsParams {
	userID: string;
	workoutID: number;
	activityType: string;
}

const getWorkoutDetails = createAsyncThunk(
	"workouts/getWorkoutDetails",
	async (params: WorkoutDetailsParams) => {
		const { userID, workoutID, activityType } = params;
		const type = activityType as Activity; // Assuming Activity is a type defined elsewhere
		const response = (await fetchWorkoutDetails(
			userID,
			workoutID,
			type
		)) as AwaitedResponse<WorkoutDetails>;
		const data = response.Data as WorkoutDetails;

		return data as WorkoutDetails;
	}
);

export { getWorkoutDetails };
