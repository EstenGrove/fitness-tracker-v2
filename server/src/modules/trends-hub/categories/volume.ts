import type { Activity } from "../../types.js";
import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	getPctChange,
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
	RawVolume,
	RawVolumeActivity,
	RawVolumeTotals,
	RawVolumeWeek,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
	TrendSeries,
} from "../types.js";

/**
 * VOLUME: how much the user trains (time).
 * - Owns: minutes/week, session length, time vs target, the activity mix
 * - Frequency (workouts/week) belongs to Consistency; the plan belongs to Adherence
 */

const VOLUME_CONFIG = {
	MIN_SHARE_CHANGE: 10, // pts an activity's share of minutes must move to count as a mix shift
	MIN_MOVER_CHANGE: 25, // % change in an activity's minutes to call it the "biggest mover"
	MIN_MOVER_MINS_PER_WEEK: 10, // ...and it must move at least this many mins/week (ignores tiny activities)
	TARGET_OVER_PCT: 115, // at/above: sessions run longer than planned
	TARGET_UNDER_PCT: 85, // at/below: sessions run shorter than planned
	MIN_TARGETED_WORKOUTS: 5, // sessions with a target needed before talking about targets
};

// Used in insight text, eg. "Walking grew to 18% of your minutes"
const ACTIVITY_LABELS: Record<Activity, string> = {
	Strength: "Strength",
	Stretch: "Stretching",
	Cardio: "Cardio",
	Walk: "Walking",
	Timed: "Timed",
	Other: "Other",
};

interface ActivityShare {
	activityType: Activity;
	label: string;
	share: number; // current share of minutes (%)
	priorShare: number; // prior share of minutes (%)
}

interface VolumeContext {
	raw: RawVolume;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	hasHistory: boolean;
	kpis: {
		minsPerWeek: TrendKpi;
		avgSession: TrendKpi;
		timeVsTarget: TrendKpi;
	};
	shares: ActivityShare[];
}

// HELPERS

const getTimeVsTargetPct = (totals: RawVolumeTotals) => {
	return toPercent(totals.targetedMins, totals.targetMins);
};

const getAvgMinsPerWeek = (weeks: RawVolumeWeek[]) => {
	if (!weeks.length) return null;
	const total = weeks.reduce((sum, week) => sum + week.totalMins, 0);
	return total / weeks.length;
};

// Each activity's share of minutes in the current & prior periods
const getActivityShares = (raw: RawVolume): ActivityShare[] => {
	const { current, prior, byActivity } = raw;

	return byActivity.map((activity) => ({
		activityType: activity.activityType,
		label: ACTIVITY_LABELS[activity.activityType],
		share: toPercent(activity.currentMins, current.totalMins) ?? 0,
		priorShare: toPercent(activity.priorMins, prior.totalMins) ?? 0,
	}));
};

// The activity whose share of minutes moved the most, if it moved enough to be a "mix shift"
const getMixShift = (shares: ActivityShare[]): ActivityShare | null => {
	const getShift = (share: ActivityShare) =>
		Math.abs(share.share - share.priorShare);
	const biggest = [...shares].sort((a, b) => getShift(b) - getShift(a))[0];
	if (!biggest || getShift(biggest) < VOLUME_CONFIG.MIN_SHARE_CHANGE)
		return null;
	return biggest;
};

// Activities whose minutes changed enough to mention, biggest change first
const getActivityMovers = (raw: RawVolume) => {
	const { MIN_MOVER_CHANGE, MIN_MOVER_MINS_PER_WEEK } = VOLUME_CONFIG;
	const weeks = raw.period.weeks;

	return raw.byActivity
		.map((activity: RawVolumeActivity) => ({
			...activity,
			change: getPctChange(activity.currentMins, activity.priorMins),
			minsPerWeekDiff:
				Math.abs(activity.currentMins - activity.priorMins) / weeks,
		}))
		.filter(
			({ change, minsPerWeekDiff }) =>
				change !== null &&
				Math.abs(change) >= MIN_MOVER_CHANGE &&
				minsPerWeekDiff >= MIN_MOVER_MINS_PER_WEEK,
		)
		.sort((a, b) => b.minsPerWeekDiff - a.minsPerWeekDiff);
};

// One zero-filled weekly series per activity (for the stacked chart)
const buildActivitySeries = (raw: RawVolume): TrendSeries[] => {
	return raw.byActivity.map(({ activityType }) => {
		const minsByWeek = new Map(
			raw.weeksByActivity
				.filter((entry) => entry.activityType === activityType)
				.map((entry) => [entry.weekStart, entry.totalMins]),
		);

		return buildSeries(
			`mins-by-week-${activityType.toLowerCase()}`,
			ACTIVITY_LABELS[activityType],
			raw.weeks,
			(week) => ({ x: week.weekStart, y: minsByWeek.get(week.weekStart) ?? 0 }),
		);
	});
};

// KPIS

