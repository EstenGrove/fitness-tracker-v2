import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	fetchWorkoutAwards,
	fetchWorkoutAwardsAndStreaks,
} from "../../utils/utils_awards";
import { currentEnv } from "../../utils/utils_env";
import { UserDateParams } from "../types";
import { WorkoutAwardsAndStreaks } from "./types";

export const awardsApi = createApi({
	reducerPath: "awardsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getWorkoutAwards: builder.query<WorkoutAwardsAndStreaks, UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = await fetchWorkoutAwards(userID, targetDate);
				const data = response.Data as WorkoutAwardsAndStreaks;
				return { data };
			},
		}),
		getWorkoutAwardsAndStreaks: builder.query<
			WorkoutAwardsAndStreaks,
			UserDateParams
		>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = await fetchWorkoutAwardsAndStreaks(userID, targetDate);
				const data = response.Data as WorkoutAwardsAndStreaks;
				return { data };
			},
		}),
	}),
});

export const { useGetWorkoutAwardsQuery, useGetWorkoutAwardsAndStreaksQuery } =
	awardsApi;
