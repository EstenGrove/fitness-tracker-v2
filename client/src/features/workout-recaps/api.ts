import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	fetchWorkoutRecap,
	WorkoutRecapParams,
} from "../../utils/utils_workoutRecaps";
import { ActivityRecapDetails } from "./types";

export const workoutRecapsApi = createApi({
	reducerPath: "workoutRecapsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getWorkoutRecap: builder.query<ActivityRecapDetails, WorkoutRecapParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = await fetchWorkoutRecap(userID, params);
				const data = response.Data as ActivityRecapDetails;

				return { data };
			},
		}),
	}),
});

export const { useGetWorkoutRecapQuery } = workoutRecapsApi;
