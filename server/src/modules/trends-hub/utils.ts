import { format, parseISO } from "date-fns";
import { round } from "../../utils/misc.js";
import { PERIOD_LABELS, PERIOD_WEEKS, TRENDS_HUB_CONFIG } from "./config.js";
import type {
	InsightRule,
	RawTrendPeriod,
	RawTrendPriorPeriod,
	TrendBetterWhen,
	TrendBreakdown,
	TrendBreakdownItem,
	TrendChangeType,
	TrendInsight,
	TrendKpi,
	TrendKpiUnit,
	TrendPeriod,
	TrendPeriodKey,
	TrendSeries,
	TrendSeriesPoint,
	TrendTone,
} from "./types.js";

/**
 * Shared pure helpers for the category builders (categories/*.ts)
 * - No DB access & no side effects, so they're easy to unit test
 */

// PERIODS & HISTORY

const isTrendPeriodKey = (value: unknown): value is TrendPeriodKey => {
	// 'Object.hasOwn' (not 'in'), so prototype keys like "toString" aren't accepted
	return typeof value === "string" && Object.hasOwn(PERIOD_WEEKS, value);
};

const toTrendPeriod = (
	key: TrendPeriodKey,
	period: RawTrendPeriod,
): TrendPeriod => {
	return {
		key,
		startDate: period.startDate,
		endDate: period.endDate,
		weeks: period.weeks,
	};
};

// eg. "12W" => "the previous 12 weeks"
const getPriorPeriodLabel = (key: TrendPeriodKey): string => {
	return `the previous ${PERIOD_LABELS[key]}`;
};

// The prior period only counts if the user's data started on/before it (otherwise it's partly empty)
// - 'firstDate' is the first workout (or first scheduled) date; "YYYY-MM-DD" compares lexically
const hasFullPriorPeriod = (
	firstDate: string | null,
	priorPeriod: RawTrendPriorPeriod,
): boolean => {
	if (!firstDate) return false;
	return firstDate.slice(0, 10) <= priorPeriod.startDate;
};

// Weeks of data the user has within the current period (for the 'MIN_WEEKS_OF_HISTORY' guard)
const getWeeksOfHistory = (
	firstDate: string | null,
	period: RawTrendPeriod,
): number => {
	if (!firstDate) return 0;
	const first = firstDate.slice(0, 10);
	if (first <= period.startDate) return period.weeks;

	const msPerWeek = 7 * 24 * 60 * 60 * 1000;
	const periodEnd = Date.parse(period.endDate);
	const weeks = Math.floor((periodEnd - Date.parse(first)) / msPerWeek) + 1;
	return Math.max(0, Math.min(weeks, period.weeks));
};

const hasEnoughHistory = (
	firstDate: string | null,
	period: RawTrendPeriod,
): boolean => {
	const weeks = getWeeksOfHistory(firstDate, period);
	return weeks >= TRENDS_HUB_CONFIG.MIN_WEEKS_OF_HISTORY;
};

// MATH

// eg. (7, 28) => 25; null when there's nothing to divide by
const toPercent = (part: number, whole: number): number | null => {
	if (!whole) return null;
	return round((part / whole) * 100, 1);
};

// Not rounded: 'buildKpi' computes changes from exact values & rounds only what it returns
const perWeek = (total: number, weeks: number): number => {
	if (!weeks) return 0;
	return total / weeks;
};

// Percent change from 'prior' to 'value'; null when there's no usable baseline
const getPctChange = (value: number, prior: number | null): number | null => {
	if (prior === null || prior === 0) return null;
	return round(((value - prior) / prior) * 100, 1);
};

// Relative: % change. Points: plain difference (for rates, eg. 94% vs 100% = -6 pts)
const getChange = (
	value: number,
	prior: number | null,
	changeType: TrendChangeType,
): number | null => {
	if (prior === null) return null;
	if (changeType === "points") return round(value - prior, 1);
	return getPctChange(value, prior);
};

// TONE

export interface ToneOptions {
	betterWhen: TrendBetterWhen;
	changeType: TrendChangeType;
	minChange?: number; // defaults to the 'STEADY_CHANGE' for the change type
}

// Whether a change is good, bad or steady (respects 'betterWhen', eg. pace = lower)
const getChangeTone = (
	change: number | null,
	options: ToneOptions,
): TrendTone => {
	const { betterWhen, changeType } = options;
	const minChange =
		options.minChange ?? TRENDS_HUB_CONFIG.STEADY_CHANGE[changeType];

	if (change === null || betterWhen === "none") return "NEUTRAL";
	if (Math.abs(change) < minChange) return "NEUTRAL";

	const isUp = change > 0;
	const isBetter = betterWhen === "higher" ? isUp : !isUp;
	return isBetter ? "POSITIVE" : "NEGATIVE";
};

// KPIS

export interface BuildKpiParams {
	key: string;
	label: string;
	unit: TrendKpiUnit;
	value: number | null;
	prior: number | null; // pass null when the prior period isn't usable (see 'hasFullPriorPeriod')
	betterWhen?: TrendBetterWhen;
	changeType?: TrendChangeType;
	// A drop doesn't read as NEGATIVE while the value is still at/above this level (eg. 94% active days)
	neutralAbove?: number;
}

