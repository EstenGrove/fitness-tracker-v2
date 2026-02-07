import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	getRecapForRange,
	getWeeklyRecap,
	getWeeklyRecaps,
} from "../../utils/utils_weeklyRecap";
import { AwaitedResponse, UserRangeParams } from "../types";
import { RecapForRange, WeeklyRecap, WeeklyRecaps } from "./types";

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
		getWeeklyRecaps: builder.query<WeeklyRecaps, UserRangeParams>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const response = (await getWeeklyRecaps(userID, {
					startDate,
					endDate,
				})) as AwaitedResponse<WeeklyRecaps>;
				const data = response.Data as WeeklyRecaps;

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

export const {
	useGetWeeklyRecapQuery,
	useGetWeeklyRecapsQuery,
	useGetRecapForRangeQuery,
} = recapsApi;
