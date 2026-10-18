import {
	buildBreakdown,
	buildKpi,
	buildMomentumInsight,
	buildSeries,
	formatCount,
	formatNameList,
	getPriorPeriodLabel,
	hasEnoughHistory,
	hasFullPriorPeriod,
	perWeek,
	pickInsights,
	toTrendPeriod,
} from "../utils.js";
import type {
	InsightRule,
	RawStrength,
	RawStrengthWeek,
	RawStrengthWorkout,
	TrendCategoryData,
	TrendKpi,
	TrendPeriodKey,
} from "../types.js";

/**
 * STRENGTH: how much load the user moves.
 * - Owns: volume (weight x reps), strength sessions, PRs & plateaus per workout
 * - PRs use the estimated 1-rep max (weight x (1 + reps / 30)), compared WITHIN a workout only:
 *   a high-rep exercise's estimate isn't comparable to another exercise's
 */

const STRENGTH_CONFIG = {
	PLATEAU_MIN_SESSIONS: 4, // sessions since the workout's best set...
	PLATEAU_MIN_DAYS: 42, // ...over at least this long, without beating it
	MAX_NAMES: 2, // workouts named in a list, eg. "A, B and 2 others"
};

interface StrengthContext {
	raw: RawStrength;
	periodKey: TrendPeriodKey;
	hasPrior: boolean;
	hasHistory: boolean;
	kpis: {
		volumePerWeek: TrendKpi;
		sessionsPerWeek: TrendKpi;
		newPRs: TrendKpi;
		workoutsTrained: TrendKpi;
	};
	prs: RawStrengthWorkout[];
	plateaus: RawStrengthWorkout[];
	droppedOff: RawStrengthWorkout[];
}

// HELPERS

const getWorkoutLabel = (workout: RawStrengthWorkout) => {
	return workout.workoutName ?? "A strength workout";
};

// eg. "42 reps at 20 lb"
const formatBestSet = (workout: RawStrengthWorkout) => {
	return `${workout.bestReps} reps at ${workout.bestWeight} lb`;
};

const getAvgVolumePerWeek = (weeks: RawStrengthWeek[]) => {
	if (!weeks.length) return null;
	const total = weeks.reduce((sum, week) => sum + week.volume, 0);
	return total / weeks.length;
};

// A PR: this period's best set beats the workout's best from ALL earlier history
const getPRs = (raw: RawStrength) => {
	return raw.byWorkout.filter(
		(workout) =>
			workout.bestE1rm !== null &&
			workout.previousBestE1rm !== null &&
			workout.bestE1rm > workout.previousBestE1rm,
	);
};

// A plateau: several sessions over several weeks without beating the period's best set
const getPlateaus = (raw: RawStrength) => {
	const { PLATEAU_MIN_SESSIONS, PLATEAU_MIN_DAYS } = STRENGTH_CONFIG;
	const msPerDay = 24 * 60 * 60 * 1000;
	const periodEnd = Date.parse(raw.period.endDate);

	return raw.byWorkout
		.filter((workout) => {
			if (!workout.bestDate) return false;
			const daysSinceBest =
				(periodEnd - Date.parse(workout.bestDate)) / msPerDay;
			return (
				workout.sessionsSinceBest >= PLATEAU_MIN_SESSIONS &&
				daysSinceBest >= PLATEAU_MIN_DAYS
			);
		})
		.sort((a, b) => b.sessionsSinceBest - a.sessionsSinceBest);
};

// Done in the prior period, but not in this one
const getDroppedOff = (raw: RawStrength) => {
	return raw.byWorkout.filter(
		(workout) => workout.priorSessions > 0 && workout.currentSessions === 0,
	);
};

const countWorkoutsTrained = (
	raw: RawStrength,
	period: "current" | "prior",
) => {
	return raw.byWorkout.filter((workout) =>
		period === "current"
			? workout.currentSessions > 0
			: workout.priorSessions > 0,
	).length;
};

// KPIS

const buildStrengthKpis = (
	raw: RawStrength,
	hasPrior: boolean,
	prs: RawStrengthWorkout[],
): StrengthContext["kpis"] => {
	const { current, prior, period } = raw;

	return {
		volumePerWeek: buildKpi({
			key: "volume-per-week",
			label: "Volume / week",
			unit: "lb",
			value: perWeek(current.volume, period.weeks),
			prior: hasPrior ? perWeek(prior.volume, period.weeks) : null,
		}),
		sessionsPerWeek: buildKpi({
			key: "sessions-per-week",
			label: "Sessions / week",
			unit: "count",
			value: perWeek(current.sessions, period.weeks),
			prior: hasPrior ? perWeek(prior.sessions, period.weeks) : null,
		}),
		newPRs: buildKpi({
			key: "new-prs",
			label: "New PRs",
			unit: "count",
			value: prs.length,
			prior: null, // PRs are measured against all history, not the prior period
		}),
		workoutsTrained: buildKpi({
			key: "workouts-trained",
			label: "Workouts trained",
			unit: "count",
			changeType: "points",
			betterWhen: "none", // variety isn't better or worse
			value: countWorkoutsTrained(raw, "current"),
			prior: hasPrior ? countWorkoutsTrained(raw, "prior") : null,
		}),
	};
};

