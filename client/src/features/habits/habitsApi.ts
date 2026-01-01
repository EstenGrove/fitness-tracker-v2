import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	createHabit,
	deleteHabit,
	fetchHabitCards,
	fetchHabitDetails,
	fetchHabitHistory,
	fetchHabitHistoryForRange,
	fetchHabitHistorySummary,
	fetchHabitSummaries,
	fetchRecentHabitLogs,
	HabitDetailParams,
	HabitHistoryByRange,
	HabitHistoryByRangeParams,
	logHabit,
	NewHabitGoalData,
	NewHabitGoalParams,
	NewHabitParams,
	RecentHabitParams,
	saveHabitGoal,
} from "../../utils/utils_habits";
import {
	Habit,
	HabitCard,
	HabitDetails,
	HabitHistory,
	HabitLog,
	HabitLogValues,
	HabitYearSummary,
	RecentHabitLog,
} from "./types";
import { AwaitedResponse } from "../types";

export interface HabitParams {
	userID: string;
	habitID: number;
}
export interface HabitDateParams {
	userID: string;
	targetDate: string;
}

export interface HabitHistoryParams {
	userID: string;
	habitID: number;
	lastXDays: number;
}
export interface HabitHistorySummaryParams {
	userID: string;
	habitID: number;
	year: number;
}

export const habitsApi = createApi({
	reducerPath: "habitsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["HabitCards", "HabitDetails", "HabitLogs"],
	endpoints: (builder) => ({
		createHabit: builder.mutation<HabitCard, NewHabitParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await createHabit(
					userID,
					params
				)) as AwaitedResponse<{ newHabit: HabitCard }>;
				const data = response.Data as { newHabit: HabitCard };
				return { data: data.newHabit };
			},
			invalidatesTags: ["HabitCards"],
		}),
		getRecentHabitLogs: builder.query<RecentHabitLog[], RecentHabitParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchRecentHabitLogs(
					userID,
					params
				)) as AwaitedResponse<{ recentLogs: RecentHabitLog[] }>;
				const data = response.Data as { recentLogs: RecentHabitLog[] };
				console.log("data", data);
				return { data: data.recentLogs };
			},
			providesTags: () => [{ type: "HabitLogs" }],
		}),
		getHabitCards: builder.query<HabitCard[], HabitDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchHabitCards(
					userID,
					targetDate
				)) as AwaitedResponse<{ habits: HabitCard[] }>;
				const data = response.Data as { habits: HabitCard[] };
				return { data: data.habits };
			},
			providesTags: () => [{ type: "HabitCards" }],
		}),
		getHabitSummaries: builder.query({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = await fetchHabitSummaries(userID, targetDate);
				const data = response.Data;
				return { data };
			},
		}),
		getHabitDetails: builder.query<HabitDetails, HabitDetailParams>({
			queryFn: async (params) => {
				const { userID, habitID, targetDate } = params;
				const response = (await fetchHabitDetails(userID, {
					habitID,
					targetDate,
				})) as AwaitedResponse<HabitDetails>;
				const data = response.Data as HabitDetails;
				return { data };
			},
			providesTags: () => [{ type: "HabitDetails" }],
		}),
		logHabit: builder.mutation<HabitLog, HabitLogValues>({
			queryFn: async (params) => {
				const response = (await logHabit(params)) as AwaitedResponse<{
					newLog: HabitLog;
				}>;
				const data = response.Data as { newLog: HabitLog };
				return { data: data.newLog };
			},
			invalidatesTags: ["HabitCards", "HabitLogs", "HabitDetails"],
		}),
		getHabitHistory: builder.query<HabitHistory, HabitHistoryParams>({
			queryFn: async (params) => {
				const { userID, habitID, lastXDays = 60 } = params;
				const response = (await fetchHabitHistory(
					userID,
					habitID,
					lastXDays
				)) as AwaitedResponse<{ history: HabitHistory }>;
				const data = response.Data.history as HabitHistory;

				return { data };
			},
		}),
		getHabitHistorySummary: builder.query<
			HabitYearSummary,
			HabitHistorySummaryParams
		>({
			queryFn: async (params) => {
				const { userID, habitID, year } = params;
				const response = (await fetchHabitHistorySummary(
					userID,
					habitID,
					year
				)) as AwaitedResponse<HabitYearSummary>;
				const data = response.Data as HabitYearSummary;

				return { data };
			},
		}),
		getHabitHistoryForRange: builder.query<
			HabitHistoryByRange,
			HabitHistoryByRangeParams
		>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchHabitHistoryForRange(
					userID,
					params
				)) as AwaitedResponse<HabitHistoryByRange>;
				const data = response.Data as HabitHistoryByRange;

				return { data };
			},
		}),
		changeHabitGoal: builder.mutation<NewHabitGoalData, NewHabitGoalParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await saveHabitGoal(
					userID,
					params
				)) as AwaitedResponse<NewHabitGoalData>;
				const data = response.Data as NewHabitGoalData;

				return { data };
			},
		}),
		deleteHabit: builder.mutation<Habit, HabitParams>({
			queryFn: async (params) => {
				const { userID, habitID } = params;
				const response = (await deleteHabit(
					userID,
					habitID
				)) as AwaitedResponse<{ habit: Habit }>;
				const data = response.Data as { habit: Habit };

				return { data: data.habit };
			},
		}),
	}),
});

export const {
	useLogHabitMutation,
	useCreateHabitMutation,
	useGetHabitCardsQuery,
	useGetHabitSummariesQuery,
	useGetHabitDetailsQuery,
	useGetRecentHabitLogsQuery,
	useGetHabitHistoryQuery,
	useDeleteHabitMutation,
	useChangeHabitGoalMutation,
	useGetHabitHistorySummaryQuery,
	useGetHabitHistoryForRangeQuery,
	useLazyGetHabitHistoryForRangeQuery,
} = habitsApi;
