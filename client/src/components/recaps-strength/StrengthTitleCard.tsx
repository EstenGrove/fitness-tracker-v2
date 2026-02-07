import styles from "../../css/recaps-strength/StrengthTitleCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";

import RecapsBody from "../recaps-carousel/RecapsBody";
import TypeBadge from "../activity/TypeBadge";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";

type Props = {
	isActive: boolean;
	data: StrengthRecapDetails;
};

const StrengthTitleCard = ({ isActive, data }: Props) => {
	const lastXDays = data?.trends?.rangeDays ?? 30;
	const title = data?.title;
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<TypeBadge activityType="Strength" size="MD" />
				<h2 className={styles.Title}>
					<b>{title}</b> Recap
				</h2>
				{/* <h2 className={styles.Title}>
					<b>Strength Training</b> Recap
				</h2> */}
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

export default StrengthTitleCard;
