import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AITrendNotice } from "./types";

export const aiTrendsApi = createApi({
	reducerPath: "aiTrendsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getLatestTrendNotice: builder.query<AITrendNotice, string>({
			query: (userID) => `/aiTrends/getLatestTrendNotice?userID=${userID}`,
		}),
	}),
});

export const { useGetLatestTrendNoticeQuery } = aiTrendsApi;
