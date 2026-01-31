import React from "react";
import styles from "../../css/recaps-shared/MinsCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import { durationTo } from "../../utils/utils_workouts";
import RecapsBody from "../recaps-carousel/RecapsBody";
import { WorkoutInsight } from "../../features/insights/types";

type Props = {
	isActive: boolean;
	data: {
		totalMins: number;
		insights: WorkoutInsight;
	};
};

const MinsCard = ({ isActive, data }: Props) => {
	const duration = durationTo(data.totalMins, "h&m");
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{duration}</b> of exercise.
				</h2>
				<h6 className={styles.Desc}>
					You've exceeded your weekly mins {data.insights.total} times.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				{/*  */}
				{/*  */}
			</RecapsBody>
		</RecapsCard>
	);
};

export default MinsCard;
