import type { Activity } from "../types.js";

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

// STRENGTH (get_trends_strength)
export interface RawStrengthTotals {
	sessions: number;
	volume: number; // lb (weight x reps)
	bestE1rm: number | null;
}
export interface RawStrengthWeek {
	weekStart: string;
	volume: number;
	sessions: number;
}
export interface RawStrengthWorkout {
	workoutID: number;
	workoutName: string | null;
	currentSessions: number;
	currentVolume: number;
	priorSessions: number;
	priorVolume: number;
	// The current period's best set (estimated 1-rep max) & the session that first reached it
	bestE1rm: number | null;
	bestWeight: number | null;
	bestReps: number | null;
	bestDate: string | null;
	previousBestE1rm: number | null; // best from ALL history before the current period
	sessionsSinceBest: number;
	lastSessionDate: string | null;
}
export interface RawStrength extends RawTrendBase<
	RawStrengthTotals,
	RawStrengthWeek
> {
	firstWorkoutDate: string | null;
	weeksByWorkout: { weekStart: string; workoutID: number; volume: number }[]; // sparse
	byWorkout: RawStrengthWorkout[]; // sorted by current volume, desc
}

// EFFORT (get_trends_effort)
export interface RawEffortTotals {
	sessions: number;
	ratedSessions: number; // effort logged (not 'None')
	hardSessions: number; // Hard, Strenuous or All Out
	avgScore: number | null; // 1-5
	hardDays: number;
	backToBackHardDays: number; // hard days whose previous day was also hard
	calories: number; // ESTIMATED
	totalMins: number;
}
export interface RawEffortWeek {
	weekStart: string;
	easy: number;
	moderate: number;
	hard: number;
	strenuous: number;
	allOut: number;
	unrated: number;
	calories: number;
}
export interface RawEffortActivity {
	activityType: Activity;
	currentSessions: number;
	currentAvgScore: number | null;
	priorAvgScore: number | null;
}
export interface RawEffort extends RawTrendBase<
	RawEffortTotals,
	RawEffortWeek
> {
	firstWorkoutDate: string | null;
	byActivity: RawEffortActivity[]; // sorted by current sessions, desc
}

// CARDIO & WALKING (get_trends_cardio_walking: one query, read by the 'cardio' & 'walking' categories)
export interface RawCardioTotals {
	sessions: number;
	reps: number;
	bestSessionReps: number | null;
}
export interface RawWalkTotals {
	walks: number;
	miles: number;
	steps: number;
	mins: number;
	pace: number | null; // min per mile (total mins / total miles)
}
export interface RawCardioWalkingWeek {
	weekStart: string;
	cardioReps: number;
	cardioSessions: number;
	walkMiles: number;
	walkSteps: number;
	walks: number;
}
export interface RawCardioWalking {
	period: RawTrendPeriod;
	priorPeriod: RawTrendPriorPeriod;
	firstCardioDate: string | null;
	firstWalkDate: string | null;
	cardio: {
		current: RawCardioTotals;
		prior: RawCardioTotals;
		bestSession: {
			date: string;
			reps: number;
			workoutName: string | null;
		} | null;
		byWorkout: {
			workoutID: number;
			workoutName: string | null;
			currentSessions: number;
			currentReps: number;
			priorReps: number;
		}[];
	};
	walking: {
		current: RawWalkTotals;
		prior: RawWalkTotals;
		longestWalk: {
			date: string;
			miles: number;
			workoutName: string | null;
		} | null;
		byWorkout: {
			workoutID: number;
			workoutName: string | null;
			currentWalks: number;
			currentMiles: number;
			priorMiles: number;
		}[];
	};
	weeks: RawCardioWalkingWeek[]; // current period only, oldest -> newest, zero-filled
}
