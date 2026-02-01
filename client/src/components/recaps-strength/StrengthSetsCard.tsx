import React from "react";
import styles from "../../css/recaps-strength/StrengthSetsCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import TotalsItem from "../recaps-shared/TotalsItem";
import RecapChart from "../recaps-shared/RecapChart";
import TrendLine from "../ui/TrendLine";
import RecapTrendLine from "../recaps-shared/RecapTrendLine";
import { durationTo } from "../../utils/utils_workouts";

type Props = {
	isActive: boolean;
	data: StrengthRecapDetails;
};

const getLongestSession = (data: StrengthRecapDetails) => {
	if (!data || !data?.history?.length) return 0;
	const mins = data.history.map((entry) => entry.totalMins);
	const max = Math.max(...mins);

	return max;
};

const getTrendsData = (data: StrengthRecapDetails) => {
	if (!data || !data?.history?.length) {
		return { reps: [], sets: [], volume: [], calories: [] };
	}

	const repsData = data.history.map((entry) => entry.totalReps);
	const setsData = data.history.map((entry) => entry.totalSets);
	const volData = data.history.map((entry) => entry.totalVolume);
	const caloriesData = data.history.map((entry) => entry.totalCalories);

	return {
		reps: repsData,
		sets: setsData,
		volume: volData,
		calories: caloriesData,
	};
};

const StrengthSetsCard = ({ isActive, data }: Props) => {
	const totalVolume = data?.recap?.totalVolume;
	const historyData = getTrendsData(data);
	const longestMins = getLongestSession(data);
	const volume = data?.trends?.volume;
	const days = data?.trends?.rangeDays;
	const totalWorkouts = data?.recap?.totalWorkouts;

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your volume efforts are trending <b>{volume?.direction}</b>!
				</h2>
				<div className={styles.Desc}>
					Your longest session was {durationTo(longestMins, "h&m")}.
				</div>
			</RecapsHeader>
			<RecapsBody styles={{ justifyContent: "flex-start", paddingTop: "3rem" }}>
				<div className={styles.Charts}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default StrengthSetsCard;
