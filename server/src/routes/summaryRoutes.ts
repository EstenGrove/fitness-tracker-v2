import { Hono, type Context } from "hono";

const app: Hono = new Hono();

app.get("/getSummaryForEntireYear", async (ctx: Context) => {
	const defaultYear = new Date().getFullYear();
	const { userID, targetYear = defaultYear, activityType } = ctx.req.query();

	// getSummaryForEntireYear(userID, activityType, targetYear)
});
