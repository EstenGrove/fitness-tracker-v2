import { Hono, type Context } from "hono";
import { medicationsService } from "../services/index.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { normalizeUserMeds } from "../modules/medications/userMeds.js";
import type {
	LogMedBody,
	MedDetails,
	Medication,
	MedicationDB,
	MedicationLog,
	MedicationLogDB,
	MedsInfo,
	MedSummary,
	MedSummaryDB,
	PillSummary,
	PillSummaryDB,
} from "../modules/medications/types.js";
import { normalizePillSummary } from "../modules/medications/pillSummary.js";
import { normalizeMedSummary } from "../modules/medications/medSummary.js";
import { normalizeMedLog } from "../modules/medications/medLogs.js";
import { getMedsInfo } from "../modules/medications/getMedsInfo.js";
import { getMedDetails } from "../modules/medications/getMedDetails.js";

const app = new Hono();

app.get("/getUserMeds", async (ctx: Context) => {
	const { userID } = ctx.req.query();
	const meds = (await medicationsService.getUserMeds(userID)) as MedicationDB[];

	if (meds instanceof Error) {
		const errResp = getResponseError(meds, {
			medications: [],
		});
		return ctx.json(errResp);
	}

	const userMeds: Medication[] = normalizeUserMeds(meds);

	const resp = getResponseOk({
		medications: userMeds,
	});
	return ctx.json(resp);
});

app.get("/getPillSummary", async (ctx: Context) => {
	const { userID, scheduleID, targetDate } = ctx.req.query();
	const summary = (await medicationsService.getPillSummaryByDate(userID, {
		scheduleID: Number(scheduleID),
		targetDate: targetDate,
	})) as PillSummaryDB;

	if (summary instanceof Error) {
		const errResp = getResponseError(summary, {
			summary: null,
		});
		return ctx.json(errResp);
	}

	const pillSummary: PillSummary = normalizePillSummary(summary);

	const resp = getResponseOk({
		summary: pillSummary,
	});

	return ctx.json(resp);
});

app.get("/getMedsInfo", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const medsInfo = (await getMedsInfo(userID, targetDate)) as MedsInfo;

	if (medsInfo instanceof Error) {
		const errResp = getResponseError(medsInfo, {
			activeMeds: [],
			activeSchedules: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(medsInfo);

	return ctx.json(resp);
});

app.get("/getMedSummaryByDate", async (ctx: Context) => {
	const { userID, medID, targetDate } = ctx.req.query();

	const summary = (await medicationsService.getMedSummaryByDate(userID, {
		medID: Number(medID),
		targetDate: targetDate,
	})) as MedSummaryDB;

	console.log("summary", summary);

	if (summary instanceof Error) {
		const errResp = getResponseError(summary, {
			summary: null,
		});
		return ctx.json(errResp);
	}

	const medSummary: MedSummary = normalizeMedSummary(summary);
	const resp = getResponseOk(medSummary);

	return ctx.json(resp);
});

app.post("/logMedication", async (ctx: Context) => {
	const body = await ctx.req.json<LogMedBody>();
	const { userID } = body;
	console.log("body", body);

	// log medication
	const rawLog = (await medicationsService.logMedication(
		userID,
		body
	)) as MedicationLogDB;

	console.log("rawLog", rawLog);

	if (rawLog instanceof Error) {
		const errResp = getResponseError(rawLog, {
			newLog: null,
		});
		return ctx.json(errResp);
	}

	const medLog: MedicationLog = normalizeMedLog(rawLog);

	console.log("medlog", medLog);
	const resp = getResponseOk({
		newLog: medLog,
	});
	return ctx.json(resp);
});

app.get("/getMedDetails", async (ctx: Context) => {
	const { userID, medID: id } = ctx.req.query();
	const medID = Number(id);

	const details = (await getMedDetails(userID, medID)) as MedDetails;

	if (details instanceof Error) {
		const errResp = getResponseError(details, {
			medication: null,
			schedule: null,
			logs: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(details);

	return ctx.json(resp);
});

app.get("/getMedLogsByRange", async (ctx: Context) => {
	const { userID, medID: id, startDate, endDate } = ctx.req.query();
	const medID = Number(id);

	const rawLogs = (await medicationsService.getMedLogsByRange(userID, {
		medID,
		startDate,
		endDate,
	})) as MedicationLogDB[];

	if (rawLogs instanceof Error) {
		const errResp = getResponseError(rawLogs, {
			logs: [],
		});
		return ctx.json(errResp);
	}

	const medLogs: MedicationLog[] = rawLogs.map(normalizeMedLog);
	const resp = getResponseOk({
		logs: medLogs,
	});
	return ctx.json(resp);
});

export default app;
