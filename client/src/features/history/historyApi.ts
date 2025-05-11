import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AllHistory, HistoryDetails, HistoryOfType } from "./types";
import {
	AwaitedResponse,
	UserRangeActivityParams,
	UserRangeParams,
} from "../types";
import {
	fetchHistoryByRange,
	fetchHistoryByRangeAndActivity,
	fetchHistoryDetails,
	HistoryDetailsParams,
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
		getHistoryDetails: builder.query<HistoryDetails, HistoryDetailsParams>({
			queryFn: async (params) => {
				const { userID, historyID, activityType } = params;
				const response = (await fetchHistoryDetails(
					userID,
					historyID,
					activityType
				)) as AwaitedResponse<HistoryDetails>;
				const data = response.Data as HistoryDetails;
				return { data };
			},
		}),
	}),
});

export const {
	useGetHistoryForRangeQuery,
	useGetHistoryByRangeAndTypeQuery,
	useGetHistoryDetailsQuery,
} = historyApi;
