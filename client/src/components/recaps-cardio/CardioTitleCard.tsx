import styles from "../../css/recaps-Cardio/CardioTitleCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";

import RecapsBody from "../recaps-carousel/RecapsBody";
import TypeBadge from "../activity/TypeBadge";
import { CardioRecapDetails } from "../../features/workout-recaps/types";

type Props = {
	isActive: boolean;
	data: CardioRecapDetails;
};

const CardioTitleCard = ({ isActive, data }: Props) => {
	const lastXDays = data?.trends?.rangeDays ?? 30;
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<TypeBadge activityType="Cardio" size="MD" />
				<h2 className={styles.Title}>
					<b>Cardio Workouts</b> Recap
				</h2>
				<h6 className={styles.Desc}>
					Your recap for the last {lastXDays} days.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				<div className={styles.Body}>
					{/*  */}
					{/*  */}
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default CardioTitleCard;
