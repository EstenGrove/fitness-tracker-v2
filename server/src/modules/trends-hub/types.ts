import type { Activity } from "../types.js";

export type TrendPeriodKey = "4W" | "12W" | "6M" | "1Y";
export type TrendCategoryKey = "consistency" | "volume" | "adherence"; // Phase 2-3 add more

export type TrendKpiUnit = "mins" | "pct" | "count" | "days";
export type TrendBetterWhen = "higher" | "lower" | "none"; // none = neither good nor bad (eg. time vs target)
export type TrendChangeType = "relative" | "points"; // points: for rates, eg. 94% -> 100% = +6 pts
export type TrendTone = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

/**
 * API RESPONSE SHAPE
 * - Every category returns this same shape, so one hub & one detail template can render all of them
 */

export interface TrendKpi {
	key: string;
	label: string; // "Active days"
	value: number;
	prior: number | null; // null = not enough history (or no comparison for this KPI)
	change: number | null; // relative % or points, per 'changeType'; null when there's no prior
	changeType: TrendChangeType;
	unit: TrendKpiUnit;
	betterWhen: TrendBetterWhen; // pace = lower
	tone: TrendTone; // computed server-side; the client only maps it to a color (NEGATIVE = amber)
}
export interface TrendSeriesPoint {
	x: string;
	y: number;
}
export interface TrendSeries {
	key: string;
	label: string;
	points: TrendSeriesPoint[]; // x = weekStart or day/hour bucket
}
export interface TrendInsight {
	key: string; // stable id, eg. "best-day"
	tone: TrendTone;
	text: string; // template-built, numbers filled in by code
}
export interface TrendPeriod {
	key: TrendPeriodKey;
	startDate: string;
	endDate: string;
	weeks: number;
}
export interface TrendBreakdownItem {
	key: string;
	label: string; // "Stretch", "5-Min Stretch"
	value: number;
	prior: number | null;
	share: number | null; // % of the breakdown's total (eg. share of minutes)
	unit: TrendKpiUnit;
}
export interface TrendBreakdown {
	key: string;
	label: string; // "Minutes by activity"
	items: TrendBreakdownItem[];
}
export interface TrendCategoryData {
	category: TrendCategoryKey;
	period: TrendPeriod;
	kpis: TrendKpi[]; // 3-4; the first is the hub card's headline
	series: TrendSeries[]; // the first is the main weekly chart
	breakdowns: TrendBreakdown[];
	insights: TrendInsight[]; // max 3, in priority order
}

// The hub (/trends): one card per category, derived from its data (no separate queries)
export interface TrendCategoryCard {
	category: TrendCategoryKey;
	kpi: TrendKpi; // the category's headline KPI
	insight: TrendInsight | null; // its top insight
}
export interface TrendsOverview {
	period: TrendPeriod;
	cards: TrendCategoryCard[]; // in registry order; a category that failed to load is left out
}

/**
 * INSIGHT RULES
 * - Each category defines an ordered list of rules; the first few that return an insight are shown
 */

export interface InsightRule<TContext> {
	key: string;
	build: (context: TContext) => TrendInsight | null; // null = doesn't apply
}

/**
 * RAW SQL OUTPUT
 * - Shapes returned by the 'get_trends_*' functions (db/migrations/003_trends_hub.sql)
 * - 'current' & 'prior' always share the same totals shape
 */

export interface RawTrendPeriod {
	startDate: string;
	endDate: string;
	lastWeekStart: string;
	weeks: number;
}
export interface RawTrendPriorPeriod {
	startDate: string;
	endDate: string;
}
interface RawTrendBase<TTotals, TWeek> {
	period: RawTrendPeriod;
	priorPeriod: RawTrendPriorPeriod;
	current: TTotals;
	prior: TTotals;
	weeks: TWeek[]; // current period only, oldest -> newest, zero-filled
}

// CONSISTENCY
export interface RawConsistencyTotals {
	workouts: number;
	activeDays: number;
	totalDays: number;
	longestStreak: number;
}
export interface RawConsistencyWeek {
	weekStart: string;
	workouts: number;
	activeDays: number;
}
export interface RawDayOfWeekTotal {
	dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
	workouts: number;
}
export interface RawDayAndHourTotal extends RawDayOfWeekTotal {
	hour: number; // 0-23, America/Phoenix
}
export interface RawConsistency extends RawTrendBase<
	RawConsistencyTotals,
	RawConsistencyWeek
> {
	firstWorkoutDate: string | null;
	byDayOfWeek: RawDayOfWeekTotal[]; // always 7 rows
	byDayAndHour: RawDayAndHourTotal[]; // sparse: non-zero buckets only
}
// From 'get_current_workout_streak' (StreaksService), with dates as "YYYY-MM-DD"
// - Note: returns the most recent streak even if it has ended; the builder checks 'endDate'
export interface RawWorkoutStreak {
	days: number;
	endDate: string | null;
}
// The streak + the DB's current date, so "is it still current?" uses the DB's calendar (not Node's)
export interface RawWorkoutStreakStatus {
	streak: RawWorkoutStreak | null;
	today: string; // "YYYY-MM-DD"
}

// VOLUME
export interface RawVolumeTotals {
	workouts: number;
	totalMins: number;
	avgSessionMins: number | null; // null when there were no workouts
	targetedWorkouts: number; // sessions whose workout has a target duration
	targetedMins: number; // actual mins of those sessions
	targetMins: number; // their target mins
}
export interface RawVolumeWeek {
	weekStart: string;
	totalMins: number;
	workouts: number;
}
export interface RawVolumeActivityWeek {
	weekStart: string;
	activityType: Activity;
	totalMins: number;
}
export interface RawVolumeActivity {
	activityType: Activity;
	currentMins: number;
	currentWorkouts: number;
	priorMins: number;
	priorWorkouts: number;
}
export interface RawVolume extends RawTrendBase<
	RawVolumeTotals,
	RawVolumeWeek
> {
	firstWorkoutDate: string | null;
	weeksByActivity: RawVolumeActivityWeek[]; // sparse: non-zero only
	byActivity: RawVolumeActivity[]; // sorted by currentMins, desc
}

// ADHERENCE
export interface RawAdherenceTotals {
	scheduled: number;
	completed: number;
	skipped: number;
	missed: number;
}
export interface RawAdherenceWeek extends RawAdherenceTotals {
	weekStart: string;
}
export interface RawAdherenceWorkout extends RawAdherenceTotals {
	activityType: Activity;
	workoutID: number;
	workoutName: string | null;
}
export interface RawAdherence extends RawTrendBase<
	RawAdherenceTotals,
	RawAdherenceWeek
> {
	firstScheduledDate: string | null;
	byWorkout: RawAdherenceWorkout[]; // sorted by (skipped + missed), desc
}
