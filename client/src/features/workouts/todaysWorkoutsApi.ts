import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	AwaitedResponse,
	MarkAsDoneParams,
	UserDateParams,
	UserRangeParams,
} from "../types";
import {
	CreatedWorkoutData,
	CreateWorkoutParams,
	RecurringWorkoutData,
	TodaysWorkout,
	Workout,
	WorkoutDetails,
} from "./types";
import {
	createNewWorkout,
	DeletedWorkoutDateData,
	deleteWorkoutDate,
	DeleteWorkoutDateParams,
	editWorkout,
	EditWorkoutValues,
	fetchAllUserWorkouts,
	fetchAllWorkoutDetails,
	fetchAllWorkouts,
	fetchScheduledWorkouts,
	fetchScheduledWorkoutsByDate,
	fetchSkippedWorkouts,
	fetchTodaysUnscheduledWorkouts,
	fetchTodaysWorkouts,
	getRecurringWorkoutData,
	GroupedScheduledWorkouts,
	logWorkout,
	LogWorkoutParams,
	markWorkoutAsDone,
	ScheduledWorkoutsData,
	ScheduledWorkoutsGrouped,
	skipWorkout,
	SkipWorkoutParams,
	WorkoutSet,
} from "../../utils/utils_workouts";
import { HistoryOfType, WorkoutHistory } from "../history/types";
import { Activity, Effort } from "../shared/types";
import { historyApi } from "../history/historyApi";

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

export interface EditedWorkoutParams {
	userID: string;
	workout: EditWorkoutValues;
}
export interface RecurringDataParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
}
export interface DetailsParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
}

export const todaysWorkoutsApi = createApi({
	reducerPath: "todaysWorkoutsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["TodaysWorkouts", "UnscheduledWorkouts"],
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
		getTodaysUnscheduledWorkouts: builder.query<
			TodaysWorkout[],
			UserDateParams
		>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchTodaysUnscheduledWorkouts(
					userID,
					targetDate
				)) as AwaitedResponse<{ workouts: TodaysWorkout[] }>;
				const workouts = response.Data.workouts as TodaysWorkout[];

				return { data: workouts || [] };
			},
			providesTags: ["UnscheduledWorkouts"],
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
			invalidatesTags: ["TodaysWorkouts", "UnscheduledWorkouts"],
		}),
		getScheduledWorkouts: builder.query<TodaysWorkout[], UserRangeParams>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const response = (await fetchScheduledWorkouts(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<ScheduledWorkoutsData>;
				const data = response.Data as ScheduledWorkoutsData;
				const { workouts } = data;

				return { data: workouts };
			},
			providesTags: ["UnscheduledWorkouts"],
		}),
		getScheduledWorkoutsGrouped: builder.query<
			ScheduledWorkoutsGrouped,
			UserRangeParams
		>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const response = (await fetchScheduledWorkoutsByDate(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<GroupedScheduledWorkouts>;
				const data = response.Data as GroupedScheduledWorkouts;
				const { workouts } = data;

				// { "2025-11-08": [...], "2025-11-09": [...], ...rest }
				return { data: workouts };
			},
			providesTags: ["UnscheduledWorkouts"],
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
			invalidatesTags: ["TodaysWorkouts", "UnscheduledWorkouts"],
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					// Invalidate History tag after successful logWorkout
					dispatch(historyApi.util.invalidateTags(["History"]));
				} catch {
					// If the mutation fails, don't invalidate
				}
			},
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
			invalidatesTags: ["TodaysWorkouts", "UnscheduledWorkouts"],
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
			invalidatesTags: ["TodaysWorkouts", "UnscheduledWorkouts"],
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
			invalidatesTags: ["TodaysWorkouts", "UnscheduledWorkouts"],
		}),
		editWorkout: builder.mutation<TodaysWorkout, EditedWorkoutParams>({
			queryFn: async (params) => {
				const { userID, workout } = params;
				const response = await editWorkout(userID, workout);
				const newWorkout = response.Data.workout as TodaysWorkout;
				return { data: newWorkout };
			},
		}),
		getRecurringWorkoutData: builder.query<
			RecurringWorkoutData,
			RecurringDataParams
		>({
			queryFn: async (params) => {
				const { userID, workoutID, activityType } = params;
				const response = await getRecurringWorkoutData(userID, {
					workoutID,
					activityType,
				});
				const data = response.Data as RecurringWorkoutData;
				return { data: data };
			},
		}),
		getWorkoutDetails: builder.query<WorkoutDetails, DetailsParams>({
			queryFn: async (params) => {
				const { userID, workoutID, activityType } = params;
				const response = (await fetchAllWorkoutDetails(
					userID,
					workoutID,
					activityType
				)) as AwaitedResponse<WorkoutDetails>;
				const data = response.Data as WorkoutDetails;

				return { data };
			},
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
	useEditWorkoutMutation,
	useGetWorkoutDetailsQuery,
	useGetScheduledWorkoutsQuery,
	useGetRecurringWorkoutDataQuery,
	useGetScheduledWorkoutsGroupedQuery,
	useGetTodaysUnscheduledWorkoutsQuery,
} = todaysWorkoutsApi;
