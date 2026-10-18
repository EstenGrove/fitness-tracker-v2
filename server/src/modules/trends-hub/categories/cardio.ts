import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	formatCount,
	formatShortDate,
	getPriorPeriodLabel,
	hasFullPriorPeriod,
	perWeek,
	pickInsights,
	toTrendPeriod,
} from "../utils.js";
import { round } from "../../../utils/misc.js";
import type {
	InsightRule,
	RawCardioTotals,
	RawCardioWalking,
	RawCardioWalkingWeek,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * CARDIO: bodyweight cardio (reps), eg. pushups.
 * - Owns: cardio reps, cardio sessions, reps per session, best session
 * - Reads the 'cardio' half of 'get_trends_cardio_walking' (Walking reads the other half)
 */

const CARDIO_CONFIG = {
	MIN_REPS_PER_SESSION_CHANGE: 10, // % change in avg reps per session to mention it
};

interface CardioContext {
	raw: RawCardioWalking;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	kpis: {
		repsPerWeek: TrendKpi;
		sessionsPerWeek: TrendKpi;
		avgRepsPerSession: TrendKpi;
		bestSession: TrendKpi;
	};
}

// HELPERS

const getAvgRepsPerSession = (totals: RawCardioTotals) => {
	return totals.sessions ? round(totals.reps / totals.sessions, 1) : null;
};

const getAvgRepsPerWeek = (weeks: RawCardioWalkingWeek[]) => {
	if (!weeks.length) return null;
	const total = weeks.reduce((sum, week) => sum + week.cardioReps, 0);
	return total / weeks.length;
};

// KPIS

const buildCardioKpis = (
	raw: RawCardioWalking,
	hasPrior: boolean,
): CardioContext["kpis"] => {
	const { current, prior } = raw.cardio;
	const { weeks } = raw.period;

	return {
		repsPerWeek: buildKpi({
			key: "reps-per-week",
			label: "Reps / week",
			unit: "reps",
			value: perWeek(current.reps, weeks),
			prior: hasPrior ? perWeek(prior.reps, weeks) : null,
		}),
		sessionsPerWeek: buildKpi({
			key: "sessions-per-week",
			label: "Sessions / week",
			unit: "count",
			value: perWeek(current.sessions, weeks),
			prior: hasPrior ? perWeek(prior.sessions, weeks) : null,
		}),
		avgRepsPerSession: buildKpi({
			key: "avg-reps-per-session",
			label: "Avg reps / session",
			unit: "reps",
			value: getAvgRepsPerSession(current),
			prior: hasPrior ? getAvgRepsPerSession(prior) : null,
		}),
		bestSession: buildKpi({
			key: "best-session",
			label: "Best session",
			unit: "reps",
			value: current.bestSessionReps,
			prior: hasPrior ? prior.bestSessionReps : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<CardioContext>[] = [
	{
		// Always applies: reps per week, with its change when it's notable
		key: "reps-per-week",
		build: ({ kpis, periodKey }) => {
			const { value, change, tone } = kpis.repsPerWeek;
			const level = `You averaged ${formatCount(value)} cardio reps a week`;

			if (change === null || tone === "NEUTRAL") {
				return { key: "reps-per-week", tone: "NEUTRAL", text: `${level}.` };
			}
			const direction = change > 0 ? "up" : "down";
			const pct = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pct}% from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "reps-per-week", tone, text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgRepsPerWeek,
				changeType: "relative",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `You've picked up the pace lately: ${formatCount(recent)} reps a week over the last 4 weeks, up from ${formatCount(earlier)}.`
						: `You've eased off a bit lately: ${formatCount(recent)} reps a week over the last 4 weeks, compared with ${formatCount(earlier)} before.`,
			}),
	},
	{
		key: "reps-per-session",
		build: ({ kpis }) => {
			const { value, prior, change, tone } = kpis.avgRepsPerSession;
			if (prior === null || change === null) return null;
			if (Math.abs(change) < CARDIO_CONFIG.MIN_REPS_PER_SESSION_CHANGE)
				return null;

			const direction = change > 0 ? "up" : "down";
			return {
				key: "reps-per-session",
				tone,
				text: `Your sessions averaged ${formatCount(value)} reps, ${direction} from ${formatCount(prior)}.`,
			};
		},
	},
	{
		key: "best-session",
		build: ({ raw }) => {
			const best = raw.cardio.bestSession;
			if (!best) return null;
			const workout = best.workoutName ? ` of ${best.workoutName}` : "";
			return {
				key: "best-session",
				tone: "POSITIVE",
				text: `Best session: ${formatCount(best.reps)} reps${workout} on ${formatShortDate(best.date)}.`,
			};
		},
	},
];

// BUILDER

const buildCardioData = (
	raw: RawCardioWalking,
	periodKey: TrendPeriodKey,
): TrendCategoryData | null => {
	const { current, prior, byWorkout } = raw.cardio;
	// No cardio sessions in either period: nothing to show (hidden on the hub)
	if (!current.sessions && !prior.sessions) return null;

	const hasPrior = hasFullPriorPeriod(raw.firstCardioDate, raw.priorPeriod);
	const kpis = buildCardioKpis(raw, hasPrior);
	const context: CardioContext = { raw, periodKey, hasPrior, kpis };

	return {
		category: "cardio",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.repsPerWeek, // headline
			kpis.sessionsPerWeek,
			kpis.avgRepsPerSession,
			kpis.bestSession,
		],
		series: [
			buildSeries("reps-by-week", "Reps per week", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.cardioReps,
			})),
		],
		breakdowns: [
			buildBreakdown(
				"reps-by-workout",
				"Reps by workout",
				byWorkout
					.filter((workout) => workout.currentSessions > 0)
					.map((workout) => ({
						key: `workout-${workout.workoutID}`,
						label: workout.workoutName ?? "Cardio workout",
						value: workout.currentReps,
						prior: hasPrior ? workout.priorReps : null,
						unit: "reps",
					})),
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildCardioData, CARDIO_CONFIG };
