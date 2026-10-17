import { round } from "../../../utils/misc.js";
import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	getPriorPeriodLabel,
	hasEnoughHistory,
	hasFullPriorPeriod,
	perWeek,
	pickInsights,
	toPercent,
	toTrendPeriod,
} from "../utils.js";
import type {
	InsightRule,
	RawConsistency,
	RawConsistencyTotals,
	RawConsistencyWeek,
	RawWorkoutStreakStatus,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * CONSISTENCY: how often the user trains (frequency).
 * - Owns: active days, workouts/week, workouts per active day, streaks, when they train
 * - Time (minutes) belongs to Volume; the plan belongs to Adherence
 */

const CONSISTENCY_CONFIG = {
	HIGH_ACTIVE_DAYS_PCT: 90, // at/above this, talk about the level (a small drop isn't "negative")
	MIN_SESSIONS_CHANGE: 15, // % change in workouts per active day before it's worth mentioning
	MIN_TIME_OF_DAY_SHARE: 60, // % of workouts in one part of the day
	MIN_WEEKDAY_DIFF: 25, // % above/below the average weekday
	MIN_STREAK_DAYS: 7,
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_LONG = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

// 'toHour' is exclusive; hours are America/Phoenix (converted in SQL)
const TIME_OF_DAY_BUCKETS = [
	{ key: "morning", label: "Morning", fromHour: 0, toHour: 12 },
	{ key: "afternoon", label: "Afternoon", fromHour: 12, toHour: 17 },
	{ key: "evening", label: "Evening", fromHour: 17, toHour: 24 },
];

// The streak + today's date (both from the DB), from 'TrendsHubService.getWorkoutStreakStatus'
export type ConsistencyExtras = RawWorkoutStreakStatus;

interface ConsistencyContext {
	raw: RawConsistency;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	hasHistory: boolean;
	kpis: {
		activeDays: TrendKpi;
		workoutsPerWeek: TrendKpi;
		workoutsPerActiveDay: TrendKpi;
		streak: TrendKpi;
	};
	streak: { days: number; isCurrent: boolean; endDate: string | null };
}

// HELPERS

const getActiveDaysPct = (totals: RawConsistencyTotals) => {
	return toPercent(totals.activeDays, totals.totalDays);
};

const getWorkoutsPerActiveDay = (totals: RawConsistencyTotals) => {
	if (!totals.activeDays) return null;
	return round(totals.workouts / totals.activeDays, 1);
};

const getAvgActiveDaysPerWeek = (weeks: RawConsistencyWeek[]) => {
	if (!weeks.length) return null;
	const total = weeks.reduce((sum, week) => sum + week.activeDays, 0);
	return total / weeks.length;
};

// 'get_current_workout_streak' returns the latest streak even if it ended; it's only current
// if it ended today or yesterday (today's workout may not be logged yet)
const getStreakStatus = (extras: ConsistencyExtras) => {
	const { streak, today } = extras;
	if (!streak?.endDate || !streak.days) {
		return { days: 0, isCurrent: false, endDate: null };
	}

	const msPerDay = 24 * 60 * 60 * 1000;
	const daysSinceEnd =
		(Date.parse(today) - Date.parse(streak.endDate)) / msPerDay;
	const isCurrent = daysSinceEnd <= 1;
	return { days: streak.days, isCurrent, endDate: streak.endDate };
};

const getTimeOfDayTotals = (raw: RawConsistency) => {
	return TIME_OF_DAY_BUCKETS.map((bucket) => {
		const workouts = raw.byDayAndHour
			.filter(({ hour }) => hour >= bucket.fromHour && hour < bucket.toHour)
			.reduce((sum, entry) => sum + entry.workouts, 0);
		return { ...bucket, workouts };
	});
};

// KPIS

const buildConsistencyKpis = (
	raw: RawConsistency,
	hasPrior: boolean,
	streak: ConsistencyContext["streak"],
): ConsistencyContext["kpis"] => {
	const { current, prior, period } = raw;

	return {
		activeDays: buildKpi({
			key: "active-days",
			label: "Active days",
			unit: "pct",
			changeType: "points",
			neutralAbove: CONSISTENCY_CONFIG.HIGH_ACTIVE_DAYS_PCT,
			value: getActiveDaysPct(current),
			prior: hasPrior ? getActiveDaysPct(prior) : null,
		}),
		workoutsPerWeek: buildKpi({
			key: "workouts-per-week",
			label: "Workouts / week",
			unit: "count",
			value: perWeek(current.workouts, period.weeks),
			prior: hasPrior ? perWeek(prior.workouts, period.weeks) : null,
		}),
		workoutsPerActiveDay: buildKpi({
			key: "workouts-per-active-day",
			label: "Workouts / active day",
			unit: "count",
			betterWhen: "none", // more sessions per day isn't better or worse
			value: getWorkoutsPerActiveDay(current),
			prior: hasPrior ? getWorkoutsPerActiveDay(prior) : null,
		}),
		streak: buildKpi({
			key: "current-streak",
			label: "Current streak",
			unit: "days",
			value: streak.isCurrent ? streak.days : 0,
			prior: null, // a streak isn't compared between periods
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<ConsistencyContext>[] = [
	{
		// Always applies: the active-days level, or its change when the level isn't already high
		key: "active-days",
		build: ({ raw, kpis, periodKey }) => {
			const { activeDays, totalDays } = raw.current;
			const { value, change, tone } = kpis.activeDays;
			const level = `You were active ${activeDays} of ${totalDays} days (${Math.round(value)}%)`;

			if (value >= CONSISTENCY_CONFIG.HIGH_ACTIVE_DAYS_PCT) {
				return { key: "active-days", tone: "POSITIVE", text: `${level}.` };
			}
			if (change === null || tone === "NEUTRAL") {
				return { key: "active-days", tone: "NEUTRAL", text: `${level}.` };
			}

			const direction = change > 0 ? "up" : "down";
			const pts = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pts} pts from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "active-days", tone, text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgActiveDaysPerWeek,
				changeType: "relative",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `You've been more active lately: ${recent} days a week over the last 4 weeks, up from ${earlier}.`
						: `You've been a bit less active lately: ${recent} days a week over the last 4 weeks, compared with ${earlier} before.`,
			}),
	},
	{
		key: "workouts-per-active-day",
		build: ({ hasHistory, kpis }) => {
			const { value, prior, change } = kpis.workoutsPerActiveDay;
			if (!hasHistory || prior === null || change === null) return null;
			if (Math.abs(change) < CONSISTENCY_CONFIG.MIN_SESSIONS_CHANGE)
				return null;

			const direction = change > 0 ? "up" : "down";
			return {
				key: "workouts-per-active-day",
				tone: "NEUTRAL",
				text: `You're averaging ${value} workouts per active day, ${direction} from ${prior}.`,
			};
		},
	},
	{
		key: "time-of-day",
		build: ({ raw, hasHistory }) => {
			if (!hasHistory) return null;
			const buckets = getTimeOfDayTotals(raw);
			const total = buckets.reduce((sum, bucket) => sum + bucket.workouts, 0);
			const top = [...buckets].sort((a, b) => b.workouts - a.workouts)[0];
			const share = toPercent(top.workouts, total);
			if (share === null || share < CONSISTENCY_CONFIG.MIN_TIME_OF_DAY_SHARE) {
				return null;
			}

			return {
				key: "time-of-day",
				tone: "NEUTRAL",
				text: `${Math.round(share)}% of your workouts are in the ${top.key}.`,
			};
		},
	},
	{
		// Prefers the strongest day (positive framing); falls back to the lightest
		key: "weekday",
		build: ({ raw, hasHistory }) => {
			if (!hasHistory) return null;
			const days = raw.byDayOfWeek;
			const total = days.reduce((sum, day) => sum + day.workouts, 0);
			if (!total) return null;

			const average = total / days.length;
			const sorted = [...days].sort((a, b) => b.workouts - a.workouts);
			const strongest = sorted[0];
			const lightest = sorted[sorted.length - 1];
			const strongestDiff = ((strongest.workouts - average) / average) * 100;
			const lightestDiff = ((average - lightest.workouts) / average) * 100;
			const { MIN_WEEKDAY_DIFF } = CONSISTENCY_CONFIG;

			if (strongestDiff >= MIN_WEEKDAY_DIFF) {
				const day = DAY_NAMES_LONG[strongest.dayOfWeek];
				return {
					key: "weekday",
					tone: "NEUTRAL",
					text: `${day}s are your strongest day, ${Math.round(strongestDiff)}% above your average day.`,
				};
			}
			if (lightestDiff >= MIN_WEEKDAY_DIFF) {
				const day = DAY_NAMES_LONG[lightest.dayOfWeek];
				return {
					key: "weekday",
					tone: "NEUTRAL",
					text: `${day}s are your lightest day, ${Math.round(lightestDiff)}% below your average day.`,
				};
			}
			return null;
		},
	},
	{
		// A current streak, or a recent one (ended within this period) said kindly
		key: "streak",
		build: ({ raw, streak }) => {
			const { days, isCurrent, endDate } = streak;
			if (days < CONSISTENCY_CONFIG.MIN_STREAK_DAYS) return null;

			if (isCurrent) {
				return {
					key: "streak",
					tone: "POSITIVE",
					text: `${days}-day streak and counting.`,
				};
			}
			if (endDate && endDate >= raw.period.startDate) {
				return {
					key: "streak",
					tone: "NEUTRAL",
					text: `Your last streak ran ${days} days.`,
				};
			}
			return null;
		},
	},
];

// BUILDER

const buildConsistencyData = (
	raw: RawConsistency,
	periodKey: TrendPeriodKey,
	extras: ConsistencyExtras,
): TrendCategoryData => {
	const hasPrior = hasFullPriorPeriod(raw.firstWorkoutDate, raw.priorPeriod);
	const hasHistory = hasEnoughHistory(raw.firstWorkoutDate, raw.period);
	const streak = getStreakStatus(extras);
	const kpis = buildConsistencyKpis(raw, hasPrior, streak);
	const context: ConsistencyContext = {
		raw,
		periodKey,
		hasPrior,
		hasHistory,
		kpis,
		streak,
	};

	return {
		category: "consistency",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.activeDays, // headline
			kpis.workoutsPerWeek,
			kpis.workoutsPerActiveDay,
			kpis.streak,
		],
		series: [
			buildSeries(
				"active-days-by-week",
				"Active days per week",
				raw.weeks,
				(week) => ({
					x: week.weekStart,
					y: week.activeDays,
				}),
			),
			buildSeries(
				"workouts-by-weekday",
				"Workouts by weekday",
				raw.byDayOfWeek,
				(day) => ({
					x: DAY_NAMES[day.dayOfWeek],
					y: day.workouts,
				}),
			),
			// Sparse heat map; x = "dayOfWeek:hour" (eg. "1:7" = Monday 7am)
			buildSeries(
				"workouts-by-day-hour",
				"When you work out",
				raw.byDayAndHour,
				(entry) => ({
					x: `${entry.dayOfWeek}:${entry.hour}`,
					y: entry.workouts,
				}),
			),
		],
		breakdowns: [
			buildBreakdown(
				"time-of-day",
				"Time of day",
				getTimeOfDayTotals(raw).map((bucket) => ({
					key: bucket.key,
					label: bucket.label,
					value: bucket.workouts,
					prior: null,
					unit: "count",
				})),
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildConsistencyData, CONSISTENCY_CONFIG };
