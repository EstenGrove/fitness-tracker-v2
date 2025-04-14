import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AllHistory, HistoryOfType } from "./types";
import {
	AwaitedResponse,
	UserRangeActivityParams,
	UserRangeParams,
} from "../types";
import {
	fetchHistoryByRange,
	fetchHistoryByRangeAndActivity,
} from "../../utils/utils_history";

export const historyApi = createApi({
	reducerPath: "historyApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getHistoryForRange: builder.query<AllHistory, UserRangeParams>({
			queryFn: async (params: UserRangeParams) => {
				const { userID, startDate, endDate } = params;
				const response = (await fetchHistoryByRange(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<AllHistory>;
				const data = response.Data as AllHistory;

				return { data };
			},
		}),
		getHistoryByRangeAndType: builder.query({
			queryFn: async (params: UserRangeActivityParams) => {
				const { userID, activityType, startDate, endDate } = params;
				const response = (await fetchHistoryByRangeAndActivity(
					userID,
					activityType,
					{
						startDate,
						endDate,
					}
				)) as AwaitedResponse<{ history: HistoryOfType[] }>;
				const data = response.Data;
				return { data: data.history };
			},
		}),
	}),
});

export const { useGetHistoryForRangeQuery, useGetHistoryByRangeAndTypeQuery } =
	historyApi;
