import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	fetchWorkoutHistoryCalendar,
	WorkoutCalendarData,
} from "../../utils/utils_summary";
import { AwaitedResponse } from "../types";

interface CalendarParams {
	userID: string;
	baseDate: string;
}

export const customSummaryApi = createApi({
	reducerPath: "customSummaryApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["HistoryCalendar"],
	endpoints: (builder) => ({
		getWorkoutHistoryCalendar: builder.query<
			WorkoutCalendarData,
			CalendarParams
		>({
			queryFn: async (params) => {
				const { userID, baseDate } = params;
				const response = (await fetchWorkoutHistoryCalendar(
					userID,
					baseDate
				)) as AwaitedResponse<WorkoutCalendarData>;
				const data = response.Data as WorkoutCalendarData;

				return { data };
			},
		}),
	}),
});

export const { useGetWorkoutHistoryCalendarQuery } = customSummaryApi;
