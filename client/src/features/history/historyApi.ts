import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	AllHistory,
	HistoryDetails,
	HistoryOfType,
	UpdateHistoryData,
} from "./types";
import {
	AwaitedResponse,
	UserRangeActivityParams,
	UserRangeParams,
} from "../types";
import {
	DeletedSessionData,
	fetchHistoryByRange,
	fetchHistoryByRangeAndActivity,
	fetchHistoryDetails,
	HistoryDetailsParams,
} from "../../utils/utils_history";
import {
	deleteWorkoutSession,
	editWorkoutHistory,
} from "../../utils/utils_history";
import { Activity } from "../shared/types";

interface DeletedSessionParams {
	userID: string;
	historyID: number;
	activityType: Activity;
}

type UpdateHistoryParams = {
	userID: string;
	data: UpdateHistoryData;
};

export const historyApi = createApi({
	reducerPath: "historyApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["History"],
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
			providesTags: () => [{ type: "History" }],
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
					},
				)) as AwaitedResponse<{ history: HistoryOfType[] }>;
				const data = response.Data;
				return { data: data.history };
			},
			providesTags: () => [{ type: "History" }],
		}),
		getHistoryDetails: builder.query<HistoryDetails, HistoryDetailsParams>({
			queryFn: async (params) => {
				const { userID, historyID, activityType } = params;
				const response = (await fetchHistoryDetails(
					userID,
					historyID,
					activityType,
				)) as AwaitedResponse<HistoryDetails>;
				const data = response.Data as HistoryDetails;
				return { data };
			},
			providesTags: () => [{ type: "History" }],
		}),
		deleteWorkoutSession: builder.mutation<
			DeletedSessionData,
			DeletedSessionParams
		>({
			queryFn: async (params) => {
				const { userID, historyID, activityType } = params;
				const response = (await deleteWorkoutSession(
					userID,
					historyID,
					activityType,
				)) as AwaitedResponse<DeletedSessionData>;
				const data = response.Data as DeletedSessionData;
				return { data };
			},
			invalidatesTags: () => [{ type: "History" }],
		}),
		editWorkoutHistory: builder.mutation<HistoryOfType, UpdateHistoryParams>({
			queryFn: async (params) => {
				const { userID, data } = params;
				const response = (await editWorkoutHistory(
					userID,
					data,
				)) as AwaitedResponse<HistoryOfType>;
				const newData = response.Data as HistoryOfType;
				return { data: newData };
			},
			invalidatesTags: () => [{ type: "History" }],
		}),
	}),
});

export const {
	useGetHistoryForRangeQuery,
	useGetHistoryByRangeAndTypeQuery,
	useGetHistoryDetailsQuery,
	useDeleteWorkoutSessionMutation,
	useEditWorkoutHistoryMutation,
} = historyApi;
