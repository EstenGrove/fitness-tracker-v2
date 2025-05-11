import { ReactNode } from "react";
import styles from "../../css/details/HistoryDetails.module.scss";
import {
	HistoryDetails as IHistoryDetails,
	HistoryOfType,
	WalkHistory,
	StrengthHistory,
	StretchHistory,
	CardioHistory,
	TimedHistory,
	OtherHistory,
} from "../../features/history/types";
import { useHistoryDetails } from "../../hooks/useHistoryDetails";
import { formatCustomDate, formatTime } from "../../utils/utils_dates";
import {
	formatDuration,
	getTotalReps,
	getWeight,
} from "../../utils/utils_details";
import { getKcals } from "../../utils/utils_history";
import DetailsBlock from "./DetailsBlock";
import { addEllipsis, formatThousand } from "../../utils/utils_misc";
import { Activity } from "../../features/shared/types";
import { isExerciseType } from "../../utils/utils_activity";

type ExerciseHistory =
	| StretchHistory
	| CardioHistory
	| TimedHistory
	| OtherHistory;

type Props = {
	history: HistoryOfType;
};

const getWhen = (history: HistoryOfType) => {
	const { startTime, endTime } = history;
	const start = formatTime(startTime, "short");
	const end = formatTime(endTime, "short");

	return `${start} - ${end}`;
};

const HistoryBlock = ({
	entry,
	children,
}: {
	entry: HistoryOfType;
	children?: ReactNode;
}) => {
	const kcals = getKcals(entry);
	const duration = formatDuration(entry.duration);
	return (
		<>
			<DetailsBlock type="Duration" label="Duration" value={duration} />
			<DetailsBlock type="Calories" label="Calories" value={kcals} />
			<DetailsBlock type="Effort" label="Effort" value={entry.effort} />
			{children}
		</>
	);
};

const WalkBlock = ({ entry }: { entry: WalkHistory }) => {
	const mi = entry.miles.toFixed(2);
	const pace = entry.pace.toFixed(2);
	const steps = formatThousand(entry.steps);

	return (
		<>
			<DetailsBlock type="Miles" label="Miles" value={mi + " mi"} />
			<DetailsBlock type="Pace" label="Pace" value={pace + "'/mi"} />
			<DetailsBlock type="Steps" label="Steps" value={steps} />
		</>
	);
};
const StrengthBlock = ({ entry }: { entry: StrengthHistory }) => {
	const sets = entry.sets.length;
	const weight = getWeight(entry);
	const reps = getTotalReps(entry.sets);

	return (
		<>
			<DetailsBlock type="Reps" label="Reps" value={reps} />
			<DetailsBlock type="Sets" label="Sets" value={sets} />
			<DetailsBlock type="Weight" label="Weight" value={weight} />
		</>
	);
};

const ExerciseBlock = ({
	type,
	entry,
}: {
	type: Activity;
	entry: ExerciseHistory;
}) => {
	const exercise = entry.exercise ?? type;
	const duration = formatDuration(entry.duration);
	const kcals = getKcals(entry);

	return (
		<>
			<DetailsBlock type="WorkoutType" label="Exercise" value={exercise} />
			<DetailsBlock type="Duration" label="Duration" value={duration} />
			<DetailsBlock type="Calories" label="Calories" value={kcals} />
		</>
	);
};

const HistoryDetails = ({ history }: Props) => {
	const { data } = useHistoryDetails({
		userID: history?.userID,
		historyID: history?.historyID,
		activityType: history?.activityType,
	});
	const when = getWhen(history);
	const date = formatCustomDate(history.workoutDate, "monthAndDay");
	const details = data as IHistoryDetails;
	const workout = details?.workout;
	const entry = details?.history;
	const activityType = history?.activityType;
	const name = addEllipsis(workout?.workoutName, 20);
	const isExercise = isExerciseType(activityType);

	console.log("details", details);

	return (
		<div className={styles.HistoryDetails}>
			{!!data?.workout && (
				<>
					<div className={styles.HistoryDetails_title}>{date}</div>
					<div className={styles.HistoryDetails_when}>{when}</div>
					<div className={styles.HistoryDetails_name}>{name}</div>
					<div className={styles.HistoryDetails_main}>
						<div className={styles.HistoryDetails_main_block}>
							<HistoryBlock entry={entry}>
								<DetailsBlock
									type="WorkoutType"
									label="Workout"
									value={"Workout"}
								/>
							</HistoryBlock>
						</div>
						<div className={styles.HistoryDetails_main_block}>
							{activityType === "Walk" && (
								<WalkBlock entry={entry as WalkHistory} />
							)}
							{activityType === "Strength" && (
								<StrengthBlock entry={entry as StrengthHistory} />
							)}
							{isExercise && (
								<ExerciseBlock
									type={activityType}
									entry={entry as ExerciseHistory}
								/>
							)}
							{/*  */}
							{/*  */}
							{/*  */}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default HistoryDetails;
