import styles from "../../css/active-workout/ActiveWorkout.module.scss";
import { useState } from "react";
import { CurrentUser } from "../../features/user/types";
import { TodaysWorkout } from "../../features/workouts/types";
import { TimeInfo, TimerStatus } from "../../hooks/usePersistentTimer";
import { useSkipWorkoutMutation } from "../../features/workouts/todaysWorkoutsApi";
import { formattedTime } from "../../utils/utils_formatter";
import {
	EndedWorkoutValues,
	prepareEndedWorkout,
	SkipWorkoutBody,
	WorkoutSet,
} from "../../utils/utils_workouts";
import { formatDate } from "../../utils/utils_dates";
import EndedWorkout from "./EndedWorkout";
import WorkoutTimer from "./WorkoutTimer";
import AddWorkoutDetails from "./AddWorkoutDetails";
import SkipWorkout from "../workouts/SkipWorkout";
import ModalSM from "../shared/ModalSM";

type Props = {
	currentUser: CurrentUser;
	workout: TodaysWorkout;
};

const secsToMins = (secs: number) => {
	return Math.floor(secs / 60);
};

// Calculates the seconds difference between timestamps
const calculateLengthInSecs = (info: TimeInfo) => {
	const { startedAt, endedAt, pausedAt, resumedAt } = info;
	const end = endedAt as number;
	const total = end - startedAt;
	// Was paused subtract from total time
	if (pausedAt && resumedAt) {
		const timeToRemove = resumedAt - pausedAt;
		const newTotal = total - timeToRemove;
		return newTotal / 1000;
	}

	return total / 1000;
};

const calculateLengthInFormat = (info: TimeInfo) => {
	const length = calculateLengthInSecs(info);
	const formatted = formattedTime(length);

	return {
		totalSecs: length, // total time in seconds
		totalLength: formatted, // total time as '12:47' (eg 12m47s)
	};
};

interface TotalInfo {
	startedAt: number;
	startTime: string;
	status: TimerStatus;
	intervalInSecs: number;
	endedAt: number;
	endTime: string;
	pausedAt: number | null;
	pauseTime: string | null;
	resumedAt: number | null;
	resumeTime: string | null;
	totalSecs: number;
	totalLength: string;
}

type EndWorkoutVals = Omit<EndedWorkoutValues, "sets" | "exercise">;

const ActiveWorkout = ({ workout, currentUser }: Props) => {
	const [skipWorkout] = useSkipWorkoutMutation();
	const [hasEnded, setHasEnded] = useState<boolean>(false);
	const [workoutInfo, setWorkoutInfo] = useState<TotalInfo | null>(null);
	const [showAddDetails, setShowAddDetails] = useState<boolean>(false);
	const [showSkipModal, setShowSkipModal] = useState<boolean>(false);
	// Details values
	const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
	const [workoutValues, setWorkoutValues] = useState<EndWorkoutVals>({
		workoutID: workout.workoutID,
		activityType: workout.activityType,
		workoutDate: formatDate(new Date(), "long"),
		startTime: "",
		endTime: "",
		duration: workout.duration,
		effort: "None",
		steps: 0,
		miles: 0,
		pace: 0,
	});

	const openDetails = () => {
		setShowAddDetails(true);
	};
	const closeDetails = () => {
		setShowAddDetails(false);
	};
	const openSkip = () => {
		setShowSkipModal(true);
	};
	const closeSkip = () => {
		setShowSkipModal(false);
	};

	const onChange = (name: string, value: string | number) => {
		setWorkoutValues({
			...workoutValues,
			[name]: value,
		});
	};
	const onSelect = (name: string, value: string | Date) => {
		setWorkoutValues({
			...workoutValues,
			[name]: value,
		});
	};
	const onSetChange = (sets: WorkoutSet[]) => {
		setWorkoutSets(sets);
	};

	const onEnd = (info: TimeInfo) => {
		const totals = calculateLengthInFormat(info);
		const newInfo = {
			...info,
			...totals,
		};

		setHasEnded(true);
		setWorkoutInfo(newInfo as TotalInfo);
		setWorkoutValues({
			...workoutValues,
			duration: secsToMins(totals.totalSecs),
		});
	};

	// Just opens the skip confirmation dialog
	const onSkip = () => {
		openSkip();
	};

	const markWorkoutAsSkipped = async () => {
		const { userID, workoutID, activityType } = workout;
		const date = formatDate(new Date(), "db");
		const body: SkipWorkoutBody = {
			userID: userID,
			workoutID: workoutID,
			workoutDate: date,
			activityType: activityType,
			reason: "Skipped for today only.",
		};

		await skipWorkout(body).unwrap();
		closeSkip();
	};

	const markWorkoutAsEnded = async () => {
		const base = new Date();
		const { userID } = currentUser;

		if (workoutInfo) {
			// const mins = secondsToMinutes(workoutInfo.intervalInSecs);
			// const preparedWorkout = prepareEndedWorkout(userID, null);
		}
	};

	return (
		<div className={styles.ActiveWorkout}>
			{!hasEnded && (
				<WorkoutTimer
					duration={workout.duration}
					onEnd={onEnd}
					onSkip={onSkip}
				/>
			)}
			{hasEnded && (
				<EndedWorkout
					info={workoutInfo as TotalInfo}
					onAddDetails={openDetails}
				/>
			)}

			{showAddDetails && !!workoutInfo && (
				<AddWorkoutDetails
					workout={workout}
					sets={workoutSets}
					values={workoutValues}
					onChange={onChange}
					onSelect={onSelect}
					onSetChange={onSetChange}
					onClose={closeDetails}
					onSave={markWorkoutAsEnded}
				/>
			)}

			{showSkipModal && (
				<ModalSM onClose={closeSkip}>
					<SkipWorkout onCancel={closeSkip} onConfirm={markWorkoutAsSkipped} />
				</ModalSM>
			)}
		</div>
	);
};

export default ActiveWorkout;
