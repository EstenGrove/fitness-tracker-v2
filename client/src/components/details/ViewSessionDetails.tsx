import sprite from "../../assets/icons/main2.svg";
import styles from "../../css/details/ViewSessionDetails.module.scss";
import {
	CardioHistory,
	OtherHistory,
	StrengthHistory,
	StretchHistory,
	TimedHistory,
	WalkHistory,
	WorkoutHistory,
} from "../../features/history/types";
import { addEllipsis } from "../../utils/utils_misc";
import StrengthDetails from "./StrengthDetails";
import StretchDetails from "./StretchDetails";
import CardioDetails from "./CardioDetails";
import WalkDetails from "./WalkDetails";
import TimedDetails from "./TimedDetails";
import OtherDetails from "./OtherDetails";
import { formatTime } from "../../utils/utils_dates";
import { getActivityStyles } from "../../utils/utils_activity";
import { Activity } from "../../features/shared/types";

type Props = {
	history: WorkoutHistory;
	activityType: Activity;
};

const ViewSessionDetails = ({ history, activityType }: Props) => {
	const { workoutName, startTime, endTime } = history;
	const title = addEllipsis(workoutName, 35);
	const startedAt = formatTime(startTime, "short");
	const endedAt = formatTime(endTime, "short");
	const typeStyles = getActivityStyles(activityType);

	return (
		<div className={styles.ViewSessionDetails}>
			<div className={styles.ViewSessionDetails_top}>
				Activity: <b style={{ color: typeStyles.color }}>{activityType}</b>
			</div>
			<div className={styles.ViewSessionDetails_completed}>
				<svg className={styles.ViewSessionDetails_completed_icon}>
					<use xlinkHref={`${sprite}#icon-guarantee-2`}></use>
				</svg>
				<h3>Completed Workout!</h3>
			</div>
			<div className={styles.ViewSessionDetails_header}>
				<div className={styles.ViewSessionDetails_header_title}>{title}</div>
				<div className={styles.ViewSessionDetails_header_when}>
					{startedAt} - {endedAt}
				</div>
			</div>
			<div className={styles.ViewSessionDetails_details_blocks}>
				{activityType === "Strength" && (
					<StrengthDetails entry={history as StrengthHistory} />
				)}
				{activityType === "Stretch" && (
					<StretchDetails entry={history as StretchHistory} />
				)}
				{activityType === "Cardio" && (
					<CardioDetails entry={history as CardioHistory} />
				)}
				{activityType === "Walk" && (
					<WalkDetails entry={history as WalkHistory} />
				)}
				{activityType === "Timed" && (
					<TimedDetails entry={history as TimedHistory} />
				)}
				{activityType === "Other" && (
					<OtherDetails entry={history as OtherHistory} />
				)}
			</div>

			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default ViewSessionDetails;
