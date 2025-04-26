import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { fetchDashboardSummary } from "../../utils/utils_dashboard";
import { AwaitedResponse, UserDateParams } from "../types";
import { DashboardSummary } from "./types";

export const summaryApi = createApi({
	reducerPath: "summaryApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getDashboardSummary: builder.query<DashboardSummary, UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchDashboardSummary(
					userID,
					targetDate
				)) as AwaitedResponse<DashboardSummary>;
				const data = response.Data as DashboardSummary;

				return { data };
			},
		}),
	}),
});

export const { useGetDashboardSummaryQuery } = summaryApi;
