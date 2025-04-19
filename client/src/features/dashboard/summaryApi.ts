import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { fetchDashboardSummary } from "../../utils/utils_dashboard";
import { AwaitedResponse, UserRangeParams } from "../types";
import { DashboardSummary } from "./types";

export const summaryApi = createApi({
	reducerPath: "summaryApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getDashboardSummary: builder.query<DashboardSummary, UserRangeParams>({
			queryFn: async (params) => {
				const { userID, startDate, endDate } = params;
				const range = { startDate, endDate };
				const response = (await fetchDashboardSummary(
					userID,
					range
				)) as AwaitedResponse<DashboardSummary>;
				const data = response.Data as DashboardSummary;

				return { data };
			},
		}),
	}),
});

export const { useGetDashboardSummaryQuery } = summaryApi;
