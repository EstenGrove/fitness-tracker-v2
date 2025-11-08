import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AwaitedResponse, MarkAsDoneParams, UserDateParams } from "../types";
import {
	CreatedWorkoutData,
	CreateWorkoutParams,
	TodaysWorkout,
	Workout,
} from "./types";
import {
	createNewWorkout,
	DeletedWorkoutDateData,
	deleteWorkoutDate,
	DeleteWorkoutDateParams,
	fetchAllUserWorkouts,
	fetchAllWorkouts,
	fetchSkippedWorkouts,
	fetchTodaysWorkouts,
	logWorkout,
	LogWorkoutParams,
	markWorkoutAsDone,
	skipWorkout,
	SkipWorkoutParams,
	WorkoutSet,
} from "../../utils/utils_workouts";
import { HistoryOfType, WorkoutHistory } from "../history/types";
import { Effort } from "../shared/types";

export interface MarkAsDonePayload {
	updatedWorkout: TodaysWorkout;
	history: WorkoutHistory[];
}

export interface SkippedResp {
	wasSkipped: boolean;
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

export interface LoggedWorkoutResponse {
	newLog: HistoryOfType;
}

export interface NewWorkoutParams {
	userID: string;
	newWorkout: CreateWorkoutParams;
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
		getAllUserWorkouts: builder.query<
			TodaysWorkout[],
			Pick<UserDateParams, "userID">
		>({
			queryFn: async ({ userID }) => {
				const response = (await fetchAllUserWorkouts(
					userID
				)) as AwaitedResponse<{
					workouts: TodaysWorkout[];
				}>;
				const data = response.Data as { workouts: TodaysWorkout[] };
				const workouts = data.workouts as TodaysWorkout[];

				return { data: workouts || [] };
			},
		}),
		getSkippedWorkouts: builder.query<TodaysWorkout[], UserDateParams>({
			queryFn: async ({ userID, targetDate }) => {
				const response = (await fetchSkippedWorkouts(
					userID,
					targetDate
				)) as AwaitedResponse<{
					workouts: TodaysWorkout[];
				}>;
				const workouts = response.Data.workouts as TodaysWorkout[];

				return { data: workouts || [] };
			},
		}),
		logWorkout: builder.mutation<HistoryOfType, LogWorkoutParams>({
			queryFn: async (params) => {
				const { userID, newLog } = params;
				const response = (await logWorkout(
					userID,
					newLog
				)) as AwaitedResponse<LoggedWorkoutResponse>;
				const data = response.Data as LoggedWorkoutResponse;

				return { data: data.newLog };
			},
			invalidatesTags: ["TodaysWorkouts"],
		}),
		skipWorkout: builder.mutation<SkippedResp, SkipWorkoutParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await skipWorkout(
					userID,
					params
				)) as AwaitedResponse<SkippedResp>;
				const data = response.Data as SkippedResp;

				return { data };
			},
			invalidatesTags: ["TodaysWorkouts"],
		}),
		deleteWorkout: builder.mutation<
			DeletedWorkoutDateData,
			DeleteWorkoutDateParams
		>({
			queryFn: async (params) => {
				const response = (await deleteWorkoutDate(
					params
				)) as AwaitedResponse<DeletedWorkoutDateData>;
				const data = response.Data as DeletedWorkoutDateData;

				return { data };
			},
		}),
		createWorkout: builder.mutation<CreatedWorkoutData, NewWorkoutParams>({
			queryFn: async (params) => {
				const { userID, newWorkout } = params;
				const response = (await createNewWorkout(
					userID,
					newWorkout
				)) as AwaitedResponse<CreatedWorkoutData>;
				const data = response.Data as CreatedWorkoutData;

				return { data };
			},
			invalidatesTags: ["TodaysWorkouts"],
		}),
	}),
});

export const {
	useGetAllUserWorkoutsQuery,
	useGetTodaysWorkoutsQuery,
	useGetSkippedWorkoutsQuery,
	useMarkAsDoneMutation,
	useGetAllWorkoutsQuery,
	useLogWorkoutMutation,
	useSkipWorkoutMutation,
	useCreateWorkoutMutation,
	useDeleteWorkoutMutation,
} = todaysWorkoutsApi;
