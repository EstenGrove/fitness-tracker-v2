import { trendNoticesService } from "../../services/index.js";
import { TREND_NOTICES_CONFIG } from "./config.js";
import { detectTrend } from "./detectTrend.js";
import { generateTrendNotice } from "./generateTrendNotice.js";
import type {
	AILatestTrendNotice,
	AITrendNotice,
	AIWeeklyTotal,
	AIWeeklyTotalsData,
} from "./types.js";

const { WINDOW_WEEKS } = TREND_NOTICES_CONFIG;

// Only show notices from the last 2 completed weeks, so users who skip a few weeks don't see a stale one
const MAX_NOTICE_AGE_WEEKS = 2;

// Creates this week's notice if it doesn't exist yet & the change is notable.
// Only a notable change reaches the AI (at most once per user, per week).
const createNoticeIfNotable = async (
	userID: string,
	totals: AIWeeklyTotalsData,
): Promise<void | Error> => {
	const { lastWeekStart } = totals;

	const cached = await trendNoticesService.getNotice(userID, lastWeekStart);
	if (cached instanceof Error) return cached;
	if (cached) return;

	const priorNotices = await trendNoticesService.getRecentNotices(
		userID,
		lastWeekStart,
		WINDOW_WEEKS,
	);
	if (priorNotices instanceof Error) return priorNotices;

	const trend = detectTrend(totals, priorNotices);
	if (!trend) return;

	const content = await generateTrendNotice(trend);
	// ON CONFLICT DO NOTHING: if a concurrent request already inserted it, that row wins
	const inserted = await trendNoticesService.insertNotice({
		userID,
		weekStart: lastWeekStart,
		...trend,
		...content,
	});
	if (inserted instanceof Error) return inserted;
};

// The weeks a notice was based on: reuse the current totals, unless the notice is from a prior week
const getNoticeWeeks = async (
	notice: AITrendNotice,
	totals: AIWeeklyTotalsData,
): Promise<AIWeeklyTotal[] | Error> => {
	if (notice.weekStart === totals.lastWeekStart) return totals.weeks;

	const noticeTotals = await trendNoticesService.getWeeklyTotals(
		notice.userID,
		WINDOW_WEEKS * 2,
		notice.weekStart,
	);
	if (noticeTotals instanceof Error) return noticeTotals;

	return noticeTotals.weeks;
};

const getLatestTrendNotice = async (
	userID: string,
): Promise<AILatestTrendNotice | null | Error> => {
	const totals = await trendNoticesService.getWeeklyTotals(
		userID,
		WINDOW_WEEKS * 2,
	);
	if (totals instanceof Error) return totals;

	const created = await createNoticeIfNotable(userID, totals);
	if (created instanceof Error) return created;

	const latest = await trendNoticesService.getLatestNotice(
		userID,
		totals.lastWeekStart,
		MAX_NOTICE_AGE_WEEKS,
	);
	if (latest instanceof Error) return latest;

	// A dismissed latest notice hides everything (don't fall back to an older one)
	if (!latest || latest.dismissedAt) return null;

	const weeks = await getNoticeWeeks(latest, totals);
	if (weeks instanceof Error) return weeks;

	return { ...latest, weeks };
};

export { getLatestTrendNotice };
