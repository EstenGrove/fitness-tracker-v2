import styles from "../../css/recaps-strength/StrengthVolumeCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange, getLongestMins } from "../../utils/utils_recaps";
import { durationTo } from "../../utils/utils_workouts";
import RecapChart from "../recaps-shared/RecapChart";

type Props = { isActive: boolean; data: StrengthRecapDetails };

const getOverallTrend = (data: StrengthRecapDetails) => {
	if (!data) return { delta: 0, direction: "flat" };
	const volTrend = data.trends.volume;
	return volTrend;
};

type LayeredData = {
	reps: number[];
	volume: number[];
};

const getLayeredData = (data: StrengthRecapDetails): LayeredData => {
	if (!data) return { volume: [], reps: [] };
	const reps = [...data.history].map((entry) => entry.totalReps);
	const volume = [...data.history].map((entry) => entry.totalVolume);

	return {
		reps,
		volume,
	};
};

const getMaxVolume = (data: StrengthRecapDetails) => {
	if (!data) return 0;
	return data.recap.maxVolume;
};

// VOLUME CARD

const StrengthVolumeCard = ({ isActive, data }: Props) => {
	const days = getDaysRange(data);
	const trend = getOverallTrend(data);
	const maxVolume = getMaxVolume(data);
	const layeredData = getLayeredData(data);

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your <b>volume</b> is trending{" "}
					<b data-direction={trend.direction}>{trend.direction}</b> in the last{" "}
					<b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>Your max volume was {maxVolume} lbs.</h6>
			</RecapsHeader>

			<RecapsBody>
				<div className={styles.Chart}>
					<RecapChart
						icon="weightLift"
						chartFill="var(--strengthFill)"
						chartStroke="var(--strengthAccent)"
						data={layeredData.volume}
						label="Total Volume"
						titlePosition="bottom"
					/>
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default StrengthVolumeCard;
