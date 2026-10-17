import { TREND_NOTICES_CONFIG } from "./config.js";
import type {
	DetectedAITrend,
	AIMetricDirection,
	AINoticeDirection,
	AINoticeMetric,
	AINoticeMetrics,
	AIPriorNotice,
	AIWeeklyTotal,
	AIWeeklyTotalsData,
} from "./types.js";
import { average, round } from "../../utils/misc.js";

export type TrendNoticesConfig = typeof TREND_NOTICES_CONFIG;

const toISODate = (date: string): string => date.slice(0, 10);

// Date math in UTC on "YYYY-MM-DD" strings, so server timezone never matters
const addDays = (isoDate: string, days: number): string => {
	const [year, month, day] = toISODate(isoDate).split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day + days));
	return date.toISOString().slice(0, 10);
};

export interface AIMetricOpts {
	minDelta: number;
	pctThreshold: number;
}

const buildMetric = (
	recent: number,
	prior: number,
	opts: AIMetricOpts,
): AINoticeMetric => {
	const { minDelta, pctThreshold } = opts;

	const delta = recent - prior;
	const pct = delta / prior;
	const hasPctChange = Math.abs(pct) >= pctThreshold;
	const hasMinDelta = Math.abs(delta) >= minDelta;
	const isNotable = hasPctChange && hasMinDelta;
	const isStable = !isNotable;
	const hasPosDelta = delta > 0;

	const changedDirection = hasPosDelta ? "POSITIVE" : "NEGATIVE";
	const direction: AIMetricDirection = isStable ? "STABLE" : changedDirection;

	const roundedRecent = round(recent);
	const roundedPrior = round(prior);
	const roundedPct = round(pct * 100);

	return {
		recent: roundedRecent,
		prior: roundedPrior,
		pctChange: roundedPct,
		direction: direction,
	};
};

// All notable metrics up => POSITIVE, all down => NEGATIVE, otherwise MIXED
const getNoticeDirection = (
	metrics: AINoticeMetrics,
): AINoticeDirection | null => {
	const notable = Object.values(metrics)
		.map((metric) => metric.direction)
		.filter((direction) => direction !== "STABLE");

	if (!notable.length) return null;
	if (notable.every((direction) => direction === "POSITIVE")) return "POSITIVE";
	if (notable.every((direction) => direction === "NEGATIVE")) return "NEGATIVE";
	return "MIXED";
};

// A rolling 4-vs-4 comparison stays "notable" for several weeks after a single shift,
// so suppress the notice if the most recent one (within the window) has the same direction.
const isInCooldown = (
	direction: AINoticeDirection,
	lastWeekStart: string,
	priorNotices: AIPriorNotice[],
	windowWeeks: number,
): boolean => {
	const cutoff = addDays(lastWeekStart, -7 * windowWeeks);
	const current = toISODate(lastWeekStart);
	const latest = priorNotices
		.map((notice) => ({ ...notice, weekStart: toISODate(notice.weekStart) }))
		.filter((notice) => notice.weekStart > cutoff && notice.weekStart < current)
		.sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0];

	return !!latest && latest.direction === direction;
};

/**
 * Compares the last `WINDOW_WEEKS` completed weeks against the `WINDOW_WEEKS` before them.
 * Returns null when there's no notable change (or not enough history to judge one).
 */
export const detectTrend = (
	data: AIWeeklyTotalsData,
	priorNotices: AIPriorNotice[] = [],
	config: TrendNoticesConfig = TREND_NOTICES_CONFIG,
): DetectedAITrend | null => {
	const { WINDOW_WEEKS, PCT_THRESHOLD, MIN_DELTA_MINS, MIN_DELTA_WORKOUTS } =
		config;
	const { lastWeekStart, firstWorkoutDate } = data;

	if (data.weeks.length < WINDOW_WEEKS * 2) return null;

	// oldest -> newest; don't rely on the SQL ordering
	const weeks: AIWeeklyTotal[] = [...data.weeks]
		.sort((a, b) => a.weekStart.localeCompare(b.weekStart))
		.slice(-WINDOW_WEEKS * 2);
	const priorWeeks = weeks.slice(0, WINDOW_WEEKS);
	const recentWeeks = weeks.slice(WINDOW_WEEKS);

	// New-user guard: need a full prior window of history
	const priorWindowStart = toISODate(priorWeeks[0].weekStart);
	if (!firstWorkoutDate || toISODate(firstWorkoutDate) > priorWindowStart) {
		return null;
	}

	const priorMins = average(priorWeeks.map((week) => Number(week.totalMins)));
	const recentMins = average(recentWeeks.map((week) => Number(week.totalMins)));
	const priorWorkouts = average(
		priorWeeks.map((week) => Number(week.totalWorkouts)),
	);
	const recentWorkouts = average(
		recentWeeks.map((week) => Number(week.totalWorkouts)),
	);

	// Zero-baseline guard: percent change is undefined
	if (priorMins === 0 || priorWorkouts === 0) return null;

	const metrics: AINoticeMetrics = {
		avgWeeklyMins: buildMetric(recentMins, priorMins, {
			minDelta: MIN_DELTA_MINS,
			pctThreshold: PCT_THRESHOLD,
		}),
		avgWeeklyWorkouts: buildMetric(recentWorkouts, priorWorkouts, {
			minDelta: MIN_DELTA_WORKOUTS,
			pctThreshold: PCT_THRESHOLD,
		}),
	};

	const direction = getNoticeDirection(metrics);
	if (!direction) return null;
	if (isInCooldown(direction, lastWeekStart, priorNotices, WINDOW_WEEKS)) {
		return null;
	}

	return { direction, metrics };
};