// INSIGHTS (in priority order; the first 3 that apply are shown)

const INSIGHT_RULES: InsightRule<StrengthContext>[] = [
	{
		// Always applies: volume per week, with its change when it's notable
		key: "volume-per-week",
		build: ({ kpis, periodKey }) => {
			const { value, change, tone } = kpis.volumePerWeek;
			const level = `You moved ${formatCount(value)} lb a week`;

			if (change === null || tone === "NEUTRAL") {
				return { key: "volume-per-week", tone: "NEUTRAL", text: `${level}.` };
			}

			const direction = change > 0 ? "up" : "down";
			const pct = Math.abs(Math.round(change));
			const text = `${level}, ${direction} ${pct}% from ${getPriorPeriodLabel(periodKey)}.`;
			return { key: "volume-per-week", tone, text };
		},
	},
	{
		key: "prs",
		build: ({ prs }) => {
			if (!prs.length) return null;
			const top = prs[0];
			const text =
				prs.length === 1
					? `New best on ${getWorkoutLabel(top)}: ${formatBestSet(top)}.`
					: `New bests on ${prs.length} workouts, including ${getWorkoutLabel(top)}: ${formatBestSet(top)}.`;
			return { key: "prs", tone: "POSITIVE", text };
		},
	},
	{
		key: "momentum",
		build: ({ raw }) =>
			buildMomentumInsight({
				weeks: raw.weeks,
				getValue: getAvgVolumePerWeek,
				changeType: "relative",
				betterWhen: "higher",
				toText: ({ recent, earlier, change }) =>
					change > 0
						? `Your lifting has picked up: ${formatCount(recent)} lb a week over the last 4 weeks, up from ${formatCount(earlier)}.`
						: `You've lifted a bit less lately: ${formatCount(recent)} lb a week over the last 4 weeks, compared with ${formatCount(earlier)} before.`,
			}),
	},
	{
		// Said as a nudge, not a failure
		key: "plateau",
		build: ({ plateaus }) => {
			const workout = plateaus[0];
			if (!workout) return null;
			return {
				key: "plateau",
				tone: "NEUTRAL",
				text: `${getWorkoutLabel(workout)} hasn't topped ${formatBestSet(workout)} in ${workout.sessionsSinceBest} sessions. Try adding a rep or a little weight.`,
			};
		},
	},
	{
		key: "dropped-off",
		build: ({ droppedOff, hasHistory }) => {
			if (!hasHistory || !droppedOff.length) return null;
			const names = formatNameList(
				droppedOff.map(getWorkoutLabel),
				STRENGTH_CONFIG.MAX_NAMES,
			);
			const text =
				droppedOff.length === 1
					? `You haven't done ${names} this period.`
					: `${droppedOff.length} workouts from before weren't done this period: ${names}.`;
			return { key: "dropped-off", tone: "NEUTRAL", text };
		},
	},
];

// BUILDER

const buildStrengthData = (
	raw: RawStrength,
	periodKey: TrendPeriodKey,
): TrendCategoryData | null => {
	// No strength sessions in either period: nothing to show (hidden on the hub)
	if (!raw.current.sessions && !raw.prior.sessions) return null;

	const hasPrior = hasFullPriorPeriod(raw.firstWorkoutDate, raw.priorPeriod);
	const hasHistory = hasEnoughHistory(raw.firstWorkoutDate, raw.period);
	const prs = getPRs(raw);
	const kpis = buildStrengthKpis(raw, hasPrior, prs);
	const context: StrengthContext = {
		raw,
		periodKey,
		hasPrior,
		hasHistory,
		kpis,
		prs,
		plateaus: getPlateaus(raw),
		droppedOff: getDroppedOff(raw),
	};
	const trained = raw.byWorkout.filter(
		(workout) => workout.currentSessions > 0,
	);

	return {
		category: "strength",
		period: toTrendPeriod(periodKey, raw.period),
		kpis: [
			kpis.volumePerWeek, // headline
			kpis.sessionsPerWeek,
			kpis.newPRs,
			kpis.workoutsTrained,
		],
		series: [
			buildSeries("volume-by-week", "Volume per week", raw.weeks, (week) => ({
				x: week.weekStart,
				y: week.volume,
			})),
		],
		breakdowns: [
			buildBreakdown(
				"volume-by-workout",
				"Volume by workout",
				trained.map((workout) => ({
					key: `workout-${workout.workoutID}`,
					label: getWorkoutLabel(workout),
					value: workout.currentVolume,
					prior: hasPrior ? workout.priorVolume : null,
					unit: "lb",
				})),
			),
			buildBreakdown(
				"best-set-by-workout",
				"Best set by workout (est. 1-rep max)",
				trained
					.filter((workout) => workout.bestE1rm !== null)
					.map((workout) => ({
						key: `workout-${workout.workoutID}`,
						label: `${getWorkoutLabel(workout)} · ${formatBestSet(workout)}`,
						value: workout.bestE1rm ?? 0,
						prior: workout.previousBestE1rm,
						unit: "lb",
					})),
				false, // estimates per workout aren't parts of a whole
			),
		],
		insights: pickInsights(INSIGHT_RULES, context),
	};
};

export { buildStrengthData, STRENGTH_CONFIG };
