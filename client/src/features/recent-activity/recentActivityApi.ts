import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { fetchRecentActivitySummary } from "../../utils/utils_recentActivity";
import { ActivitySummaryFor, ActivitySummaryParams } from "./types";
import { AwaitedResponse } from "../types";

type RecentSummary = ActivitySummaryFor;
type RecentParams = ActivitySummaryParams;

export const recentActivityApi = createApi({
	reducerPath: "recentActivityApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getActivitySummary: builder.query<RecentSummary, RecentParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchRecentActivitySummary(
					userID,
					params
				)) as AwaitedResponse<ActivitySummaryFor>;
				const data = response.Data as ActivitySummaryFor;

				return { data: data };
			},
		}),
	}),
});

export const { useGetActivitySummaryQuery } = recentActivityApi;
