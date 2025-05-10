import { useState } from "react";
import styles from "../../css/workouts/MarkAsDone.module.scss";
import { MarkAsDoneValues } from "../../features/workouts/todaysWorkoutsApi";
import { TodaysWorkout } from "../../features/workouts/types";
import { formatDate, formatTime, parseAnyTime } from "../../utils/utils_dates";
import { WorkoutSet } from "../../utils/utils_workouts";
import { subMinutes } from "date-fns";
import { Activity } from "../../features/shared/types";
import { milesToPace, milesToSteps } from "../../utils/utils_steps";
import DatePicker from "../shared/DatePicker";
import MinutesSelector from "../shared/MinutesSelector";
import Select from "../shared/Select";
import EditStrengthSets from "../form/EditStrengthSets";
import TimePicker from "../shared/TimePicker";
import EditWalkInfo from "../form/EditWalkInfo";
import EditWorkoutSets from "../form/EditWorkoutSets";

type Props = {
	workout: TodaysWorkout;
	onClose: () => void;
	onConfirm: (values: MarkAsDoneValues) => void;
};

// REQUIREMENTS:
// - Start Time
// - Duration
// - Sets (cardio, strength)

const calculateStartTime = (endTime: string, duration: number): string => {
	const baseEnd = parseAnyTime(endTime) as Date;
	const start = subMinutes(baseEnd, duration);
	return formatTime(start, "short");
};

// We assume the workout has just ended, so we subtract the duration to get the start time
const getInitialState = (workout: TodaysWorkout): MarkAsDoneValues => {
	const newEnd = formatTime(new Date().toString(), "short");
	const newStart = calculateStartTime(newEnd, workout.duration);

	return {
		startTime: newStart,
		endTime: newEnd,
		workoutDate: formatDate(new Date().toString(), "long"),
		duration: workout.duration,
		effort: "None",
		steps: 0,
		miles: 0,
		pace: 0,
		exercise: "",
		sets: [],
	};
};

const effortOptions = ["None", "Easy", "Moderate", "Hard", "Strenuous"].map(
	(level) => ({
		value: level,
		label: level,
	})
);

const showStrengthSetsUI = (type: Activity): boolean => {
	return type === "Strength";
};
const showExerciseSetsUI = (type: Activity): boolean => {
	return ["Cardio", "Timed", "Stretch", "Other"].includes(type);
};

const enableSets = true;

type ActivityDetailsProps = {
	activityType: Activity;
	values: MarkAsDoneValues;
	onSetChange: (sets: WorkoutSet[]) => void;
	onWalkChange: (walkVals: {
		steps: number;
		miles: number;
		pace: number;
	}) => void;
};

const ActivityDetails = ({
	activityType,
	values,
	onSetChange,
	onWalkChange,
}: ActivityDetailsProps) => {
	const isStrength = showStrengthSetsUI(activityType);
	const isExercise = showExerciseSetsUI(activityType);

	console.log("isStrength", isStrength);
	console.log("isExercise", isExercise);
	console.log("activityType", activityType);

	const handleWalkChange = (name: string, value: string | number) => {
		const newValues = { ...values, [name]: value };
		const steps = milesToSteps(Number(value)) || 0;
		const pace = milesToPace(Number(values.miles), Number(values.duration));

		return (
			onWalkChange &&
			onWalkChange({
				...newValues,
				steps,
				pace,
			})
		);
	};

	return (
		<div className={styles.ActivityDetails}>
			{activityType === "Walk" && (
				<div className={styles.ActivityDetails_walk}>
					<EditWalkInfo
						miles={values.miles}
						duration={values.duration}
						onChange={handleWalkChange}
					/>
				</div>
			)}
			{enableSets && (
				<>
					{/* WORKOUT SETS (CARDIO, STRETCH, TIMED, & OTHER) */}
					{showExerciseSetsUI(activityType) && (
						<div className={styles.MarkAsDone_details_sets}>
							<EditWorkoutSets
								sets={4}
								reps={10} // Placeholder, can be adjusted
								onChange={onSetChange}
								exercise={values.exercise ?? ""}
							/>
						</div>
					)}
					{/* STRENGTH SETS */}
					{showStrengthSetsUI(activityType) && (
						<div className={styles.MarkAsDone_details_sets}>
							<label
								htmlFor="sets"
								style={{
									display: "flex",
									justifyContent: "center",
									margin: "2rem 0 1rem 0",
								}}
							>
								Workout Sets:
							</label>
							<EditStrengthSets
								sets={4}
								reps={20} // Placeholder, can be adjusted
								weight={20} // Placeholder, can be adjusted
								onChange={onSetChange}
							/>
						</div>
					)}
				</>
			)}
			{/*  */}
		</div>
	);
};

