import { AsyncResponse, RangeParams } from "../features/types";
import { currentEnv, aiTrendsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import {
	AIMetricDirection,
	AINoticeDirection,
	AINoticeMetric,
	AINoticeMetrics,
	AITrendArrowDirection,
	AITrendNotice,
	AIWeeklyTotal,
	DismissedTrendNotice,
} from "../features/ai-trends/types";
import { TrendArrowGradient } from "../components/ui/TrendArrowUpIcon";
import { formatDate } from "./utils_dates";
import { getFromLocalStorage, saveToLocalStorage } from "./utils_storage";

export type AITrendNoticeResp = AsyncResponse<AITrendNotice | unknown>;
export type DismissedTrendNoticeResp = AsyncResponse<
	DismissedTrendNotice | unknown
>;

export interface DismissTrendParams {
	noticeID: string;
	dismissedAt: string;
}

const getLatestTrendNotice = async (userID: string): AITrendNoticeResp => {
	let url = currentEnv.base + aiTrendsApis.getLatestTrendNotice;
	url += "?" + new URLSearchParams({ userID });

	try {
		const response = await fetchWithAuth(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
};

const dismissTrendNotice = async (
	userID: string,
	params: DismissTrendParams,
): DismissedTrendNoticeResp => {
	const { noticeID, dismissedAt = formatDate(new Date(), "db") } = params;
	const url = currentEnv.base + aiTrendsApis.dismissTrendNotice;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({ userID, noticeID, dismissedAt }),
		});
		const data = await request.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
};

// Fetch AI trends using a custom date range
const getAITrendsForRange = async (
	userID: string,
	range: RangeParams,
): AITrendNoticeResp => {
	const { startDate, endDate } = range;
	let url = currentEnv.base + aiTrendsApis.getAITrendsForRange;
	url += "?" + new URLSearchParams({ userID, startDate, endDate });

	try {
		const response = await fetchWithAuth(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
};

/**
 * NOTICE DISPLAY HELPERS
 * - All colors/icons per direction live in these 2 configs, so restyling a variant is a one-line change.
 */

export interface NoticeVariant {
	color: string;
	bgColor: string;
	arrow: AITrendArrowDirection;
	gradient: TrendArrowGradient;
}

// Drops use blue (never red/orange) to keep the tone gentle
const NOTICE_VARIANTS: Record<AINoticeDirection, NoticeVariant> = {
	POSITIVE: {
		color: "var(--accent-green)",
		bgColor: "var(--greenBG)",
		arrow: "up",
		gradient: "lime",
	},
	NEGATIVE: {
		color: "var(--accent-red)",
		bgColor: "var(--redBG)",
		arrow: "down",
		gradient: "ocean",
	},
	MIXED: {
		color: "var(--accent-blue)",
		bgColor: "var(--blueBG)",
		arrow: "up",
		gradient: "ocean",
	},
};

const METRIC_VARIANTS: Record<
	AIMetricDirection,
	Pick<NoticeVariant, "color" | "bgColor">
> = {
	POSITIVE: NOTICE_VARIANTS.POSITIVE,
	NEGATIVE: NOTICE_VARIANTS.NEGATIVE,
	STABLE: {
		color: "var(--text1_5)",
		bgColor: "var(--blueGrey800)",
	},
};

// Order & labels of the metric rows in the notice
const METRIC_DETAILS: Record<
	keyof AINoticeMetrics,
	{ label: string; decimals: number }
> = {
	avgWeeklyMins: { label: "Minutes / week", decimals: 0 },
	avgWeeklyWorkouts: { label: "Workouts / week", decimals: 1 },
};

export interface NoticeMetricRow extends AINoticeMetric {
	key: keyof AINoticeMetrics;
	label: string;
	decimals: number;
}

export interface NoticeWeekBar {
	weekStart: string;
	totalMins: number;
	height: number; // % of the tallest week
	isRecent: boolean; // true for the most recent half (the weeks being compared)
}

const getNoticeVariant = (direction: AINoticeDirection): NoticeVariant => {
	return NOTICE_VARIANTS[direction];
};

const getMetricVariant = (direction: AIMetricDirection) => {
	return METRIC_VARIANTS[direction];
};

const getNoticeMetricRows = (metrics: AINoticeMetrics): NoticeMetricRow[] => {
	const keys = Object.keys(METRIC_DETAILS) as Array<keyof AINoticeMetrics>;

	return keys.map((key) => ({
		key,
		...METRIC_DETAILS[key],
		...metrics[key],
	}));
};

// eg. 26.7 => "+27%", -22.4 => "−22%", STABLE => "Steady"
const formatMetricChange = (metric: AINoticeMetric): string => {
	if (metric.direction === "STABLE") return "Steady";

	const pct = Math.round(Math.abs(metric.pctChange));
	const sign = metric.pctChange > 0 ? "+" : "−";
	return `${sign}${pct}%`;
};

// Weekly minutes as bars, oldest -> newest. The 2nd half (recent window) is highlighted.
const getNoticeWeekBars = (weeks: AIWeeklyTotal[]): NoticeWeekBar[] => {
	const sorted = [...weeks].sort((a, b) =>
		a.weekStart.localeCompare(b.weekStart),
	);
	const maxMins = Math.max(...sorted.map((week) => week.totalMins), 1);
	const recentStartIdx = Math.floor(sorted.length / 2);

	return sorted.map((week, idx) => ({
		weekStart: week.weekStart,
		totalMins: Math.round(week.totalMins),
		height: Math.round((week.totalMins / maxMins) * 100),
		isRecent: idx >= recentStartIdx,
	}));
};

/**
 * AUTO-SHOW TRACKING
 * - The notice auto-opens on the first Dashboard visit of the day (per notice).
 * - Tracked per device in localStorage; the header button re-opens it at any time.
 */

const LAST_SHOWN_KEY = "aiTrendsNotice:lastShown";

interface LastShownNotice {
	noticeID: string;
	date: string; // YYYY-MM-DD
}

const getToday = (): string => formatDate(new Date(), "db");

const wasNoticeShownToday = (noticeID: string): boolean => {
	try {
		const lastShown = getFromLocalStorage(
			LAST_SHOWN_KEY,
		) as LastShownNotice | null;
		return lastShown?.noticeID === noticeID && lastShown?.date === getToday();
	} catch {
		return false;
	}
};

const markNoticeShownToday = (noticeID: string): void => {
	try {
		const lastShown: LastShownNotice = { noticeID, date: getToday() };
		saveToLocalStorage(LAST_SHOWN_KEY, { ...lastShown });
	} catch {
		// storage unavailable (eg. private mode): the notice just auto-opens again next visit
	}
};

export {
	getLatestTrendNotice,
	getAITrendsForRange,
	dismissTrendNotice,
	// Display helpers
	getNoticeVariant,
	getMetricVariant,
	getNoticeMetricRows,
	formatMetricChange,
	getNoticeWeekBars,
	// Auto-show tracking
	wasNoticeShownToday,
	markNoticeShownToday,
};
