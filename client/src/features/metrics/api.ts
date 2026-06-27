import { Activity } from "../shared/types";
import { ActivityMetrics } from "./types";
import { currentEnv } from "../../utils/utils_env";
import { AwaitedResponse, RangeParams } from "../types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchActivityMetricsAfterWorkout } from "../../utils/utils_metrics";

export interface ActivityMetricsDataParams {
	userID: string;
	activityType: Activity;
	workoutID: number;
	historyID: number;
	range: RangeParams;
}

export const metricsApi = createApi({
	reducerPath: "metricsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["Metrics"],
	endpoints: (builder) => ({
		getActivityMetricsAfterWorkout: builder.query<
			ActivityMetrics,
			ActivityMetricsDataParams
		>({
			queryFn: async (params) => {
				const { userID, activityType, workoutID, historyID, range } = params;
				const response = (await fetchActivityMetricsAfterWorkout(userID, {
					activityType,
					workoutID,
					historyID,
					range,
				})) as AwaitedResponse<ActivityMetrics>;
				const data = response.Data as ActivityMetrics;
				return { data };
			},
		}),
	}),
});

export const { useGetActivityMetricsAfterWorkoutQuery } = metricsApi;
