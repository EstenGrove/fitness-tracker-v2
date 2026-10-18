import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AwaitedResponse } from "../types";
import { currentEnv } from "../../utils/utils_env";
import {
	getTrendCategory,
	getTrendsOverview,
} from "../../utils/utils_trendsHub";
import {
	TrendCategoryData,
	TrendCategoryParams,
	TrendsOverview,
	TrendsOverviewParams,
} from "./types";

type OverviewData = { overview?: TrendsOverview | null };
type CategoryData = { categoryData?: TrendCategoryData | null };

// Failed requests become RTK errors (so pages can show an error state, not an empty one)
const toError = (response: unknown) => {
	const { ErrorMsg } = (response ?? {}) as AwaitedResponse<unknown>;
	const message = ErrorMsg || "Unable to load trends";
	return { error: { status: "CUSTOM_ERROR" as const, error: message } };
};

export const trendsHubApi = createApi({
	reducerPath: "trendsHubApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["TrendsOverview", "TrendCategory"],
	endpoints: (builder) => ({
		getTrendsOverview: builder.query<TrendsOverview, TrendsOverviewParams>({
			queryFn: async ({ userID, period }) => {
				const response = (await getTrendsOverview(
					userID,
					period,
				)) as AwaitedResponse<OverviewData>;
				const { overview } = (response?.Data ?? {}) as OverviewData;
				if (!overview) return toError(response);

				return { data: overview };
			},
			providesTags: (_result, _error, { period }) => [
				{ type: "TrendsOverview", id: period },
			],
		}),
		// null = the category has no data in either period (eg. no strength workouts): not an error
		getTrendCategory: builder.query<
			TrendCategoryData | null,
			TrendCategoryParams
		>({
			queryFn: async ({ userID, category, period }) => {
				const response = (await getTrendCategory(
					userID,
					category,
					period,
				)) as AwaitedResponse<CategoryData>;
				const failed = !response?.Data || Boolean(response.ErrorMsg);
				if (failed) return toError(response);

				const { categoryData } = response.Data as CategoryData;
				return { data: categoryData ?? null };
			},
			providesTags: (_result, _error, { category, period }) => [
				{ type: "TrendCategory", id: `${category}-${period}` },
			],
		}),
	}),
});

export const { useGetTrendsOverviewQuery, useGetTrendCategoryQuery } =
	trendsHubApi;
