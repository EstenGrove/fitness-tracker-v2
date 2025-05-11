import styles from "../../css/workouts/ViewWorkout.module.scss";
import {
	CardioWorkout,
	OtherWorkout,
	StrengthWorkout,
	StretchWorkout,
	TimedWorkout,
	TodaysWorkout,
	WalkWorkout,
	WorkoutSchedule,
} from "../../features/workouts/types";
import { useSelector } from "react-redux";
import {
	selectIsLoadingWorkout,
	selectSelectedWorkout,
} from "../../features/workouts/workoutsSlice";
import { ReactNode, useCallback, useEffect } from "react";
import { useAppDispatch } from "../../store/store";
import { getWorkoutDetails } from "../../features/workouts/operations";
import { selectCurrentUser } from "../../features/user/userSlice";
import { WorkoutHistory } from "../../features/history/types";
import Loader from "../layout/Loader";
import StrengthDetails from "../details/StrengthDetails";
import ScheduleDetails from "../details/ScheduleDetails";
import StretchDetails from "../details/StretchDetails";
import WalkDetails from "../details/WalkDetails";
import CardioDetails from "../details/CardioDetails";
import TimedDetails from "../details/TimedDetails";
import OtherDetails from "../details/OtherDetails";

type Props = {
	workout: TodaysWorkout;
	onClose: () => void;
};

type DetailsProps = {
	history: WorkoutHistory[];
	schedule: WorkoutSchedule;
	children?: ReactNode;
};

const DetailsSection = ({ history, schedule, children }: DetailsProps) => {
	const total = history?.length ?? 0;
	return (
		<>
			{children}
			<ScheduleDetails schedule={schedule} />
			<div className={styles.HistoryDetails_title}>History</div>
			<div className={styles.HistoryDetails_list}>
				You've performed this workout <b>{total}</b> times.
			</div>
		</>
	);
};

const ViewWorkout = ({ workout }: Props) => {
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const details = useSelector(selectSelectedWorkout);
	const isLoading = useSelector(selectIsLoadingWorkout);
	// values
	const schedule = details?.schedule as WorkoutSchedule;
	const activityType = workout.activityType;

	const getDetails = useCallback(() => {
		if (workout && currentUser) {
			const { userID } = currentUser;
			dispatch(
				getWorkoutDetails({
					userID,
					workoutID: workout.workoutID,
					activityType: workout.activityType,
				})
			);
		}
	}, [currentUser, dispatch, workout]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		getDetails();

		return () => {
			isMounted = false;
		};
	}, [getDetails]);

	console.log("workout", workout);

	if (isLoading) {
		return (
			<div className={styles.ViewWorkout}>
				<Loader>
					<span>Loading details...</span>
				</Loader>
			</div>
		);
	}
	return (
		<div className={styles.ViewWorkout}>
			<div className={styles.ViewWorkout_header}>
				<div className={styles.ViewWorkout_header_title}>
					{workout.workoutName}
				</div>
			</div>
			{/* DETAILS */}
			{!!details && (
				<>
					{activityType === "Strength" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<StrengthDetails entry={details.workout as StrengthWorkout} />
							</DetailsSection>
						</>
					)}
					{activityType === "Stretch" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<StretchDetails entry={details.workout as StretchWorkout} />
							</DetailsSection>
						</>
					)}
					{activityType === "Walk" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<WalkDetails entry={details.workout as WalkWorkout} />
							</DetailsSection>
						</>
					)}
					{activityType === "Cardio" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<CardioDetails entry={details.workout as CardioWorkout} />
							</DetailsSection>
						</>
					)}
					{activityType === "Timed" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<TimedDetails entry={details.workout as TimedWorkout} />
							</DetailsSection>
						</>
					)}
					{activityType === "Other" && (
						<>
							<DetailsSection history={details.history} schedule={schedule}>
								<OtherDetails entry={details.workout as OtherWorkout} />
							</DetailsSection>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ViewWorkout;
