import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import { AwaitedResponse, UserDateParams } from "../types";
import {
	fetchHabitStreaks,
	fetchWorkoutStreaks,
} from "../../utils/utils_streaks";
import { HabitStreakDetails, WorkoutStreakDetails } from "./types";

export interface UserHabitDateParams extends UserDateParams {
	habitID: number;
}

export const streaksApi = createApi({
	reducerPath: "streaksApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getWorkoutStreaks: builder.query<WorkoutStreakDetails, UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchWorkoutStreaks(
					userID,
					targetDate
				)) as AwaitedResponse<WorkoutStreakDetails>;
				const data = response.Data as WorkoutStreakDetails;

				return { data };
			},
		}),
		getHabitStreaks: builder.query<HabitStreakDetails, UserHabitDateParams>({
			queryFn: async (params) => {
				const { userID, habitID, targetDate } = params;
				const response = (await fetchHabitStreaks(
					userID,
					habitID,
					targetDate
				)) as AwaitedResponse<HabitStreakDetails>;
				const data = response.Data as HabitStreakDetails;

				return { data };
			},
		}),
	}),
});

export const { useGetWorkoutStreaksQuery, useGetHabitStreaksQuery } =
	streaksApi;
