import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	getRecapForRange,
	getWeeklyRecap,
} from "../../utils/utils_weeklyRecap";
import { AwaitedResponse, UserRangeParams } from "../types";
import { RecapForRange, WeeklyRecap } from "./types";

export const recapsApi = createApi({
	reducerPath: "recapsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["WeeklyRecap", "RangeRecap"],
	endpoints: (builder) => ({
		getWeeklyRecap: builder.query<WeeklyRecap, UserRangeParams>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const response = (await getWeeklyRecap(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<WeeklyRecap>;
				const data = response.Data as WeeklyRecap;

				return { data };
			},
			// providesTags: ["WeeklyRecap"],
		}),
		getRecapForRange: builder.query<RecapForRange, UserRangeParams>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const response = (await getRecapForRange(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<RecapForRange>;
				const data = response.Data as RecapForRange;

				return { data };
			},
			// providesTags: ["RangeRecap"],
		}),
	}),
});

export const { useGetWeeklyRecapQuery, useGetRecapForRangeQuery } = recapsApi;
