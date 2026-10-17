import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { getTrendsOverview } from "../modules/trends-hub/getTrendsOverview.js";
import { getTrendCategory } from "../modules/trends-hub/getTrendCategory.js";

const app = new Hono();

// The hub (/trends): one card per category. 'period' = 4W | 12W | 6M | 1Y (default: 12W)
app.get("/getOverview", async (ctx: Context) => {
	const { userID, period } = ctx.req.query();

	if (!userID) {
		const errResp = getResponseError(new Error("Missing 'userID'"));
		return ctx.json(errResp);
	}

	const overview = await getTrendsOverview(userID, period);

	if (overview instanceof Error) {
		const errResp = getResponseError(overview, { overview: null });
		return ctx.json(errResp);
	}

	const resp = getResponseOk({ overview });
	return ctx.json(resp);
});

// A category's detail page (/trends/:category)
app.get("/getCategory", async (ctx: Context) => {
	const { userID, category, period } = ctx.req.query();

	if (!userID) {
		const errResp = getResponseError(new Error("Missing 'userID'"));
		return ctx.json(errResp);
	}

	const categoryData = await getTrendCategory(userID, category, period);

	if (categoryData instanceof Error) {
		const errResp = getResponseError(categoryData, { categoryData: null });
		return ctx.json(errResp);
	}

	const resp = getResponseOk({ categoryData });
	return ctx.json(resp);
});

export default app;
