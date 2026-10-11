import { AILatestTrendNotice, DismissedTrendNotice } from "./types";
import { AwaitedResponse } from "../types";
import { currentEnv } from "../../utils/utils_env";
import {
	DismissedTrendNoticeResp,
	dismissTrendNotice,
	DismissTrendParams,
	getLatestTrendNotice,
} from "../../utils/utils_aiTrends";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type LatestTrendNoticeData = { notice?: AILatestTrendNotice | null };
type DismissedTrendNoticeData = {
	dismissedNotice?: DismissedTrendNotice | null;
};

export const aiTrendsApi = createApi({
	reducerPath: "aiTrendsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getLatestTrendNotice: builder.query<AILatestTrendNotice | null, string>({
			queryFn: async (userID: string) => {
				const response = (await getLatestTrendNotice(
					userID,
				)) as AwaitedResponse<LatestTrendNoticeData>;
				// Server responds w/ { Data: { notice } }; 'notice' is null when there's nothing to show
				const { notice } = (response?.Data ?? {}) as LatestTrendNoticeData;
				return { data: notice ?? null };
			},
		}),
		dismissTrendNotice: builder.mutation<
			DismissedTrendNoticeData,
			DismissTrendParams & { userID: string }
		>({
			queryFn: async (params) => {
				const { userID, ...trendParams } = params;
				const response = (await dismissTrendNotice(
					userID,
					trendParams,
				)) as AwaitedResponse<DismissedTrendNoticeResp>;
				const data = response.Data as DismissedTrendNoticeData;
				return { data: data ?? null };
			},
		}),
	}),
});

export const { useGetLatestTrendNoticeQuery, useDismissTrendNoticeMutation } =
	aiTrendsApi;
