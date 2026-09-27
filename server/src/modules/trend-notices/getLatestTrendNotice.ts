import { trendNoticesService } from "../../services/index.js";
import { TREND_NOTICES_CONFIG } from "./config.js";
import { detectTrend } from "./detectTrend.js";
import { generateTrendNotice } from "./generateTrendNotice.js";
import type { AITrendNotice, AIWeeklyTotalsData } from "./types.js";

const { WINDOW_WEEKS } = TREND_NOTICES_CONFIG;

// Only show notices from the last 2 completed weeks, so users who skip a few weeks don't see a stale one
const MAX_NOTICE_AGE_WEEKS = 2;

// Creates this week's notice if it doesn't exist yet & the change is notable.
// Only a notable change reaches the AI (at most once per user, per week).
const createNoticeIfNotable = async (
	userID: string,
): Promise<string | Error> => {
	const totals: AIWeeklyTotalsData | Error =
		await trendNoticesService.getWeeklyTotals(userID, WINDOW_WEEKS * 2);
	console.log("[TOTALS]:", totals);
	if (totals instanceof Error) return totals;

	const { lastWeekStart } = totals;

	const cached: AITrendNotice | Error | null =
		await trendNoticesService.getNotice(userID, lastWeekStart);
	console.log("[CACHED]:", cached);
	if (cached instanceof Error) return cached;
	if (cached) return lastWeekStart;

	const priorNotices = await trendNoticesService.getRecentNotices(
		userID,
		lastWeekStart,
		WINDOW_WEEKS,
	);
	console.log("[PRIOR NOTICES]:", priorNotices);
	if (priorNotices instanceof Error) return priorNotices;

	const trend = detectTrend(totals, priorNotices);
	console.log("[TREND]:", trend);
	if (!trend) return lastWeekStart;

	const content = await generateTrendNotice(trend);
	// ON CONFLICT DO NOTHING: if a concurrent request already inserted it, that row wins
	const inserted = await trendNoticesService.insertNotice({
		userID,
		weekStart: lastWeekStart,
		...trend,
		...content,
	});
	if (inserted instanceof Error) return inserted;

	return lastWeekStart;
};

const getLatestTrendNotice = async (
	userID: string,
): Promise<AITrendNotice | null | Error> => {
	const lastWeekStart = await createNoticeIfNotable(userID);
	if (lastWeekStart instanceof Error) return lastWeekStart;

	const latest = await trendNoticesService.getLatestNotice(
		userID,
		lastWeekStart,
		MAX_NOTICE_AGE_WEEKS,
	);
	console.log("[LATEST]:", latest);
	if (latest instanceof Error) return latest;

	// A dismissed latest notice hides everything (don't fall back to an older one)
	if (!latest || latest.dismissedAt) return null;

	return latest;
};

export { getLatestTrendNotice };
