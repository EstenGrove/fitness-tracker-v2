import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";

export const habitsApi = createApi({
	reducerPath: "habitsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getHabitSummaries: builder.query({
			queryFn: async (params) => {
				// const response = await fetchHabitSummaries(params)
			},
		}),
	}),
});
