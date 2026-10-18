// Mirrors the server's API shapes (server/src/modules/trends-hub/types.ts)

export type TrendPeriodKey = "4W" | "12W" | "6M" | "1Y";
export type TrendCategoryKey =
	| "consistency"
	| "volume"
	| "adherence"
	| "strength"
	| "cardio"
	| "walking"
	| "effort";

export type TrendKpiUnit =
	| "mins"
	| "pct"
	| "count"
	| "days"
	| "lb" // weight & volume (weight x reps)
	| "reps"
	| "steps"
	| "miles"
	| "pace" // minutes per mile (shown as mm:ss/mi)
	| "kcal"
	| "score"; // effort, 1 (Easy) - 5 (All Out)
export type TrendBetterWhen = "higher" | "lower" | "none";
export type TrendChangeType = "relative" | "points"; // points: plain difference (eg. 94% -> 100% = +6 pts)
export type TrendTone = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export interface TrendKpi {
	key: string;
	label: string;
	value: number;
	prior: number | null; // null = not enough history (or no comparison for this KPI)
	change: number | null; // relative % or points, per 'changeType'
	changeType: TrendChangeType;
	unit: TrendKpiUnit;
	betterWhen: TrendBetterWhen;
	tone: TrendTone; // computed server-side; NEGATIVE shows as amber, never red
}
export interface TrendSeriesPoint {
	x: string; // weekStart ("YYYY-MM-DD"), weekday ("Mon") or heat map bucket ("dayOfWeek:hour")
	y: number;
}
export interface TrendSeries {
	key: string;
	label: string;
	points: TrendSeriesPoint[];
}
export interface TrendBreakdownItem {
	key: string;
	label: string;
	value: number;
	prior: number | null;
	share: number | null; // % of the breakdown's total; null when values aren't parts of a whole
	unit: TrendKpiUnit;
}
export interface TrendBreakdown {
	key: string;
	label: string;
	items: TrendBreakdownItem[];
}
export interface TrendInsight {
	key: string;
	tone: TrendTone;
	text: string;
}
export interface TrendPeriod {
	key: TrendPeriodKey;
	startDate: string;
	endDate: string;
	weeks: number;
}

// A category's detail page (/trends/:category)
export interface TrendCategoryData {
	category: TrendCategoryKey;
	period: TrendPeriod;
	kpis: TrendKpi[]; // the first is the hub card's headline
	series: TrendSeries[]; // the first is the main weekly chart
	breakdowns: TrendBreakdown[];
	insights: TrendInsight[]; // max 3, in priority order
}

// The hub (/trends)
export interface TrendCategoryCard {
	category: TrendCategoryKey;
	kpi: TrendKpi;
	insight: TrendInsight | null;
}
export interface TrendsOverview {
	period: TrendPeriod;
	cards: TrendCategoryCard[]; // a category that failed to load is left out
}

export interface TrendCategoryParams {
	userID: string;
	category: TrendCategoryKey;
	period: TrendPeriodKey;
}
export interface TrendsOverviewParams {
	userID: string;
	period: TrendPeriodKey;
}
