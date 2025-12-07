import { ReactNode } from "react";
import styles from "../../css/details/PostWorkoutDetails.module.scss";
import {
	CardioHistory,
	OtherHistory,
	StrengthHistory,
	StretchHistory,
	TimedHistory,
	WalkHistory,
} from "../../features/history/types";
import {
	getSets,
	getSetsSummary,
	getTotalDetailMins,
	getTotalDetailsCalories,
	getTotalReps,
	getWeight,
} from "../../utils/utils_details";
import {
	getExerciseFromSets,
	getMiles,
	getPace,
	getSteps,
} from "../../utils/utils_history";
import {
	NthStats,
	PostWorkoutHistory,
	PostWorkoutHistoryWithSets,
} from "../../features/stats/types";
import DetailsBlock from "./DetailsBlock";
import { WorkoutSet } from "../../utils/utils_workouts";

type Props = {
	entry: PostWorkoutHistory;
	nthStats: NthStats;
};

type DetailsProps<T extends PostWorkoutHistory> = {
	entry: T;
	children?: ReactNode;
};

const DetailsSet = <T extends PostWorkoutHistory>({
	entry,
	children,
}: DetailsProps<T>) => {
	const effort = entry.effort;
	const mins = getTotalDetailMins(entry as PostWorkoutHistory);
	const kcals = getTotalDetailsCalories(entry);
	return (
		<div className={styles.DetailsSet}>
			<DetailsBlock type="Duration" label="Duration" value={mins + ""} />
			<DetailsBlock type="Effort" label="Effort" value={effort} />
			<DetailsBlock type="Calories" label="kcals" value={kcals} />
			{children}
		</div>
	);
};

const Strength = ({ entry }: DetailsProps<StrengthHistory>) => {
	const sets = getSets(entry);
	const weight = getWeight(entry);
	const reps = getTotalReps(entry.sets);
	console.log("entry.sets", entry.sets);

	return (
		<div className={styles.Block}>
			<div className={styles.Block_group}>
				<DetailsSet entry={entry}>
					<DetailsBlock type="Weight" label="Weight" value={weight} />
				</DetailsSet>
			</div>
			<div className={styles.Block_group}>
				<DetailsBlock type="Reps" label="Total Reps" value={reps} />
				<DetailsBlock type="Sets" label="Total Sets" value={sets} />
			</div>
		</div>
	);
};
const Cardio = ({ entry }: DetailsProps<CardioHistory>) => {
	const exercise = entry.exercise ?? "Cardio";

	return (
		<DetailsSet entry={entry}>
			<DetailsBlock type="WorkoutType" label="Exercise" value={exercise} />
		</DetailsSet>
	);
};
const Walk = ({ entry }: DetailsProps<WalkHistory>) => {
	const steps = getSteps(entry);
	const miles = getMiles(entry);
	const pace = getPace(entry);

	return (
		<div className={styles.Walk}>
			<div className={styles.Walk_group}>
				<DetailsSet entry={entry}>
					<DetailsBlock type="Steps" label="Steps" value={steps} />
				</DetailsSet>
			</div>
			<div className={styles.Walk_group}>
				<DetailsBlock type="Miles" label="Miles" value={miles} />
				<DetailsBlock type="Pace" label="Pace" value={pace} />
			</div>
		</div>
	);
};
const Stretch = ({ entry }: DetailsProps<StretchHistory>) => {
	const exercise = getExerciseFromSets(entry.sets, "Stretch");

	return (
		<div className={styles.Block}>
			<div className={styles.Block_group}>
				<DetailsSet entry={entry}>
					<DetailsBlock type="WorkoutType" label="Exercise" value={exercise} />
				</DetailsSet>
			</div>
		</div>
	);
};
const Timed = ({ entry }: DetailsProps<TimedHistory>) => {
	const exercise = getExerciseFromSets(entry.sets, "Timed");

	return (
		<DetailsSet entry={entry}>
			<DetailsBlock type="WorkoutType" label="Exercise" value={exercise} />
		</DetailsSet>
	);
};
const Other = ({ entry }: DetailsProps<OtherHistory>) => {
	const exercise = getExerciseFromSets(entry.sets, "Other");

	return (
		<DetailsSet entry={entry}>
			<DetailsBlock type="WorkoutType" label="Exercise" value={exercise} />
		</DetailsSet>
	);
};

const NthStatsInfo = ({ nthStats }: { nthStats: NthStats }) => {
	const nthWorkout = nthStats.nthWorkout;
	return (
		<div className={styles.NthStatsInfo}>
			<div className={styles.NthStatsInfo_label}>
				<b>Workout Stats</b>
			</div>
			<div className={styles.NthStatsInfo_group}>
				This was your <b>{nthWorkout}</b> workout of the week.
			</div>
		</div>
	);
};

const hasSets = (entry: PostWorkoutHistory): boolean => {
	if ("sets" in entry) {
		const sets = entry.sets as WorkoutSet[];
		return sets.length > 0;
	}
	return false;
};

const SetsSummary = ({ entry }: { entry: PostWorkoutHistoryWithSets }) => {
	const summary = getSetsSummary(entry.sets);
	return (
		<div className={styles.SetsSummary}>
			<div className={styles.SetsSummary_label}>
				<b>Sets Summary</b>
			</div>
			<div className={styles.SetsSummary_group}>
				{summary &&
					summary.map((desc: string, idx) => {
						const key = `${desc.slice(0, 10)}-${idx}`;
						return (
							<div key={key} className={styles.SetsSummary_item}>
								{desc}
							</div>
						);
					})}
			</div>
		</div>
	);
};

const PostWorkoutDetails = ({ entry, nthStats }: Props) => {
	const activityType = entry.activityType;
	return (
		<div className={styles.PostWorkoutDetails}>
			{entry && (
				<>
					<div className={styles.PostWorkoutDetails_blocks}>
						{activityType === "Strength" && (
							<Strength entry={entry as StrengthHistory} />
						)}
						{activityType === "Cardio" && (
							<Cardio entry={entry as CardioHistory} />
						)}
						{activityType === "Stretch" && (
							<Stretch entry={entry as StretchHistory} />
						)}
						{activityType === "Walk" && <Walk entry={entry as WalkHistory} />}
						{activityType === "Timed" && (
							<Timed entry={entry as TimedHistory} />
						)}
						{activityType === "Other" && (
							<Other entry={entry as OtherHistory} />
						)}
					</div>
					<div className={styles.PostWorkoutDetails_stats}>
						<NthStatsInfo nthStats={nthStats} />
					</div>
					{hasSets(entry) && (
						<div className={styles.PostWorkoutDetails_stats}>
							<SetsSummary entry={entry as PostWorkoutHistoryWithSets} />
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PostWorkoutDetails;
