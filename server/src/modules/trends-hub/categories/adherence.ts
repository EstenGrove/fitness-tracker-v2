import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	getPctChange,
	getPriorPeriodLabel,
	hasEnoughHistory,
	hasFullPriorPeriod,
	pickInsights,
	toPercent,
	toTrendPeriod,
} from "../utils.js";
import type {
	InsightRule,
	RawAdherence,
	RawAdherenceTotals,
	RawAdherenceWorkout,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * ADHERENCE: how well the user sticks to their plan (scheduled workouts).
 * - Owns: completion rate, completed/skipped/missed, perfect weeks, the most-missed workout
 * - Only scheduled workouts count here; unscheduled sessions belong to Consistency & Volume
 * - Tone is honest (a drop is NEGATIVE); the client shows NEGATIVE in amber, never red
 */

const ADHERENCE_CONFIG = {
	HIGH_COMPLETION_PCT: 90, // at/above this, talk about the level (a small drop isn't "negative")
	MIN_NOT_DONE: 3, // skipped + missed before a workout is called out...
	MIN_NOT_DONE_SHARE: 25, // ...and at least this % of its scheduled dates
	MIN_PERFECT_WEEKS: 2,
	MIN_PLAN_CHANGE: 20, // % change in scheduled workouts to mention a plan change
};

interface AdherenceContext {
	raw: RawAdherence;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	hasHistory: boolean;
	kpis: {
		completionRate: TrendKpi;
		completed: TrendKpi;
		skipped: TrendKpi;
		missed: TrendKpi;
	};
}

// HELPERS

const getCompletionRate = (totals: RawAdherenceTotals) => {
	return toPercent(totals.completed, totals.scheduled);
};

// Completion rate across several weeks (summed first, so busy weeks weigh more)
const getCompletionRateForWeeks = (weeks: RawAdherenceTotals[]) => {
	const completed = weeks.reduce((sum, week) => sum + week.completed, 0);
	const scheduled = weeks.reduce((sum, week) => sum + week.scheduled, 0);
	return toPercent(completed, scheduled);
};

const getNotDone = (workout: RawAdherenceTotals) => {
	return workout.skipped + workout.missed;
};

const getWorkoutLabel = (workout: RawAdherenceWorkout) => {
	return workout.workoutName ?? `${workout.activityType} workout`;
};

// The workout that's most often not done, if it's frequent enough to mention
const getMostMissedWorkout = (raw: RawAdherence) => {
	const { MIN_NOT_DONE, MIN_NOT_DONE_SHARE } = ADHERENCE_CONFIG;

	return (
		raw.byWorkout.find((workout) => {
			const notDone = getNotDone(workout);
			const share = toPercent(notDone, workout.scheduled) ?? 0;
			return notDone >= MIN_NOT_DONE && share >= MIN_NOT_DONE_SHARE;
		}) ?? null
	);
};

// Weeks where every scheduled workout was completed
const getPerfectWeeks = (raw: RawAdherence) => {
	return raw.weeks.filter(
		(week) => week.scheduled > 0 && week.completed === week.scheduled,
	).length;
};

// KPIS

const buildAdherenceKpis = (
	raw: RawAdherence,
	hasPrior: boolean,
): AdherenceContext["kpis"] => {
	const { current, prior } = raw;

	return {
		completionRate: buildKpi({
			key: "completion-rate",
			label: "Completion rate",
			unit: "pct",
			changeType: "points",
			neutralAbove: ADHERENCE_CONFIG.HIGH_COMPLETION_PCT,
			value: getCompletionRate(current),
			prior: hasPrior ? getCompletionRate(prior) : null,
		}),
		completed: buildKpi({
			key: "completed",
			label: "Completed",
			unit: "count",
			betterWhen: "none", // depends on how much was planned; the completion rate carries the judgment
			value: current.completed,
			prior: hasPrior ? prior.completed : null,
		}),
		// Small counts: show the plain difference (eg. "+3"), since % changes on them jump around
		skipped: buildKpi({
			key: "skipped",
			label: "Skipped",
			unit: "count",
			changeType: "points",
			betterWhen: "lower",
			value: current.skipped,
			prior: hasPrior ? prior.skipped : null,
		}),
		missed: buildKpi({
			key: "missed",
			label: "Missed",
			unit: "count",
			changeType: "points",
			betterWhen: "lower",
			value: current.missed,
			prior: hasPrior ? prior.missed : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<AdherenceContext>[] = [
	{
		// Always applies: the completion level, or its change when the level isn't already high
		key: "completion-rate",
		build: ({ raw, kpis, periodKey }) => {
			const { completed, scheduled } = raw.current;
			if (!scheduled) {
				return {
					key: "completion-rate",
					tone: "NEUTRAL",
					text: "You didn't have any workouts scheduled in this period.",
				};
			}

			const { value, change, tone } = kpis.completionRate;
			const level = `You completed ${completed} of ${scheduled} scheduled workouts (${Math.round(value)}%)`;

			if (value >= ADHERENCE_CONFIG.HIGH_COMPLETION_PCT) {
				return { key: "completion-rate", tone: "POSITIVE", text: `${level}.` };
			}
			if (change === null || tone === "NEUTRAL") {
				return { key: "completion-rate", tone: "NEUTRAL", text: `${level}.` };
			}

			const direction = change > 0 ? "up" : "down";
			const pts = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pts} pts from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "completion-rate", tone, text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getCompletionRateForWeeks,
				changeType: "points",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) => {
					const values = `${Math.round(recent)}% completed over the last 4 weeks`;
					if (change < 0) {
						return `The last 4 weeks were a little harder: ${values}, compared with ${Math.round(earlier)}% before.`;
					}
					// "Back on track" only fits if the earlier weeks were below the high level
					const opener =
						earlier < ADHERENCE_CONFIG.HIGH_COMPLETION_PCT
							? "Back on track"
							: "Stronger lately";
					return `${opener}: ${values}, up from ${Math.round(earlier)}%.`;
				},
			}),
	},
	{
		// Said gently: what got done, not what didn't
		key: "most-missed",
		build: ({ raw }) => {
			const workout = getMostMissedWorkout(raw);
			if (!workout) return null;

			return {
				key: "most-missed",
				tone: "NEUTRAL",
				text: `${getWorkoutLabel(workout)} was done ${workout.completed} of ${workout.scheduled} times.`,
			};
		},
	},
	{
		key: "perfect-weeks",
		build: ({ raw }) => {
			const perfectWeeks = getPerfectWeeks(raw);
			if (perfectWeeks < ADHERENCE_CONFIG.MIN_PERFECT_WEEKS) return null;

			return {
				key: "perfect-weeks",
				tone: "POSITIVE",
				text: `${perfectWeeks} weeks where you completed everything you planned.`,
			};
		},
	},
	{
		key: "plan-change",
		build: ({ raw, hasPrior }) => {
			if (!hasPrior) return null;
			const { scheduled } = raw.current;
			const priorScheduled = raw.prior.scheduled;
			const change = getPctChange(scheduled, priorScheduled);
			if (
				change === null ||
				Math.abs(change) < ADHERENCE_CONFIG.MIN_PLAN_CHANGE
			) {
				return null;
			}

			const direction = change > 0 ? "more" : "fewer";
			return {
				key: "plan-change",
				tone: "NEUTRAL",
				text: `You scheduled ${direction} workouts this period (${scheduled} vs ${priorScheduled}).`,
			};
		},
	},
];

// BUILDER

const buildAdherenceData = (
	raw: RawAdherence,
	periodKey: TrendPeriodKey,
): TrendCategoryData | null => {
	// No workouts scheduled in either period: nothing to show (hidden on the hub)
	if (!raw.current.scheduled && !raw.prior.scheduled) return null;

	// History is based on the first *scheduled* date: the plan didn't exist before then
	const hasPrior =
		hasFullPriorPeriod(raw.firstScheduledDate, raw.priorPeriod) &&
		raw.prior.scheduled > 0;
	const hasHistory = hasEnoughHistory(raw.firstScheduledDate, raw.period);
	const kpis = buildAdherenceKpis(raw, hasPrior);
	const context: AdherenceContext = {
		raw,
		periodKey,
		hasPrior,
		hasHistory,
		kpis,
	};

	return {
		category: "adherence",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.completionRate, // headline
			kpis.completed,
			kpis.skipped,
			kpis.missed,
		],
		series: [
			buildSeries("completed-by-week", "Completed", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.completed,
			})),
			buildSeries("scheduled-by-week", "Scheduled", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.scheduled,
			})),
		],
		breakdowns: [
			buildBreakdown(
				"completion-by-workout",
				"Completion by workout",
				raw.byWorkout.map((workout) => ({
					key: `${workout.activityType.toLowerCase()}-${workout.workoutID}`,
					label: getWorkoutLabel(workout),
					value: getCompletionRate(workout) ?? 0,
					prior: null,
					unit: "pct",
				})),
				false, // completion rates aren't parts of a whole
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildAdherenceData, ADHERENCE_CONFIG };
