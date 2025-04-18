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
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "../../store/store";
import { getWorkoutDetails } from "../../features/workouts/operations";
import { selectCurrentUser } from "../../features/user/userSlice";
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
							<StrengthDetails entry={details.workout as StrengthWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
					{activityType === "Stretch" && (
						<>
							<StretchDetails entry={details.workout as StretchWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
					{activityType === "Walk" && (
						<>
							<WalkDetails entry={details.workout as WalkWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
					{activityType === "Cardio" && (
						<>
							<CardioDetails entry={details.workout as CardioWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
					{activityType === "Timed" && (
						<>
							<TimedDetails entry={details.workout as TimedWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
					{activityType === "Other" && (
						<>
							<OtherDetails entry={details.workout as OtherWorkout} />
							<ScheduleDetails schedule={schedule} />
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ViewWorkout;
