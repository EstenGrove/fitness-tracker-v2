import React from "react";
import styles from "../../css/details/HistoryDetails.module.scss";
import { WorkoutHistory } from "../../features/history/types";
import { addEllipsis } from "../../utils/utils_misc";

type Props = {
	history: WorkoutHistory[];
};

type HistoryItemProps = {
	entry: WorkoutHistory;
};

const HistoryItem = ({ entry }: HistoryItemProps) => {
	const { workoutName, duration } = entry;
	const name = addEllipsis(workoutName, 20);
	return (
		<li className={styles.HistoryItem}>
			<div className={styles.HistoryItem_name}>{name}</div>
			<div className={styles.HistoryItem_name}>{duration} min.</div>
		</li>
	);
};

const HistoryDetails = ({ history }: Props) => {
	return (
		<div className={styles.HistoryDetails}>
			<div className={styles.HistoryDetails_title}>History</div>
			<ul className={styles.HistoryDetails_list}>
				{history &&
					history.map((entry, idx) => {
						return <HistoryItem key={entry.historyID + idx} entry={entry} />;
					})}
			</ul>
		</div>
	);
};

export default HistoryDetails;
