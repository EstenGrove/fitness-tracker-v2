import React from "react";
import styles from "../../css/recaps-cardio/CardioAveragesCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import { CardioRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange, getLongestMins } from "../../utils/utils_recaps";
import { durationTo } from "../../utils/utils_workouts";

type Props = {
	isActive: boolean;
	data: CardioRecapDetails;
};

const getOverallTrend = (data: CardioRecapDetails) => {
	if (!data) return { delta: 0, direction: "flat" };
	const volTrend = data.trends.volume;
	return volTrend;
};

type LayeredData = {
	reps: number[];
	calories: number[];
};

const getLayeredData = (data: CardioRecapDetails): LayeredData => {
	if (!data) return { calories: [], reps: [] };
	const reps = [...data.history].map((entry) => entry.totalReps);
	const calories = [...data.history].map((entry) => entry.totalCalories);

	return {
		reps,
		calories,
	};
};

const CardioAveragesCard = ({ isActive, data }: Props) => {
	const days = getDaysRange(data);
	const trend = getOverallTrend(data);
	const longest = getLongestMins(data);
	const layeredData = getLayeredData(data);
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your <b>cardio</b> is trending{" "}
					<b data-direction={trend?.direction}>{trend?.direction}</b> in the
					last <b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>
					Your longest workout was {durationTo(longest, "h&m")}.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				{/*  */}
				{/*  */}
				{/*  */}
			</RecapsBody>
		</RecapsCard>
	);
};

export default CardioAveragesCard;
