import React from "react";
import styles from "../../css/weekly-recap/TitleCard.module.scss";
import { RangeParams } from "../../features/types";
import { format } from "date-fns";
import CardHeader from "./CardHeader";

type Props = {
	usersName: string;
	dateRange: RangeParams;
};

const getRangeDesc = (dateRange: RangeParams) => {
	const start = format(dateRange.startDate, "MMMM dd");
	const end = format(dateRange.endDate, "dd, yyyy");

	return `${start} - ${end}`;
};

const TitleCard = ({ usersName, dateRange }: Props) => {
	const dateDesc = getRangeDesc(dateRange);
	return (
		<div className={styles.TitleCard}>
			<CardHeader>
				<h2 className={styles.TitleCard_title}>{usersName}'s Weekly Recap</h2>
				<h6 className={styles.TitleCard_desc}>{dateDesc}</h6>
			</CardHeader>
		</div>
	);
};

export default TitleCard;
