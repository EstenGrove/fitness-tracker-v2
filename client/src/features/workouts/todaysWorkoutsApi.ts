import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AwaitedResponse, UserDateParams } from "../types";
import { TodaysWorkout } from "./types";
import { fetchTodaysWorkouts } from "../../utils/utils_workouts";

export const todaysWorkoutsApi = createApi({
	reducerPath: "todaysWorkoutsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["TodaysWorkouts"],
	endpoints: (builder) => ({
		getTodaysWorkouts: builder.query<TodaysWorkout[], UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchTodaysWorkouts(
					userID,
					targetDate
				)) as AwaitedResponse<{ workouts: TodaysWorkout[] }>;
				const workouts = response.Data.workouts as TodaysWorkout[];

				return { data: workouts || [] };
			},
		}),
	}),
});

export const { useGetTodaysWorkoutsQuery } = todaysWorkoutsApi;