const buildKpi = ({
	key,
	label,
	unit,
	value,
	prior,
	betterWhen = "higher",
	changeType = "relative",
	neutralAbove,
}: BuildKpiParams): TrendKpi => {
	// The change comes from the exact values: rounding first distorts small values
	// (eg. 0.48 vs 0.12 miles/week would become 0.5 vs 0.1: +400% instead of +300%)
	const current = value ?? 0;
	const change = getChange(current, prior, changeType);

	const tone = getChangeTone(change, { betterWhen, changeType });
	const isHighLevel = neutralAbove !== undefined && current >= neutralAbove;

	return {
		key,
		label,
		value: round(current, 1),
		prior: prior === null ? null : round(prior, 1),
		change,
		changeType,
		unit,
		betterWhen,
		tone: tone === "NEGATIVE" && isHighLevel ? "NEUTRAL" : tone,
	};
};

// SERIES & BREAKDOWNS

const buildSeries = <T>(
	key: string,
	label: string,
	rows: T[],
	toPoint: (row: T) => TrendSeriesPoint,
): TrendSeries => {
	return {
		key,
		label,
		points: rows.map(toPoint),
	};
};

// Adds each item's 'share' of the breakdown's total
// - 'withShare': false when values aren't parts of a whole (eg. completion rates), so share = null
const buildBreakdown = (
	key: string,
	label: string,
	items: Omit<TrendBreakdownItem, "share">[],
	withShare: boolean = true,
): TrendBreakdown => {
	const total = items.reduce((sum, item) => sum + item.value, 0);

	return {
		key,
		label,
		items: items.map((item) => ({
			...item,
			share: withShare ? toPercent(item.value, total) : null,
		})),
	};
};

// INSIGHTS

// Runs the rules in order & keeps the first 'max' that apply
const pickInsights = <TContext>(
	rules: InsightRule<TContext>[],
	context: TContext,
	max: number = TRENDS_HUB_CONFIG.MAX_INSIGHTS,
): TrendInsight[] => {
	const insights: TrendInsight[] = [];

	for (const rule of rules) {
		if (insights.length >= max) break;
		const insight = rule.build(context);
		if (insight) insights.push(insight);
	}
	return insights;
};

export interface MomentumParams<TWeek> {
	key?: string;
	weeks: TWeek[]; // oldest -> newest
	getValue: (weeks: TWeek[]) => number | null; // eg. avg active days per week, completion rate
	changeType: TrendChangeType;
	betterWhen: TrendBetterWhen;
	toText: (values: {
		recent: number;
		earlier: number;
		change: number;
	}) => string;
}

// Shared "momentum" rule: the last 'MOMENTUM_WEEKS' weeks vs the rest of the period.
// - Surfaces stories that period totals hide, eg. "dipped, then recovered"
// - Only applies to periods longer than 'MOMENTUM_WEEKS'
const buildMomentumInsight = <TWeek>({
	key = "momentum",
	weeks,
	getValue,
	changeType,
	betterWhen,
	toText,
}: MomentumParams<TWeek>): TrendInsight | null => {
	const { MOMENTUM_WEEKS, MOMENTUM_MIN_CHANGE } = TRENDS_HUB_CONFIG;
	if (weeks.length <= MOMENTUM_WEEKS) return null;

	const recent = getValue(weeks.slice(-MOMENTUM_WEEKS));
	const earlier = getValue(weeks.slice(0, -MOMENTUM_WEEKS));
	if (recent === null || earlier === null) return null;

	const change = getChange(recent, earlier, changeType);
	const minChange = MOMENTUM_MIN_CHANGE[changeType];
	if (change === null || Math.abs(change) < minChange) return null;

	return {
		key,
		tone: getChangeTone(change, { betterWhen, changeType, minChange }),
		text: toText({
			recent: round(recent, 1),
			earlier: round(earlier, 1),
			change,
		}),
	};
};

// INSIGHT TEXT

// eg. 12198 => "12,198"
const formatCount = (value: number): string => {
	return Math.round(value).toLocaleString("en-US");
};

// eg. 36.54 (min/mile) => "36:32"
const formatPace = (minsPerMile: number): string => {
	const totalSeconds = Math.round(minsPerMile * 60);
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;
	return `${mins}:${String(secs).padStart(2, "0")}`;
};

// eg. "2026-07-13" => "Jul 13"
const formatShortDate = (date: string): string => {
	return format(parseISO(date.slice(0, 10)), "MMM d");
};

// eg. ["A"] => "A", ["A", "B"] => "A and B", ["A", "B", "C", "D"] => "A, B and 2 others"
const formatNameList = (names: string[], maxNames: number = 2): string => {
	if (names.length <= 1) return names[0] ?? "";
	if (names.length <= maxNames) {
		return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
	}
	const others = names.length - maxNames;
	return `${names.slice(0, maxNames).join(", ")} and ${others} other${others === 1 ? "" : "s"}`;
};

export {
	// Periods & history
	isTrendPeriodKey,
	toTrendPeriod,
	getPriorPeriodLabel,
	hasFullPriorPeriod,
	getWeeksOfHistory,
	hasEnoughHistory,
	// Math
	toPercent,
	perWeek,
	getPctChange,
	getChange,
	// Tone & KPIs
	getChangeTone,
	buildKpi,
	// Series & breakdowns
	buildSeries,
	buildBreakdown,
	// Insights
	pickInsights,
	buildMomentumInsight,
	// Insight text
	formatCount,
	formatPace,
	formatShortDate,
	formatNameList,
};
