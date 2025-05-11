import { ReactNode } from "react";
import styles from "../../css/details/HistoryDetails.module.scss";
import {
	HistoryDetails as IHistoryDetails,
	HistoryOfType,
} from "../../features/history/types";
import { useHistoryDetails } from "../../hooks/useHistoryDetails";
import { formatCustomDate, formatTime } from "../../utils/utils_dates";
import { formatDuration } from "../../utils/utils_details";
import { getKcals } from "../../utils/utils_history";
import DetailsBlock from "./DetailsBlock";
import { addEllipsis } from "../../utils/utils_misc";

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
	const name = addEllipsis(workout?.workoutName, 20);

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
							{/* <DetailsBlock
								type="Reps"
								label="Reps"
								value={entry.reps}
							/>
							<DetailsBlock
								type="WorkoutType"
								label="Workout"
								value={"Workout"}
							/> */}
						</div>
						{/*  */}
						{/*  */}
						{/*  */}
					</div>
				</>
			)}
		</div>
	);
};

export default HistoryDetails;
