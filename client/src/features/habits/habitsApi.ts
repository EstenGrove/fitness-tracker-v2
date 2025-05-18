import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	fetchHabitDetails,
	fetchHabitSummaries,
	HabitDetailParams,
	logHabit,
} from "../../utils/utils_habits";
import { HabitDetails, HabitLog, HabitLogValues } from "./types";
import { AwaitedResponse } from "../types";

export interface HabitParams {
	userID: string;
	habitID: number;
}

export const habitsApi = createApi({
	reducerPath: "habitsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getHabitSummaries: builder.query({
			queryFn: async (params) => {
				const response = await fetchHabitSummaries(params);
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
		}),
		logHabit: builder.mutation<HabitLog, HabitLogValues>({
			queryFn: async (params) => {
				const response = (await logHabit(params)) as AwaitedResponse<{
					newLog: HabitLog;
				}>;
				const data = response.Data as { newLog: HabitLog };
				return { data: data.newLog };
			},
		}),
	}),
});

export const {
	useLogHabitMutation,
	useGetHabitSummariesQuery,
	useGetHabitDetailsQuery,
} = habitsApi;
