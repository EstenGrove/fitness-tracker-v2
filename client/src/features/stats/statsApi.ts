import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	getMinsSummaryForRange,
	getPostWorkoutDetails,
	getPostWorkoutStats,
	getWorkoutStats,
	MinsSummaryRangeResp,
} from "../../utils/utils_stats";
import { AwaitedResponse } from "../types";
import {
	PostWorkoutParams,
	PostWorkoutStats,
	PostWorkoutDetails,
	WorkoutStats,
	WorkoutStatsParams,
	TimeKey,
} from "./types";
import { getLastWorkout, LastSessionParams } from "../../utils/utils_workouts";
import { HistoryOfType } from "../history/types";

export const statsApi = createApi({
	reducerPath: "statsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["WorkoutStats"],
	endpoints: (builder) => ({
		getLastWorkout: builder.query<HistoryOfType, LastSessionParams>({
			queryFn: async (params) => {
				const response = (await getLastWorkout(params)) as AwaitedResponse<{
					lastSession: HistoryOfType;
				}>;
				const data = response.Data.lastSession as HistoryOfType;

				return { data };
			},
		}),
		getWorkoutStats: builder.query<WorkoutStats, WorkoutStatsParams>({
			queryFn: async (params) => {
				const response = (await getWorkoutStats(
					params
				)) as AwaitedResponse<WorkoutStats>;
				const data = response.Data as WorkoutStats;
				return { data };
			},
			providesTags: () => [{ type: "WorkoutStats" }],
		}),
		getPostWorkoutDetails: builder.query<PostWorkoutDetails, PostWorkoutParams>(
			{
				queryFn: async (params) => {
					const response = (await getPostWorkoutDetails(
						params
					)) as AwaitedResponse<PostWorkoutDetails>;
					const data = response.Data as PostWorkoutDetails;

					return { data };
				},
			}
		),
		getPostWorkoutStats: builder.query<PostWorkoutStats, PostWorkoutParams>({
			queryFn: async (params) => {
				const response = (await getPostWorkoutStats(
					params
				)) as AwaitedResponse<PostWorkoutStats>;
				const data = response.Data as PostWorkoutStats;
				return { data };
			},
			providesTags: () => [{ type: "WorkoutStats" }],
		}),
		getMinsSummaryForRange: builder.query({
			queryFn: async (params) => {
				const { userID, targetDate, rangeType } = params;
				const response = (await getMinsSummaryForRange(
					userID,
					targetDate,
					rangeType
				)) as AwaitedResponse<{ summary: MinsSummaryRangeResp<TimeKey>[] }>;
				const data = response.Data;
				return { data: data.summary };
			},
		}),
	}),
});

export const {
	useGetLastWorkoutQuery,
	useGetPostWorkoutStatsQuery,
	useGetPostWorkoutDetailsQuery,
	useLazyGetPostWorkoutDetailsQuery,
	useLazyGetPostWorkoutStatsQuery,
	useGetWorkoutStatsQuery,
	useGetMinsSummaryForRangeQuery,
} = statsApi;
