import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	createHabit,
	fetchHabitCards,
	fetchHabitDetails,
	fetchHabitSummaries,
	fetchRecentHabitLogs,
	HabitDetailParams,
	logHabit,
	NewHabitParams,
	RecentHabitParams,
} from "../../utils/utils_habits";
import {
	HabitCard,
	HabitDetails,
	HabitLog,
	HabitLogValues,
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
			invalidatesTags: ["HabitCards", "HabitLogs"],
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
} = habitsApi;
