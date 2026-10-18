import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	formatPace,
	formatShortDate,
	getPctChange,
	getPriorPeriodLabel,
	hasFullPriorPeriod,
	perWeek,
	pickInsights,
	toTrendPeriod,
} from "../utils.js";
import { round } from "../../../utils/misc.js";
import type {
	InsightRule,
	RawCardioWalking,
	RawCardioWalkingWeek,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * WALKING: distance, steps & pace.
 * - Owns: miles, walks, steps & pace (min per mile; lower = faster)
 * - Reads the 'walking' half of 'get_trends_cardio_walking' (Cardio reads the other half)
 * - Steps are logged per walk (not a daily step count), so they're shown per week, never per day
 */

const WALKING_CONFIG = {
	MIN_PACE_CHANGE: 5, // % change in pace to mention it
};

interface WalkingContext {
	raw: RawCardioWalking;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	kpis: {
		milesPerWeek: TrendKpi;
		walksPerWeek: TrendKpi;
		avgPace: TrendKpi;
		stepsPerWeek: TrendKpi;
	};
}

// HELPERS

const getAvgMilesPerWeek = (weeks: RawCardioWalkingWeek[]) => {
	if (!weeks.length) return null;
	const total = weeks.reduce((sum, week) => sum + week.walkMiles, 0);
	return total / weeks.length;
};

// KPIS

const buildWalkingKpis = (
	raw: RawCardioWalking,
	hasPrior: boolean,
): WalkingContext["kpis"] => {
	const { current, prior } = raw.walking;
	const { weeks } = raw.period;

	return {
		milesPerWeek: buildKpi({
			key: "miles-per-week",
			label: "Miles / week",
			unit: "miles",
			value: perWeek(current.miles, weeks),
			prior: hasPrior ? perWeek(prior.miles, weeks) : null,
		}),
		walksPerWeek: buildKpi({
			key: "walks-per-week",
			label: "Walks / week",
			unit: "count",
			value: perWeek(current.walks, weeks),
			prior: hasPrior ? perWeek(prior.walks, weeks) : null,
		}),
		avgPace: buildKpi({
			key: "avg-pace",
			label: "Avg pace",
			unit: "pace",
			betterWhen: "lower", // fewer minutes per mile = faster
			value: current.pace,
			prior: hasPrior ? prior.pace : null,
		}),
		stepsPerWeek: buildKpi({
			key: "steps-per-week",
			label: "Steps / week",
			unit: "steps",
			value: perWeek(current.steps, weeks),
			prior: hasPrior ? perWeek(prior.steps, weeks) : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<WalkingContext>[] = [
	{
		// Always applies: miles per week, with its change when it's notable
		key: "miles-per-week",
		build: ({ kpis, periodKey }) => {
			const { value, change, tone } = kpis.milesPerWeek;
			const level = `You walked ${round(value, 1)} miles a week`;

			if (change === null || tone === "NEUTRAL") {
				return { key: "miles-per-week", tone: "NEUTRAL", text: `${level}.` };
			}
			const direction = change > 0 ? "up" : "down";
			const pct = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pct}% from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "miles-per-week", tone, text };
		},
	},
	{
		key: "pace",
		build: ({ raw, hasPrior }) => {
			const { current, prior } = raw.walking;
			if (!hasPrior || current.pace === null || prior.pace === null)
				return null;

			const change = getPctChange(current.pace, prior.pace);
			if (
				change === null ||
				Math.abs(change) < WALKING_CONFIG.MIN_PACE_CHANGE
			) {
				return null;
			}
			const pct = Math.abs(Math.round(change));
			const pace = `${formatPace(current.pace)} per mile`;
			return change < 0
				? {
						key: "pace",
						tone: "POSITIVE",
						text: `You're walking ${pct}% faster: ${pace}, down from ${formatPace(prior.pace)}.`,
					}
				: {
						key: "pace",
						tone: "NEGATIVE",
						text: `Your walks were ${pct}% slower: ${pace}, compared with ${formatPace(prior.pace)}.`,
					};
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgMilesPerWeek,
				changeType: "relative",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `You've been walking more lately: ${round(recent, 1)} miles a week over the last 4 weeks, up from ${round(earlier, 1)}.`
						: `You've walked a bit less lately: ${round(recent, 1)} miles a week over the last 4 weeks, compared with ${round(earlier, 1)} before.`,
			}),
	},
	{
		key: "longest-walk",
		build: ({ raw }) => {
			const longest = raw.walking.longestWalk;
			if (!longest) return null;
			return {
				key: "longest-walk",
				tone: "NEUTRAL",
				text: `Longest walk: ${round(longest.miles, 1)} miles on ${formatShortDate(longest.date)}.`,
			};
		},
	},
];

// BUILDER

const buildWalkingData = (
	raw: RawCardioWalking,
	periodKey: TrendPeriodKey,
): TrendCategoryData | null => {
	const { current, prior, byWorkout } = raw.walking;
	// No walks in either period: nothing to show (hidden on the hub)
	if (!current.walks && !prior.walks) return null;

	const hasPrior = hasFullPriorPeriod(raw.firstWalkDate, raw.priorPeriod);
	const kpis = buildWalkingKpis(raw, hasPrior);
	const context: WalkingContext = { raw, periodKey, hasPrior, kpis };

	return {
		category: "walking",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.milesPerWeek, // headline
			kpis.walksPerWeek,
			kpis.avgPace,
			kpis.stepsPerWeek,
		],
		series: [
			buildSeries("miles-by-week", "Miles per week", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.walkMiles,
			})),
			buildSeries("steps-by-week", "Steps per week", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.walkSteps,
			})),
		],
		breakdowns: [
			buildBreakdown(
				"miles-by-workout",
				"Miles by walk",
				byWorkout
					.filter((workout) => workout.currentWalks > 0)
					.map((workout) => ({
						key: `workout-${workout.workoutID}`,
						label: workout.workoutName ?? "Walk",
						value: workout.currentMiles,
						prior: hasPrior ? workout.priorMiles : null,
						unit: "miles",
					})),
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildWalkingData, WALKING_CONFIG };
