import { Hono, type Context } from "hono";
import { medicationsService } from "../services/index.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { normalizeUserMeds } from "../modules/medications/userMeds.ts";
import type {
	LogMedBody,
	Medication,
	MedicationDB,
	MedicationLog,
	MedicationLogDB,
	MedSummary,
	MedSummaryDB,
	PillSummary,
	PillSummaryDB,
} from "../modules/medications/types.ts";
import { normalizePillSummary } from "../modules/medications/pillSummary.ts";
import { normalizeMedSummary } from "../modules/medications/medSummary.ts";
import { normalizeMedLog } from "../modules/medications/medLogs.ts";

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

	// log medication
	const rawLog = (await medicationsService.logMedication(
		userID,
		body
	)) as MedicationLogDB;

	if (rawLog instanceof Error) {
		const errResp = getResponseError(rawLog, {
			newLog: null,
		});
		return ctx.json(errResp);
	}

	const medLog: MedicationLog = normalizeMedLog(rawLog);
	const resp = getResponseOk({
		newLog: medLog,
	});
	return ctx.json(resp);
});

export default app;
