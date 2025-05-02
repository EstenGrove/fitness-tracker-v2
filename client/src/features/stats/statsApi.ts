import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { getPostWorkoutStats } from "../../utils/utils_stats";
import { AwaitedResponse } from "../types";
import { PostWorkoutParams, PostWorkoutStats } from "./types";

export const statsApi = createApi({
	reducerPath: "statsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["WorkoutStats"],
	endpoints: (builder) => ({
		getPostWorkoutStats: builder.query<PostWorkoutStats, PostWorkoutParams>({
			queryFn: async (params) => {
				const response = (await getPostWorkoutStats(
					params
				)) as AwaitedResponse<PostWorkoutStats>;
				const data = response.Data as PostWorkoutStats;
				return { data };
			},
		}),
	}),
});

export const { useGetPostWorkoutStatsQuery } = statsApi;
