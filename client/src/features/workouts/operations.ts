import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	fetchAllWorkouts,
	fetchWorkoutDetails,
} from "../../utils/utils_workouts";
import { Activity } from "../shared/types";
import { AwaitedResponse } from "../types";
import { Workout, WorkoutDetails } from "./types";

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

const getAllWorkouts = createAsyncThunk(
	"workouts/getAllWorkouts",
	async (userID: string) => {
		// This function can be implemented to fetch all workouts for a user
		const response = (await fetchAllWorkouts(userID)) as AwaitedResponse<{
			workouts: Workout[];
		}>;
		const data = response.Data;
		return data.workouts as Workout[];
	}
);

export { getWorkoutDetails, getAllWorkouts };
