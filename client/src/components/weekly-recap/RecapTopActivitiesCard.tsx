import React from "react";
import styles from "../../css/weekly-recap/RecapTopActivitiesCard.module.scss";
import {
	WeeklyRecapForActivity,
	WeeklyRecapForWalkActivity,
} from "../../features/recaps/types";
import RecapCard from "./RecapCard";

type Props = {
	isActive: boolean;
	data: Array<WeeklyRecapForActivity | WeeklyRecapForWalkActivity>;
};

const getTitle = (
	data: Array<WeeklyRecapForActivity | WeeklyRecapForWalkActivity>
) => {
	const types = data.map((act) => act.activityType);
	const [top1, top2] = types;

	return [top1, top2];
};

const RecapTopActivitiesCard = ({ isActive = false, data }: Props) => {
	const types = getTitle(data);
	const header = (
		<>
			<h2 className={styles.Title}>
				You're top two activities were <b>{types[0]}</b> & <b>{types[1]}</b>{" "}
				workouts.
			</h2>
			<h6 className={styles.Desc}>You performed a lot of workouts.</h6>
		</>
	);
	const body = (
		<>
			{/*  */}
			{/*  */}
		</>
	);

	if (!isActive) return null;
	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="effort"
			color="var(--accent-yellow)"
		/>
	);
};

export default RecapTopActivitiesCard;
