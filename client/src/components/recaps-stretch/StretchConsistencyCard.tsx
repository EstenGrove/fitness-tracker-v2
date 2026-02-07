import styles from "../../css/recaps-stretch/StretchConsistencyCard.module.scss";
import { StretchRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange } from "../../utils/utils_recaps";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";

type Props = {
	isActive: boolean;
	data: StretchRecapDetails;
};

const getConsistencyInfo = (data: StretchRecapDetails) => {
	if (!data) return "";
	const totalWorkouts = data.recap.totalWorkouts;
	const totalDays = data.trends.rangeDays;

	if (totalWorkouts >= totalDays) {
		return `every day`;
	} else {
		return `${totalWorkouts} times`;
	}
};

const StretchConsistencyCard = ({ isActive, data }: Props) => {
	const info = getConsistencyInfo(data);
	const days = getDaysRange(data);
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You stretched <b>{info}</b> over that last <b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>
					That's some great consistency with your stretching exercise.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				{/*  */}
				{/*  */}
			</RecapsBody>
		</RecapsCard>
	);
};

export default StretchConsistencyCard;
