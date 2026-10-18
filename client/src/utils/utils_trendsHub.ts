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
	TrendSeriesPoint,
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
	"strength",
	"cardio",
	"walking",
	"effort",
];

// eg. validates the ':category' route param
const isTrendCategoryKey = (value: unknown): value is TrendCategoryKey => {
	return TREND_CATEGORY_KEYS.some((key) => key === value);
};

// FORMATTING (KPIs & breakdowns)

// eg. 36.54 (min/mile) => "36:32"
const formatPace = (minsPerMile: number): string => {
	const totalSeconds = Math.round(minsPerMile * 60);
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;
	return `${mins}:${String(secs).padStart(2, "0")}`;
};

const formatWhole = (value: number) => Math.round(value).toLocaleString();
const formatOneDecimal = (value: number) =>
	(Math.round(value * 10) / 10).toLocaleString();

// How each unit is shown, eg. 98.2 mins => "98 min", 1980 lb => "1,980 lb", 36.54 pace => "36:32/mi"
const UNIT_FORMATS: Record<TrendKpiUnit, (value: number) => string> = {
	mins: (value) => `${formatWhole(value)} min`,
	pct: (value) => `${formatWhole(value)}%`,
	count: (value) => formatOneDecimal(value),
	days: (value) => `${formatWhole(value)} days`,
	lb: (value) => `${formatWhole(value)} lb`,
	reps: (value) => `${formatWhole(value)} reps`,
	steps: (value) => `${formatWhole(value)} steps`,
	miles: (value) => `${formatOneDecimal(value)} mi`,
	pace: (value) => `${formatPace(value)}/mi`,
	kcal: (value) => `${formatWhole(value)} kcal`,
	score: (value) => `${formatOneDecimal(value)} / 5`,
};