const MarkAsDone = ({ workout, onConfirm, onClose }: Props) => {
	const [values, setValues] = useState<MarkAsDoneValues>({
		...getInitialState(workout),
	});
	const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);

	const toggleMoreDetails = () => setShowMoreDetails(!showMoreDetails);

	const onChange = (name: string, value: string | number) => {
		const newValues = { ...values, [name]: value };
		setValues(newValues);
	};

	const onSelect = (name: string, value: string | Date) => {
		const newValues = { ...values, [name]: value };
		setValues(newValues);
	};

	const onSetChange = (sets: WorkoutSet[]) => {
		const newValues = { ...values, sets };
		setValues(newValues);
	};

	const onWalkChange = (walkVals: {
		steps: number;
		miles: number;
		pace: number;
	}) => {
		const newValues = {
			...values,
			...walkVals,
		};
		setValues(newValues);
	};

	const handleConfirm = () => {
		onConfirm(values);
	};

	return (
		<div className={styles.MarkAsDone}>
			<div className={styles.MarkAsDone_header}>
				<h2>Mark as Done</h2>
			</div>

			<div className={styles.MarkAsDone_details}>
				<div className={styles.MarkAsDone_details_effort}>
					<label htmlFor="effort">Effort:</label>
					<Select
						id="effort"
						name="effort"
						value={values.effort}
						onChange={onChange}
						options={effortOptions}
						style={{ width: "100%" }}
					/>
				</div>
				<div className={styles.MarkAsDone_details_time}>
					<div className={styles.MarkAsDone_details_time_start}>
						<label htmlFor="startTime">Started:</label>
						<TimePicker
							value={values.startTime}
							name="startTime"
							id="startTime"
							onChange={onChange}
						/>
					</div>
					<div className={styles.MarkAsDone_details_time_end}>
						<label htmlFor="endTime">Ended:</label>
						<TimePicker
							value={values.endTime}
							name="endTime"
							id="endTime"
							onChange={onChange}
						/>
					</div>
				</div>
			</div>
			<div className={styles.MarkAsDone_toggle} onClick={toggleMoreDetails}>
				{showMoreDetails ? "Hide" : "Show"} more details
			</div>
			{showMoreDetails && (
				<div className={styles.MarkAsDone_details}>
					<div className={styles.MarkAsDone_details_mins}>
						<label htmlFor="workoutDate">When:</label>
						<DatePicker
							value={values.workoutDate}
							name="workoutDate"
							id="workoutDate"
							onChange={onChange}
							onSelect={onSelect}
						/>
					</div>

					<div className={styles.MarkAsDone_mins}>
						<label
							htmlFor="duration"
							style={{ display: "block", marginBottom: ".5rem" }}
						>
							Workout Length:
						</label>
						<MinutesSelector
							name="duration"
							onSelect={onChange}
							minutes={values.duration}
						/>
					</div>
					<ActivityDetails
						values={values}
						onSetChange={onSetChange}
						onWalkChange={onWalkChange}
						activityType={workout.activityType}
					/>
				</div>
			)}
			<div className={styles.MarkAsDone_actions}>
				<button className={styles.MarkAsDone_actions_cancel} onClick={onClose}>
					Cancel
				</button>
				<button
					className={styles.MarkAsDone_actions_save}
					onClick={handleConfirm}
				>
					Confirm
				</button>
			</div>
		</div>
	);
};

export default MarkAsDone;
