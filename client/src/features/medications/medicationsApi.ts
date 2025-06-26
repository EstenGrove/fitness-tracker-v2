import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	fetchMedDetails,
	fetchMedications,
	fetchMedLogsByRange,
	fetchMedsInfo,
	fetchMedSummaryByDate,
	MedDetails,
	MedLogBody,
	MedLogOptions,
	MedsInfo,
	saveMedicationLog,
	SummaryParams,
} from "../../utils/utils_medications";
import { Medication, MedLogEntry, MedSummaryForDate } from "./types";
import { AwaitedResponse, DateRange } from "../types";

interface NewMedLog {
	newLog: MedLogEntry;
}
interface MedLogsByRange {
	logs: MedLogEntry[];
	range: DateRange;
}

interface UserDateParams {
	userID: string;
	targetDate: string;
}

interface DetailsParams {
	userID: string;
	medID: number;
}

export const medicationsApi = createApi({
	reducerPath: "medicationsApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	tagTypes: ["MedSummary", "MedLogs"],
	endpoints: (builder) => ({
		// Get all medications for a user
		getMedications: builder.query({
			queryFn: async (params) => {
				const { userID } = params;
				const response = await fetchMedications(userID);
				const data = response.Data as { medications: Medication[] };
				return { data: data.medications };
			},
		}),
		// Get medication logs by date range
		getLogsByRange: builder.query<MedLogsByRange, MedLogOptions>({
			queryFn: async (params) => {
				const { userID, medID, startDate, endDate } = params;
				const response = (await fetchMedLogsByRange(userID, {
					medID,
					startDate,
					endDate,
				})) as AwaitedResponse<MedLogsByRange>;
				const data = response.Data;
				return { data: data as MedLogsByRange };
			},
			providesTags: () => [{ type: "MedLogs" }],
		}),
		// Log a new medication entry ('Taken' or 'Skipped')
		logMedication: builder.mutation<NewMedLog, MedLogBody>({
			queryFn: async (params) => {
				const loggedMed = (await saveMedicationLog(
					params.userID,
					params
				)) as AwaitedResponse<NewMedLog>;
				const data = loggedMed.Data as NewMedLog;
				return { data: data };
			},
			invalidatesTags: ["MedSummary", "MedLogs"],
		}),
		// Get medication summary by date
		getMedSummaryByDate: builder.query<MedSummaryForDate, SummaryParams>({
			queryFn: async (params) => {
				const { userID, medID, targetDate } = params;
				const response = (await fetchMedSummaryByDate(userID, {
					medID,
					targetDate,
				})) as AwaitedResponse<MedSummaryForDate>;
				const data = response.Data as MedSummaryForDate;
				return { data };
			},
			providesTags: () => [{ type: "MedSummary" }],
		}),
		// Get active meds & schedules
		getMedsInfo: builder.query<MedsInfo, UserDateParams>({
			queryFn: async (params) => {
				const { userID, targetDate } = params;
				const response = (await fetchMedsInfo(
					userID,
					targetDate
				)) as AwaitedResponse<MedsInfo>;
				const data = response.Data as MedsInfo;

				return { data };
			},
		}),
		// Get a given med's medication, schedule & logs
		getMedDetails: builder.query<MedDetails, DetailsParams>({
			queryFn: async (params) => {
				const { userID, medID } = params;
				const response = (await fetchMedDetails(
					userID,
					medID
				)) as AwaitedResponse<MedDetails>;
				const data = response.Data as MedDetails;

				return { data };
			},
		}),
	}),
});

export const {
	useGetMedsInfoQuery,
	useGetMedicationsQuery,
	useGetLogsByRangeQuery,
	useGetMedDetailsQuery,
	useLogMedicationMutation,
	useGetMedSummaryByDateQuery,
} = medicationsApi;