const buildVolumeKpis = (
	raw: RawVolume,
	hasPrior: boolean,
): VolumeContext["kpis"] => {
	const { current, prior, period } = raw;

	return {
		minsPerWeek: buildKpi({
			key: "mins-per-week",
			label: "Minutes / week",
			unit: "mins",
			value: perWeek(current.totalMins, period.weeks),
			prior: hasPrior ? perWeek(prior.totalMins, period.weeks) : null,
		}),
		avgSession: buildKpi({
			key: "avg-session",
			label: "Avg session",
			unit: "mins",
			value: current.avgSessionMins,
			prior: hasPrior ? prior.avgSessionMins : null,
		}),
		timeVsTarget: buildKpi({
			key: "time-vs-target",
			label: "Time vs target",
			unit: "pct",
			changeType: "points",
			betterWhen: "none", // going over/under target isn't good or bad
			value: getTimeVsTargetPct(current),
			prior: hasPrior ? getTimeVsTargetPct(prior) : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<VolumeContext>[] = [
	{
		// Always applies: minutes per week, with its change when it's notable
		key: "mins-per-week",
		build: ({ kpis, periodKey }) => {
			const { value, change, tone } = kpis.minsPerWeek;
			const level = `You averaged ${Math.round(value)} minutes a week`;

			if (change === null || tone === "NEUTRAL") {
				return { key: "mins-per-week", tone: "NEUTRAL", text: `${level}.` };
			}

			const direction = change > 0 ? "up" : "down";
			const pct = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pct}% from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "mins-per-week", tone, text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgMinsPerWeek,
				changeType: "relative",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `You've been putting in more time lately: ${Math.round(recent)} minutes a week over the last 4 weeks, up from ${Math.round(earlier)}.`
						: `You've eased off a bit lately: ${Math.round(recent)} minutes a week over the last 4 weeks, compared with ${Math.round(earlier)} before.`,
			}),
	},
	{
		// The activity whose share of minutes moved the most
		key: "mix-shift",
		build: ({ hasPrior, hasHistory, shares }) => {
			if (!hasPrior || !hasHistory) return null;
			const biggest = getMixShift(shares);
			if (!biggest) return null;

			const diff = biggest.share - biggest.priorShare;
			const share = Math.round(biggest.share);
			const priorShare = Math.round(biggest.priorShare);
			const text =
				diff > 0
					? `${biggest.label} grew to ${share}% of your minutes, up from ${priorShare}%.`
					: `${biggest.label} made up ${share}% of your minutes, down from ${priorShare}%.`;
			return { key: "mix-shift", tone: "NEUTRAL", text };
		},
	},
	{
		// The activity whose minutes changed the most (skips the mix-shift activity, so it isn't repeated)
		key: "biggest-mover",
		build: ({ raw, hasPrior, hasHistory, shares }) => {
			if (!hasPrior || !hasHistory) return null;
			const mixShiftActivity = getMixShift(shares)?.activityType;
			const mover = getActivityMovers(raw).find(
				(activity) => activity.activityType !== mixShiftActivity,
			);
			if (!mover || mover.change === null) return null;

			const label = ACTIVITY_LABELS[mover.activityType];
			const pct = Math.abs(Math.round(mover.change));
			return mover.change > 0
				? {
						key: "biggest-mover",
						tone: "POSITIVE",
						text: `${label} minutes grew the most, up ${pct}%.`,
					}
				: {
						key: "biggest-mover",
						tone: "NEGATIVE",
						text: `${label} minutes dropped the most, down ${pct}%.`,
					};
		},
	},
	{
		key: "time-vs-target",
		build: ({ raw, kpis }) => {
			const { TARGET_OVER_PCT, TARGET_UNDER_PCT, MIN_TARGETED_WORKOUTS } =
				VOLUME_CONFIG;
			if (raw.current.targetedWorkouts < MIN_TARGETED_WORKOUTS) return null;

			const pct = kpis.timeVsTarget.value;
			const diff = Math.abs(Math.round(pct - 100));
			if (pct >= TARGET_OVER_PCT) {
				return {
					key: "time-vs-target",
					tone: "NEUTRAL",
					text: `Your sessions run about ${diff}% longer than planned.`,
				};
			}
			if (pct <= TARGET_UNDER_PCT) {
				return {
					key: "time-vs-target",
					tone: "NEUTRAL",
					text: `Your sessions run about ${diff}% shorter than planned.`,
				};
			}
			return null;
		},
	},
];

// BUILDER

const buildVolumeData = (
	raw: RawVolume,
	periodKey: TrendPeriodKey,
): TrendCategoryData => {
	const hasPrior = hasFullPriorPeriod(raw.firstWorkoutDate, raw.priorPeriod);
	const hasHistory = hasEnoughHistory(raw.firstWorkoutDate, raw.period);
	const kpis = buildVolumeKpis(raw, hasPrior);
	const context: VolumeContext = {
		raw,
		periodKey,
		hasPrior,
		hasHistory,
		kpis,
		shares: getActivityShares(raw),
	};

	return {
		category: "volume",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.minsPerWeek, // headline
			kpis.avgSession,
			kpis.timeVsTarget,
		],
		series: [
			buildSeries("mins-by-week", "Minutes per week", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.totalMins,
			})),
			...buildActivitySeries(raw),
		],
		breakdowns: [
			buildBreakdown(
				"mins-by-activity",
				"Minutes by activity",
				raw.byActivity.map((activity) => ({
					key: activity.activityType.toLowerCase(),
					label: ACTIVITY_LABELS[activity.activityType],
					value: activity.currentMins,
					prior: hasPrior ? activity.priorMins : null,
					unit: "mins",
				})),
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildVolumeData, VOLUME_CONFIG };
