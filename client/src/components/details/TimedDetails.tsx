import { ReactNode } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/details/TimedDetails.module.scss";
import { TimedWorkout } from "../../features/workouts/types";
import TypeBadge from "../activity/TypeBadge";
import { TimedHistory } from "../../features/history/types";

type Props = { entry: TimedWorkout | TimedHistory };

type DetailsProps = {
	label: string;
	icon: string;
	children?: ReactNode;
};

const icons = {
	sets: "weightlift-2",
	reps: "pushups",
	weight: "weight-pound",
	steps: "walking-2",
	miles: "step-length",
	pace: "time-2",
	exercise: "exercise",
	duration: "time",
};

const DetailsItem = ({ label, icon, children }: DetailsProps) => {
	const iconName = icons[icon as keyof object];
	return (
		<div className={styles.DetailsItem}>
			<div className={styles.DetailsItem_item}>
				<svg className={styles.DetailsItem_item_icon}>
					<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
				</svg>
				<span>{label}</span>
			</div>
			<div className={styles.DetailsItem_main}>{children}</div>
		</div>
	);
};

const TimedDetails = ({ entry }: Props) => {
	const { exercise, duration } = entry;
	return (
		<div className={styles.TimedDetails}>
			<div className={styles.TimedDetails_main}>
				<DetailsItem icon="exercise" label="Exercise: ">
					<span>{exercise}</span>
				</DetailsItem>
				<DetailsItem icon="duration" label="Duration: ">
					<span>{duration} min.</span>
				</DetailsItem>
			</div>
		</div>
	);
};

export default TimedDetails;
