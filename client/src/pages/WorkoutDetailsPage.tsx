import { useParams, useSearchParams } from "react-router";
import sprite from "../assets/icons/edit.svg";
import styles from "../css/pages/WorkoutDetailsPage.module.scss";
import { Activity } from "../features/shared/types";
import { useWorkoutDetails } from "../hooks/useWorkoutDetails";
import {
	CardioWorkout,
	OtherWorkout,
	StrengthWorkout,
	TimedWorkout,
	WalkWorkout,
	WorkoutByType,
} from "../features/workouts/types";
import { ACTIVITY_STYLES } from "../utils/utils_activity";
import Loader from "../components/layout/Loader";
import CardioDetails from "../components/details/CardioDetails";
import WalkDetails from "../components/details/WalkDetails";
import StrengthDetails from "../components/details/StrengthDetails";
import TimedDetails from "../components/details/TimedDetails";
import OtherDetails from "../components/details/OtherDetails";

type HeaderProps = {
	workout: WorkoutByType;
};

const getTypeColor = (type: Activity) => {
	return ACTIVITY_STYLES[type].color;
};
type ActionType = "EDIT" | "DELETE";

type ActionProps = {
	onAction: (action: ActionType) => void;
};

const HeaderActions = ({ onAction }: ActionProps) => {
	return (
		<div className={styles.HeaderActions}>
			<button
				type="button"
				onClick={() => onAction("EDIT")}
				className={styles.HeaderActions_edit}
			>
				<svg className={styles.HeaderActions_edit_icon}>
					<use xlinkHref={`${sprite}#icon-edit-3`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={() => onAction("DELETE")}
				className={styles.HeaderActions_delete}
			>
				<svg className={styles.HeaderActions_delete_icon}>
					<use xlinkHref={`${sprite}#icon-delete_outline`}></use>
				</svg>
			</button>
		</div>
	);
};

const Header = ({ workout }: HeaderProps) => {
	const type = workout.activityType;
	const typeColor = { color: getTypeColor(type) };
	return (
		<header className={styles.Header}>
			<div className={styles.Header_type} style={typeColor}>
				{type} Exercise
			</div>
			<h2 className={styles.Header_name}>{workout.workoutName}</h2>
			<div className={styles.Header_desc}>{workout.workoutDesc}</div>
		</header>
	);
};

const WorkoutDetailsPage = () => {
	const { id } = useParams();
	const [params] = useSearchParams();
	const activityType = params.get("type") as Activity;
	const { data, isLoading } = useWorkoutDetails({
		workoutID: Number(id),
		activityType: activityType,
	});

	const onAction = (action: ActionType) => {
		switch (action) {
			case "EDIT": {
				return;
			}
			case "DELETE": {
				return;
			}
			default:
				break;
		}
	};

	return (
		<div className={styles.WorkoutDetailsPage}>
			{isLoading && (
				<div className={styles.WorkoutDetailsPage_loader}>
					<Loader />
					<span>Loading...</span>
				</div>
			)}
			<HeaderActions onAction={onAction} />
			{data && !isLoading && <Header workout={data?.workout} />}

			<div className={styles.WorkoutDetailsPage_main}>
				{data && activityType === "Cardio" && (
					<CardioDetails entry={data.workout as CardioWorkout} />
				)}
				{data && activityType === "Walk" && (
					<WalkDetails entry={data.workout as WalkWorkout} />
				)}
				{data && activityType === "Strength" && (
					<StrengthDetails entry={data.workout as StrengthWorkout} />
				)}
				{data && activityType === "Timed" && (
					<TimedDetails entry={data.workout as TimedWorkout} />
				)}
				{data && activityType === "Other" && (
					<OtherDetails entry={data.workout as OtherWorkout} />
				)}
			</div>
		</div>
	);
};

export default WorkoutDetailsPage;
