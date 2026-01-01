import React from "react";
import styles from "../../css/weekly-recap/CompletedCard.module.scss";
import { WeeklyRecapCompleted } from "../../features/recaps/types";

type Props = {
	data: WeeklyRecapCompleted;
};

const CompletedCard = ({ data }: Props) => {
	const { totalCount, completedCount } = data;

	return (
		<div className={styles.CompletedCard}>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default CompletedCard;
