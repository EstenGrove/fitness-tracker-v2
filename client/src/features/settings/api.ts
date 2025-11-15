import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	fetchJobsSummary,
	fetchSettingNavOptions,
	fetchSettings,
} from "../../utils/utils_settings";
import { AwaitedResponse } from "../types";
import { JobsRefreshSummary, SettingsNavsInfo } from "./types";

interface UserParams {
	userID: string;
}

export const settingsApi = createApi({
	reducerPath: "settingsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getNavItems: builder.query<SettingsNavsInfo, UserParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchSettingNavOptions(
					userID
				)) as AwaitedResponse<SettingsNavsInfo>;
				const data = response.Data as SettingsNavsInfo;
				return { data: data };
			},
		}),
		getSettings: builder.query({
			queryFn: async (params) => {
				const { userID } = params;
				const response = await fetchSettings(userID);
				const data = response.Data;

				return { data };
			},
		}),
		getSettingsInfoByRoute: builder.query({
			queryFn: async (params) => {
				// const { userID, route } = params;

				return { data: null };
			},
		}),
		getJobsSettings: builder.query<JobsRefreshSummary, { userID: string }>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchJobsSummary(
					userID
				)) as AwaitedResponse<JobsRefreshSummary>;
				const data = response.Data as JobsRefreshSummary;
				return { data: data };
			},
		}),
	}),
});

export const {
	useGetNavItemsQuery,
	useGetSettingsQuery,
	useGetJobsSettingsQuery,
	useGetSettingsInfoByRouteQuery,
} = settingsApi;
