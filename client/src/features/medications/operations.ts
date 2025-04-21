import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	fetchMedLogsByRange,
	MedLogBody,
	MedLogOptions,
	saveMedicationLog,
} from "../../utils/utils_medications";
import { AwaitedResponse, DateRange } from "../types";
import { MedLogEntry } from "./types";

interface MedLogParams {
	userID: string;
	medLog: MedLogBody;
}

const logMedication = createAsyncThunk(
	"medications/logMedication",
	async (params: MedLogParams) => {
		const { userID, medLog } = params;
		const response = (await saveMedicationLog(
			userID,
			medLog
		)) as AwaitedResponse<{ newLog: MedLogEntry }>;
		const data = response.Data;
		return data as { newLog: MedLogEntry };
	}
);

const getMedLogsByRange = createAsyncThunk(
	"medications/getMedLogsByRange",
	async (params: MedLogOptions) => {
		const { userID, medID, startDate, endDate } = params;
		const response = (await fetchMedLogsByRange(userID, {
			medID,
			startDate,
			endDate,
		})) as AwaitedResponse<{ logs: MedLogEntry[]; range: DateRange }>;
		const data = response.Data;

		return data as { logs: MedLogEntry[]; range: DateRange };
	}
);

export { logMedication, getMedLogsByRange };
