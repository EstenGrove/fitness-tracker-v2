import {
	Medication,
	MedicationSchedule,
	MedLogEntry,
	PillSummary,
} from "../features/medications/types";
import { AsyncResponse, DateRange } from "../features/types";
import { applyTimeStrToDate, prepareTimestamp } from "./utils_dates";
import { currentEnv, medicationApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface MedLogBody {
	userID: string;
	medID: number;
	scheduleID: number;
	amountTaken: number;
	action: "Taken" | "Skipped";
	loggedAt: Date | string;
}

export interface MedLogVals {
	userID: string;
	medID: number;
	dose: number;
	scheduleID: number;
	action: "Taken" | "Skipped";
	loggedAt: string;
	loggedDate: Date | string;
}

export interface MedLogOptions {
	userID: string;
	medID: number;
	startDate: string;
	endDate: string;
}

export interface SummaryParams {
	userID: string;
	medID: number;
	targetDate: string;
}

export interface SummaryByDateParams {
	medID: number;
	targetDate: string;
}

export interface MedsInfo {
	activeMeds: Medication[];
	activeSchedules: MedicationSchedule[];
}

export type MedsInfoResp = AsyncResponse<MedsInfo>;

const fetchMedications = async (userID: string) => {
	let url = currentEnv.base + medicationApis.getUserMeds;
	url += "?" + new URLSearchParams({ userID });
	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchMedsInfo = async (
	userID: string,
	targetDate: string
): MedsInfoResp => {
	let url = currentEnv.base + medicationApis.getMedsInfo;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Records a single medication dose log
const saveMedicationLog = async (
	userID: string,
	medLog: MedLogBody
): AsyncResponse<{ newLog: MedLogEntry }> => {
	let url = currentEnv.base + medicationApis.logMed;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify(medLog),
		});
		const response = await request.json();
		console.log("response", response);
		return response as AsyncResponse<{ newLog: MedLogEntry }>;
	} catch (error) {
		return error;
	}
};

const fetchMedLogsByRange = async (
	userID: string,
	params: Pick<MedLogOptions, "startDate" | "endDate" | "medID">
): AsyncResponse<{ logs: MedLogEntry[]; range: DateRange }> => {
	const { medID, startDate, endDate } = params;
	let url = currentEnv.base + medicationApis.getMedLogsByRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ medID: String(medID) });
	url += "&" + new URLSearchParams({ startDate, endDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchMedSummaryByDate = async (
	userID: string,
	params: SummaryByDateParams
) => {
	let url = currentEnv.base + medicationApis.getSummaryByDate;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ medID: String(params.medID) });
	url += "&" + new URLSearchParams({ targetDate: params.targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const prepareMedLog = (values: MedLogVals): MedLogBody => {
	const {
		userID,
		loggedAt,
		medID,
		dose,
		scheduleID = 2,
		loggedDate = new Date(),
		action = "Taken",
	} = values;
	const takenTime = applyTimeStrToDate(loggedAt, loggedDate);
	const takenAt = prepareTimestamp(takenTime);
	const medLog: MedLogBody = {
		userID: userID,
		medID: medID,
		scheduleID: scheduleID,
		amountTaken: dose,
		action: action,
		loggedAt: takenAt,
	};

	return medLog;
};

const processPillSummary = (summary: PillSummary): PillSummary => {
	return {
		scheduleID: summary.scheduleID,
		daysLeft: Number(summary.daysLeft),
		totalPills: Number(summary.totalPills),
		pillsRemaining: Number(summary.pillsRemaining),
		pillsTaken: Number(summary.pillsTaken),
		pillsTakenToday: Number(summary.pillsTakenToday),
	};
};

export {
	// Async Requests
	saveMedicationLog,
	fetchMedLogsByRange,
	fetchMedSummaryByDate,
	fetchMedications,
	fetchMedsInfo,
	// Utils
	prepareMedLog,
	processPillSummary,
};
