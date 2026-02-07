import styles from "../../css/recaps-stretch/StretchTitleCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";

import RecapsBody from "../recaps-carousel/RecapsBody";
import TypeBadge from "../activity/TypeBadge";
import { StretchRecapDetails } from "../../features/workout-recaps/types";

type Props = {
	isActive: boolean;
	data: StretchRecapDetails;
};

const StretchTitleCard = ({ isActive, data }: Props) => {
	const lastXDays = data?.trends?.rangeDays ?? 30;
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<TypeBadge activityType="Stretch" size="MD" />
				<h2 className={styles.Title}>
					<b>Stretch Workouts</b> Recap
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

export default StretchTitleCard;
