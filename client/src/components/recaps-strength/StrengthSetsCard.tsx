import React from "react";
import styles from "../../css/recaps-strength/StrengthSetsCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import TotalsItem from "../recaps-shared/TotalsItem";
import RecapChart from "../recaps-shared/RecapChart";

type Props = {
	isActive: boolean;
	data: StrengthRecapDetails;
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
					You performed {totalWorkouts} in the last {days} days.
				</div>
			</RecapsHeader>
			<RecapsBody styles={{ justifyContent: "flex-start", paddingTop: "3rem" }}>
				<div className={styles.Charts}>
					<div className={styles.Charts_item}>
						<RecapChart
							data={historyData?.volume as number[]}
							label="Total Volume"
							icon="weight"
							chartFill="var(--blueGrey500)"
							chartStroke="#fff"
						/>
					</div>
					<div className={styles.Charts_item}>
						<RecapChart
							data={historyData?.reps as number[]}
							label="Total Reps"
							icon="weightLift"
							chartFill="var(--strengthFill)"
							chartStroke="var(--strengthAccent)"
						/>
					</div>
				</div>
				<div className={styles.Charts}>
					<TotalsItem
						icon="weight"
						total={totalVolume}
						label="Total Volume"
						color="var(--strengthAccent)"
					/>
					<TotalsItem
						icon="weightLift"
						total={data?.recap?.totalReps}
						label="Total Reps"
						color="var(--strengthAccent)"
					/>
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default StrengthSetsCard;
