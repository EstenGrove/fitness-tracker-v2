import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AwaitedResponse, MarkAsDoneParams, UserDateParams } from "../types";
import { TodaysWorkout, Workout } from "./types";
import {
	fetchAllWorkouts,
	fetchTodaysWorkouts,
	markWorkoutAsDone,
	WorkoutSet,
} from "../../utils/utils_workouts";
import { WorkoutHistory } from "../history/types";
import { Effort } from "../shared/types";

export interface MarkAsDonePayload {
	updatedWorkout: TodaysWorkout;
	history: WorkoutHistory[];
}

export interface MarkAsDoneValues {
	duration: number;
	startTime: string;
	endTime: string;
	workoutDate: string;
	effort: Effort;
	sets: WorkoutSet[];
	steps: number;
	miles: number;
	pace: number;
	exercise: string;
}

export const todaysWorkoutsApi = createApi({
	reducerPath: "todaysWorkoutsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["TodaysWorkouts"],
	endpoints: (builder) => ({
		getTodaysWorkouts: builder.query<TodaysWorkout[], UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchTodaysWorkouts(
					userID,
					targetDate
				)) as AwaitedResponse<{ workouts: TodaysWorkout[] }>;
				const workouts = response.Data.workouts as TodaysWorkout[];

				return { data: workouts || [] };
			},
			providesTags: () => [{ type: "TodaysWorkouts" }],
		}),
		markAsDone: builder.mutation<MarkAsDonePayload, MarkAsDoneParams>({
			queryFn: async (params) => {
				const { userID, details } = params;
				const response = (await markWorkoutAsDone(
					userID,
					details
				)) as AwaitedResponse<{
					updatedWorkout: TodaysWorkout;
					history: WorkoutHistory[];
				}>;
				const data = response.Data as {
					updatedWorkout: TodaysWorkout;
					history: WorkoutHistory[];
				};
				return { data };
			},
			invalidatesTags: ["TodaysWorkouts"],
		}),
		getAllWorkouts: builder.query<Workout[], Pick<UserDateParams, "userID">>({
			queryFn: async ({ userID }) => {
				const response = (await fetchAllWorkouts(userID)) as AwaitedResponse<{
					workouts: Workout[];
				}>;
				const workouts = response.Data.workouts as Workout[];

				return { data: workouts || [] };
			},
		}),
	}),
});

export const {
	useGetTodaysWorkoutsQuery,
	useMarkAsDoneMutation,
	useGetAllWorkoutsQuery,
} = todaysWorkoutsApi;
