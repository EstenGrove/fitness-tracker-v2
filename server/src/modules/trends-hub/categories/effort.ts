import type { Activity } from "../../types.js";
import { round } from "../../../utils/misc.js";
import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	getPctChange,
	hasEnoughHistory,
	hasFullPriorPeriod,
	perWeek,
	pickInsights,
	toPercent,
	toTrendPeriod,
} from "../utils.js";
import type {
	InsightRule,
	RawEffort,
	RawEffortTotals,
	RawEffortWeek,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * EFFORT: how hard the user trains (intensity).
 * - Owns: effort mix, average effort (1 Easy - 5 All Out), hard days, estimated calories
 * - More intensity isn't automatically better, so most KPIs here are 'betterWhen: none'
 * - Sessions with effort 'None' are "unrated" & left out of effort averages & shares
 */

const EFFORT_CONFIG = {
	MOSTLY_SHARE: 60, // % of rated sessions at one level to call it "mostly <level>"
	MIN_HARD_SHARE_CHANGE: 10, // pts change in the hard+ share to mention an intensity shift
	MIN_BACK_TO_BACK: 2, // back-to-back hard days...
	MIN_BACK_TO_BACK_SHARE: 30, // ...that are at least this % of all hard days, before suggesting recovery
	FITTER_MIN_SCORE_DROP: 10, // % drop in avg effort...
	FITTER_MAX_MINS_DROP: 5, // ...while minutes/week dropped no more than this % (or grew)
	MIN_UNRATED_SHARE: 20, // % of sessions without effort before warning the numbers may be off
};

// Weekly mix series, lightest -> hardest (the client colors them as shades of the trends accent)
const EFFORT_LEVELS: { key: keyof RawEffortWeek; label: string }[] = [
	{ key: "easy", label: "Easy" },
	{ key: "moderate", label: "Moderate" },
	{ key: "hard", label: "Hard" },
	{ key: "strenuous", label: "Strenuous" },
	{ key: "allOut", label: "All Out" },
];

interface EffortContext {
	raw: RawEffort;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	hasHistory: boolean;
	kpis: {
		hardShare: TrendKpi;
		avgEffort: TrendKpi;
		hardDaysPerWeek: TrendKpi;
		caloriesPerWeek: TrendKpi;
	};
}

// HELPERS

const getHardShare = (totals: RawEffortTotals) => {
	return toPercent(totals.hardSessions, totals.ratedSessions);
};

// Avg effort score across several weeks (weighted by sessions)
const getAvgScoreForWeeks = (weeks: RawEffortWeek[]) => {
	let sessions = 0;
	let points = 0;
	weeks.forEach((week) => {
		EFFORT_LEVELS.forEach((level, idx) => {
			const count = week[level.key] as number;
			sessions += count;
			points += count * (idx + 1);
		});
	});
	return sessions ? points / sessions : null;
};

// The most common effort level this period, eg. { label: "Easy", share: 76 }
const getTopLevel = (raw: RawEffort) => {
	const totals = EFFORT_LEVELS.map((level) => ({
		label: level.label,
		count: raw.weeks.reduce(
			(sum, week) => sum + (week[level.key] as number),
			0,
		),
	}));
	const rated = totals.reduce((sum, level) => sum + level.count, 0);
	const top = [...totals].sort((a, b) => b.count - a.count)[0];
	return { label: top.label, share: toPercent(top.count, rated) ?? 0 };
};

// KPIS

const buildEffortKpis = (
	raw: RawEffort,
	hasPrior: boolean,
): EffortContext["kpis"] => {
	const { current, prior, period } = raw;

	return {
		hardShare: buildKpi({
			key: "hard-share",
			label: "Hard or harder",
			unit: "pct",
			changeType: "points",
			betterWhen: "none",
			value: getHardShare(current),
			prior: hasPrior ? getHardShare(prior) : null,
		}),
		avgEffort: buildKpi({
			key: "avg-effort",
			label: "Avg effort",
			unit: "score",
			betterWhen: "none",
			value: current.avgScore,
			prior: hasPrior ? prior.avgScore : null,
		}),
		hardDaysPerWeek: buildKpi({
			key: "hard-days-per-week",
			label: "Hard days / week",
			unit: "count",
			betterWhen: "none",
			value: perWeek(current.hardDays, period.weeks),
			prior: hasPrior ? perWeek(prior.hardDays, period.weeks) : null,
		}),
		caloriesPerWeek: buildKpi({
			key: "calories-per-week",
			label: "Est. calories / week",
			unit: "kcal",
			value: perWeek(current.calories, period.weeks),
			prior: hasPrior ? perWeek(prior.calories, period.weeks) : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<EffortContext>[] = [
	{
		// Always applies: the overall balance of the user's effort
		key: "balance",
		build: ({ raw, kpis }) => {
			if (!raw.current.ratedSessions) {
				return {
					key: "balance",
					tone: "NEUTRAL",
					text: "No effort was logged this period.",
				};
			}

			const top = getTopLevel(raw);
			if (top.share >= EFFORT_CONFIG.MOSTLY_SHARE) {
				return {
					key: "balance",
					tone: "NEUTRAL",
					text: `Mostly ${top.label.toLowerCase()}: ${Math.round(top.share)}% of your sessions.`,
				};
			}
			return {
				key: "balance",
				tone: "NEUTRAL",
				text: `A mix of efforts: ${Math.round(kpis.hardShare.value)}% of your sessions were hard or harder.`,
			};
		},
	},
	{
		// Effort down while time held steady (or grew): the same work feels easier
		key: "getting-fitter",
		build: ({ raw, hasPrior }) => {
			if (!hasPrior) return null;
			const { current, prior } = raw;
			if (current.avgScore === null || prior.avgScore === null) return null;

			const scoreChange = getPctChange(current.avgScore, prior.avgScore);
			const minsChange = getPctChange(current.totalMins, prior.totalMins);
			if (scoreChange === null || minsChange === null) return null;

			const { FITTER_MIN_SCORE_DROP, FITTER_MAX_MINS_DROP } = EFFORT_CONFIG;
			if (
				scoreChange > -FITTER_MIN_SCORE_DROP ||
				minsChange < -FITTER_MAX_MINS_DROP
			) {
				return null;
			}
			return {
				key: "getting-fitter",
				tone: "POSITIVE",
				text: "Your workouts feel easier while you're putting in as much time, a sign you're getting fitter.",
			};
		},
	},
	{
		key: "intensity-shift",
		build: ({ kpis }) => {
			const { value, prior, change } = kpis.hardShare;
			if (prior === null || change === null) return null;
			if (Math.abs(change) < EFFORT_CONFIG.MIN_HARD_SHARE_CHANGE) return null;

			const text =
				change > 0
					? `Your sessions got harder: ${Math.round(value)}% were hard or harder, up from ${Math.round(prior)}%.`
					: `Your sessions got lighter: ${Math.round(value)}% were hard or harder, down from ${Math.round(prior)}%.`;
			return { key: "intensity-shift", tone: "NEUTRAL", text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgScoreForWeeks,
				changeType: "relative",
				betterWhen: "none",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `Your workouts have felt harder lately: avg effort ${round(recent, 1)} over the last 4 weeks, up from ${round(earlier, 1)}.`
						: `Your workouts have felt lighter lately: avg effort ${round(recent, 1)} over the last 4 weeks, down from ${round(earlier, 1)}.`,
			}),
	},
	{
		// A gentle recovery nudge, never a warning. A share (not a count), so it reads the same for any period.
		key: "back-to-back",
		build: ({ raw }) => {
			const { backToBackHardDays, hardDays } = raw.current;
			const { MIN_BACK_TO_BACK, MIN_BACK_TO_BACK_SHARE } = EFFORT_CONFIG;
			const share = toPercent(backToBackHardDays, hardDays);
			if (backToBackHardDays < MIN_BACK_TO_BACK || share === null) return null;
			if (share < MIN_BACK_TO_BACK_SHARE) return null;

			return {
				key: "back-to-back",
				tone: "NEUTRAL",
				text: `${Math.round(share)}% of your hard days came right after another hard day. A lighter day in between helps you recover.`,
			};
		},
	},
	{
		key: "unrated",
		build: ({ raw }) => {
			const { sessions, ratedSessions } = raw.current;
			const unratedShare = toPercent(sessions - ratedSessions, sessions);
			if (
				unratedShare === null ||
				unratedShare < EFFORT_CONFIG.MIN_UNRATED_SHARE
			) {
				return null;
			}
			return {
				key: "unrated",
				tone: "NEUTRAL",
				text: `${Math.round(unratedShare)}% of your sessions have no effort logged, so these numbers may be off.`,
			};
		},
	},
];

// BUILDER

const buildEffortData = (
	raw: RawEffort,
	periodKey: TrendPeriodKey,
): TrendCategoryData | null => {
	// No sessions in either period: nothing to show (hidden on the hub)
	if (!raw.current.sessions && !raw.prior.sessions) return null;

	const hasPrior = hasFullPriorPeriod(raw.firstWorkoutDate, raw.priorPeriod);
	const hasHistory = hasEnoughHistory(raw.firstWorkoutDate, raw.period);
	const kpis = buildEffortKpis(raw, hasPrior);
	const context: EffortContext = { raw, periodKey, hasPrior, hasHistory, kpis };

	return {
		category: "effort",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.hardShare, // headline
			kpis.avgEffort,
			kpis.hardDaysPerWeek,
			kpis.caloriesPerWeek,
		],
		series: [
			// One zero-filled weekly series per level, for the stacked mix chart
			...EFFORT_LEVELS.map((level) =>
				buildSeries(`effort-${level.key}`, level.label, raw.weeks, (week) => ({
					x: week.weekStart,
					y: week[level.key] as number,
				})),
			),
			buildSeries("calories-by-week", "Est. calories", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.calories,
			})),
		],
		breakdowns: [
			buildBreakdown(
				"effort-by-activity",
				"Avg effort by activity",
				raw.byActivity
					.filter((activity) => activity.currentSessions > 0)
					.map((activity) => ({
						key: (activity.activityType as Activity).toLowerCase(),
						label: activity.activityType,
						value: activity.currentAvgScore ?? 0,
						prior: hasPrior ? activity.priorAvgScore : null,
						unit: "score",
					})),
				false, // averages aren't parts of a whole
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildEffortData, EFFORT_CONFIG };
