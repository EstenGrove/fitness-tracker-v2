import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { getLatestTrendNotice } from "../modules/trend-notices/getLatestTrendNotice.js";
import { dismissTrendNotice } from "../modules/trend-notices/dismissTrendNotice.js";
import type { AITrendNotice } from "../modules/trend-notices/types.js";

const app = new Hono();

type AITrendNoticeResult = AITrendNotice | null | Error;

app.get("/getLatestTrendNotice", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	if (!userID) {
		const errResp = getResponseError(new Error("Missing 'userID'"));
		return ctx.json(errResp);
	}

	const notice: AITrendNoticeResult = await getLatestTrendNotice(userID);

	if (notice instanceof Error) {
		const errResp = getResponseError(notice, { notice: null });
		return ctx.json(errResp);
	}

	const resp = getResponseOk({ notice });
	return ctx.json(resp);
});

app.post("/dismissTrendNotice", async (ctx: Context) => {
	const body = await ctx.req.json<{ userID: string; noticeID: string }>();
	const { userID, noticeID } = body;

	if (!userID || !noticeID) {
		const errResp = getResponseError(
			new Error("Missing 'userID' or 'noticeID'"),
		);
		return ctx.json(errResp);
	}

	const notice = await dismissTrendNotice(userID, noticeID);

	if (notice instanceof Error) {
		const errResp = getResponseError(notice, { notice: null });
		return ctx.json(errResp);
	}

	const resp = getResponseOk({ notice });
	return ctx.json(resp);
});

export default app;