const formatTrendValue = (value: number, unit: TrendKpiUnit): string => {
	return UNIT_FORMATS[unit](value);
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
// - NEGATIVE is amber, never red: declines need attention, not alarm

// Tinted background from a color (works in light & dark themes, no extra theme vars)
const tint = (color: string, pct: number) => {
	return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
};

const TONE_STYLES: Record<TrendTone, { color: string; bgColor: string }> = {
	POSITIVE: { color: "var(--accent-green)", bgColor: "var(--greenBG)" },
	// Amber, not red: a decline needs attention, but shouldn't feel like a scolding
	NEGATIVE: {
		color: "var(--accent-orange)",
		bgColor: tint("var(--accent-orange)", 18),
	},
	// Plain gray, so "steady" is easy to tell apart from both tones in either theme
	NEUTRAL: { color: "var(--text1_5)", bgColor: tint("var(--text1_5)", 15) },
};

// Exposes a tone's colors to SCSS as '--tone-color' & '--tone-bg'
const getToneStyles = (tone: TrendTone): CSSProperties => {
	const { color, bgColor } = TONE_STYLES[tone];
	return { "--tone-color": color, "--tone-bg": bgColor } as CSSProperties;
};

// The user's trends accent (Settings > Theme); defaults to --accent-blue (index.css)
const DEFAULT_SERIES_COLOR = "var(--trends-accent-primary)";

// Series without an entry use 'DEFAULT_SERIES_COLOR'
const SERIES_COLORS: Record<string, string> = {
	"scheduled-by-week": "var(--blueGrey800)",
	"completed-by-week": DEFAULT_SERIES_COLOR,
	"mins-by-week-strength": "var(--strengthAccent)",
	"mins-by-week-stretch": "var(--stretchAccent)",
	"mins-by-week-cardio": "var(--cardioAccent)",
	"mins-by-week-walk": "var(--walkAccent)",
	"mins-by-week-timed": "var(--timedAccent)",
	"mins-by-week-other": "var(--otherAccent)",
};

// Effort levels, lightest -> hardest: shades of the trends accent (never the green/amber tones)
const EFFORT_SERIES_LEVELS = [
	"effort-easy",
	"effort-moderate",
	"effort-hard",
	"effort-strenuous",
	"effort-allOut",
];

const getSeriesColor = (seriesKey: string): string => {
	const effortLevel = EFFORT_SERIES_LEVELS.indexOf(seriesKey);
	if (effortLevel >= 0) {
		return getAccentShade(effortLevel + 1, EFFORT_SERIES_LEVELS.length);
	}
	return SERIES_COLORS[seriesKey] ?? DEFAULT_SERIES_COLOR;
};

// Shade 'level' (1..levels) of the trends accent, lightest -> full color (eg. heat map cells, effort levels)
// - Shades of one color, so they never clash with the green/amber tone colors
const getAccentShade = (level: number, levels: number): string => {
	const minPct = 25;
	const pct =
		levels <= 1 ? 100 : minPct + ((100 - minPct) * (level - 1)) / (levels - 1);
	return tint(DEFAULT_SERIES_COLOR, Math.round(pct));
};

// TRENDS ACCENT (Settings > Theme)

export interface TrendsAccentPreset {
	label: string;
	color: string; // hex, so it can also seed the custom color input
}

// Curated from the app's accents (index.css). Green & orange are left out: they're the tone colors.
const TRENDS_ACCENT_PRESETS: TrendsAccentPreset[] = [
	{ label: "Blue", color: "#007cff" }, // default (--accent-blue)
	{ label: "Purple", color: "#7c3aed" },
	{ label: "Pink", color: "#ff0066" },
	{ label: "Yellow", color: "#f9f871" },
];

const DEFAULT_TRENDS_ACCENT = TRENDS_ACCENT_PRESETS[0].color;

// Hex values of the tone colors (keep in sync with --accent-green & --accent-orange in index.css)
const TONE_HEX_COLORS: { tone: TrendTone; color: string }[] = [
	{ tone: "POSITIVE", color: "#00e2bd" },
	{ tone: "NEGATIVE", color: "#ff7700" },
];

// How close (0-441, RGB distance) an accent can get to a tone color before we show a hint
const TONE_CONFLICT_DISTANCE = 100;

const hexToRgb = (hex: string): [number, number, number] | null => {
	const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
	if (!match) return null;
	return [
		parseInt(match[1], 16),
		parseInt(match[2], 16),
		parseInt(match[3], 16),
	];
};

// The tone an accent could be mistaken for (eg. a teal accent vs the green "improvement" tone)
const getAccentToneConflict = (hex: string): TrendTone | null => {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;

	const conflict = TONE_HEX_COLORS.find(({ color }) => {
		const toneRgb = hexToRgb(color);
		if (!toneRgb) return false;
		const distance = Math.hypot(
			rgb[0] - toneRgb[0],
			rgb[1] - toneRgb[1],
			rgb[2] - toneRgb[2],
		);
		return distance < TONE_CONFLICT_DISTANCE;
	});
	return conflict?.tone ?? null;
};

// HEAT MAP (consistency: workouts by day & hour)

const HEATMAP_CONFIG = {
	LEVELS: 4, // shades of the accent (each = a quarter of the busiest cell)
	MIN_START_HOUR: 6, // the hour range always covers at least 6am-8pm...
	MIN_END_HOUR: 20,
	PADDING_HOURS: 1, // ...plus an hour either side of the earliest/latest workout
	MIN_WORKOUTS: 5, // fewer timed workouts than this: show an empty state instead
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LABELS_LONG = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export interface HeatMapCell {
	dayOfWeek: number; // 0 = Sunday
	hour: number; // 0-23
	value: number;
	level: number; // 0 = empty, 1..LEVELS
}
export interface HeatMapGrid {
	hours: number[]; // the columns, in order
	rows: { dayOfWeek: number; label: string; cells: HeatMapCell[] }[];
	total: number;
	peak: HeatMapCell | null; // the busiest cell (earliest day/hour on ties)
}

// eg. 9 => "9am", 12 => "12pm", 20 => "8pm"; short: "9a", "12p", "8p"
const formatHour = (hour: number, short: boolean = false): string => {
	const suffix = hour < 12 ? "am" : "pm";
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;
	return `${hour12}${short ? suffix[0] : suffix}`;
};

// eg. "Mon 9am · 13 workouts"
const formatHeatMapCell = (cell: HeatMapCell): string => {
	const workouts = cell.value === 1 ? "workout" : "workouts";
	return `${DAY_LABELS[cell.dayOfWeek]} ${formatHour(cell.hour)} · ${cell.value} ${workouts}`;
};

// eg. "Mondays at 9am"
const formatHeatMapPeak = (cell: HeatMapCell): string => {
	return `${DAY_LABELS_LONG[cell.dayOfWeek]}s at ${formatHour(cell.hour)}`;
};

// Sparse "dayOfWeek:hour" points => a full grid (7 day rows x trimmed hour columns)
const toHeatMapGrid = (points: TrendSeriesPoint[]): HeatMapGrid => {
	const { LEVELS, MIN_START_HOUR, MIN_END_HOUR, PADDING_HOURS } =
		HEATMAP_CONFIG;
	const values = new Map<string, number>();
	let total = 0;

	points.forEach(({ x, y }) => {
		values.set(x, y);
		total += y;
	});

	const activeHours = points.map(({ x }) => Number(x.split(":")[1]));
	const startHour = Math.max(
		0,
		Math.min(
			MIN_START_HOUR,
			...activeHours.map((hour) => hour - PADDING_HOURS),
		),
	);
	const endHour = Math.min(
		23,
		Math.max(MIN_END_HOUR, ...activeHours.map((hour) => hour + PADDING_HOURS)),
	);
	const hours = Array.from(
		{ length: endHour - startHour + 1 },
		(_, idx) => startHour + idx,
	);
	const maxValue = Math.max(...points.map(({ y }) => y), 1);

	let peak: HeatMapCell | null = null;
	const rows = DAY_LABELS.map((label, dayOfWeek) => {
		const cells = hours.map((hour) => {
			const value = values.get(`${dayOfWeek}:${hour}`) ?? 0;
			const level = value ? Math.ceil((value / maxValue) * LEVELS) : 0;
			const cell: HeatMapCell = { dayOfWeek, hour, value, level };
			if (value && (!peak || value > peak.value)) peak = cell;
			return cell;
		});
		return { dayOfWeek, label, cells };
	});

	return { hours, rows, total, peak };
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
	getAccentShade,
	// Heat map
	HEATMAP_CONFIG,
	toHeatMapGrid,
	formatHour,
	formatHeatMapCell,
	formatHeatMapPeak,
	// Trends accent
	TRENDS_ACCENT_PRESETS,
	DEFAULT_TRENDS_ACCENT,
	getAccentToneConflict,
	// Dates
	formatSeriesLabel,
	formatPeriodRange,
};
