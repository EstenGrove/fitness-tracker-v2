import { CSSProperties } from "react";
import { format, parseISO } from "date-fns";
import { AsyncResponse } from "../features/types";
import { currentEnv, trendsHubApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import {
	TrendCategoryData,
	TrendCategoryKey,
	TrendKpi,
	TrendKpiUnit,
	TrendPeriod,
	TrendPeriodKey,
	TrendTone,
	TrendsOverview,
} from "../features/trends-hub/types";

export type TrendsOverviewResp = AsyncResponse<{ overview: TrendsOverview }>;
export type TrendCategoryResp = AsyncResponse<{
	categoryData: TrendCategoryData;
}>;

// REQUESTS

const getTrendsOverview = async (
	userID: string,
	period: TrendPeriodKey,
): TrendsOverviewResp => {
	let url = currentEnv.base + trendsHubApis.getOverview;
	url += "?" + new URLSearchParams({ userID, period });

	try {
		const response = await fetchWithAuth(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
};

const getTrendCategory = async (
	userID: string,
	category: TrendCategoryKey,
	period: TrendPeriodKey,
): TrendCategoryResp => {
	let url = currentEnv.base + trendsHubApis.getCategory;
	url += "?" + new URLSearchParams({ userID, category, period });

	try {
		const response = await fetchWithAuth(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
};

// PERIODS

// Order = order in the period selector
const TREND_PERIODS: { key: TrendPeriodKey; label: string }[] = [
	{ key: "4W", label: "4W" },
	{ key: "12W", label: "12W" },
	{ key: "6M", label: "6M" },
	{ key: "1Y", label: "1Y" },
];

const DEFAULT_TREND_PERIOD: TrendPeriodKey = "12W";

const isTrendPeriodKey = (value: unknown): value is TrendPeriodKey => {
	return TREND_PERIODS.some((period) => period.key === value);
};

// CATEGORIES

const TREND_CATEGORY_KEYS: TrendCategoryKey[] = [
	"consistency",
	"volume",
	"adherence",
];

// eg. validates the ':category' route param
const isTrendCategoryKey = (value: unknown): value is TrendCategoryKey => {
	return TREND_CATEGORY_KEYS.some((key) => key === value);
};

// FORMATTING (KPIs & breakdowns)

const UNIT_SUFFIXES: Record<TrendKpiUnit, string> = {
	mins: " min",
	pct: "%",
	count: "",
	days: " days",
};

// eg. 98.2 mins => "98 min", 94 pct => "94%", 1.5 count => "1.5", 34 days => "34 days"
const formatTrendValue = (value: number, unit: TrendKpiUnit): string => {
	const isWhole = unit === "mins" || unit === "pct" || unit === "days";
	const rounded = isWhole ? Math.round(value) : Math.round(value * 10) / 10;
	return `${rounded.toLocaleString()}${UNIT_SUFFIXES[unit]}`;
};

// eg. relative -42.3 => "−42%", points on a pct KPI 6 => "+6 pts", points on a count KPI 13 => "+13"
// - null when there's no comparison (no prior period)
const formatKpiChange = (kpi: TrendKpi): string | null => {
	const { change, changeType, unit } = kpi;
	if (change === null) return null;

	const sign = change > 0 ? "+" : change < 0 ? "−" : "";
	const amount = Math.abs(Math.round(change));
	if (changeType === "relative") return `${sign}${amount}%`;
	return unit === "pct" ? `${sign}${amount} pts` : `${sign}${amount}`;
};

// COLORS
// - All trends colors live here, so restyling is a one-line change
// - NEGATIVE is calm blue, never red (same rule as the AI trend notice)

const TONE_STYLES: Record<TrendTone, { color: string; bgColor: string }> = {
	POSITIVE: { color: "var(--accent-green)", bgColor: "var(--greenBG)" },
	NEGATIVE: { color: "var(--accent-blue)", bgColor: "var(--blueBG)" },
	NEUTRAL: { color: "var(--text1_5)", bgColor: "var(--blueGrey800)" },
};

// Exposes a tone's colors to SCSS as '--tone-color' & '--tone-bg'
const getToneStyles = (tone: TrendTone): CSSProperties => {
	const { color, bgColor } = TONE_STYLES[tone];
	return { "--tone-color": color, "--tone-bg": bgColor } as CSSProperties;
};

const DEFAULT_SERIES_COLOR = "var(--accent-blue)";

// Series without an entry use 'DEFAULT_SERIES_COLOR'
const SERIES_COLORS: Record<string, string> = {
	"scheduled-by-week": "var(--blueGrey800)",
	"completed-by-week": "var(--accent-blue)",
	"mins-by-week-strength": "var(--strengthAccent)",
	"mins-by-week-stretch": "var(--stretchAccent)",
	"mins-by-week-cardio": "var(--cardioAccent)",
	"mins-by-week-walk": "var(--walkAccent)",
	"mins-by-week-timed": "var(--timedAccent)",
	"mins-by-week-other": "var(--otherAccent)",
};

const getSeriesColor = (seriesKey: string): string => {
	return SERIES_COLORS[seriesKey] ?? DEFAULT_SERIES_COLOR;
};

// DATES

const isISODate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

// Chart x labels: "2026-07-06" => "Jul 6"; anything else (eg. "Mon") is shown as-is
const formatSeriesLabel = (x: string): string => {
	return isISODate(x) ? format(parseISO(x), "MMM d") : x;
};

// eg. "Jul 6 – Sep 26"
const formatPeriodRange = (period: TrendPeriod): string => {
	const start = format(parseISO(period.startDate), "MMM d");
	const end = format(parseISO(period.endDate), "MMM d");
	return `${start} – ${end}`;
};

export {
	// Requests
	getTrendsOverview,
	getTrendCategory,
	// Periods
	TREND_PERIODS,
	DEFAULT_TREND_PERIOD,
	isTrendPeriodKey,
	// Categories
	TREND_CATEGORY_KEYS,
	isTrendCategoryKey,
	// Formatting
	formatTrendValue,
	formatKpiChange,
	// Colors
	getToneStyles,
	getSeriesColor,
	// Dates
	formatSeriesLabel,
	formatPeriodRange,
};
