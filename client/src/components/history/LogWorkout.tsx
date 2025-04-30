import { useMemo, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import sprite2 from "../../assets/icons/main.svg";
import styles from "../../css/history/LogWorkout.module.scss";
import { CurrentUser } from "../../features/user/types";
import MultiStepModal, { StepItem } from "../shared/MultiStepModal";
import { Activity } from "../../features/shared/types";
import {
	LogWorkoutValues,
	prepareLogWorkout,
	WorkoutSet,
} from "../../utils/utils_workouts";
import { Workout } from "../../features/workouts/types";
import {
	ACTIVITIES,
	isExerciseType,
	isStrengthType,
	isWalkType,
} from "../../utils/utils_activity";
import Select from "../shared/Select";
import TimePicker from "../shared/TimePicker";
import { formatDate, formatTime } from "../../utils/utils_dates";
import DatePicker from "../shared/DatePicker";
import MinutesSelector from "../shared/MinutesSelector";
import EditStrengthSets from "../form/EditStrengthSets";
import EditWorkoutSets from "../form/EditWorkoutSets";
import EditWalkInfo from "../form/EditWalkInfo";
import { useLogWorkoutMutation } from "../../features/workouts/todaysWorkoutsApi";

type Props = {
	allWorkouts: Workout[];
	currentUser: CurrentUser;
	onClose: () => void;
	onConfirm?: () => void;
	onCancel?: () => void;
};

type StepProps = {
	values: LogWorkoutValues;
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | Date) => void;
};

const activityIcons = {
	All: "double-tick",
	Walk: "walking-2",
	Stretch: "stretching-2",
	Strength: "dumbbell-2",
	Timed: "time",
	Cardio: "heart-with-pulse",
	Other: "nothing-found",
};

const StepHeader = ({ title }: { title: string }) => {
	return (
		<div className={styles.StepHeader}>
			<h2 className={styles.StepHeader_title}>{title}</h2>
		</div>
	);
};

type SelectWorkoutStepProps = {
	workouts: Workout[];
	onSelectWorkout: (workoutID: number, activityType: Activity) => void;
} & StepProps;

type FilterType = Activity | "All";

type WorkoutOptionProps = {
	workout: Workout;
	isSelected: boolean;
	onSelect: () => void;
};
type ActivityItemProps = {
	activity: FilterType;
	onSelect: () => void;
	isSelected: boolean;
};

const ActivityItem = ({
	activity,
	onSelect,
	isSelected = false,
}: ActivityItemProps) => {
	const icon = activityIcons[activity];
	const css = {
		backgroundColor: isSelected
			? "rgba(0, 124, 255, 0.1)"
			: "var(--bg-foreground)",
		color: isSelected ? "var(--accent-blue)" : "var(--blueGrey300)",
		borderColor: isSelected ? "var(--accent-blue)" : "var(--border-color)",
	};
	const iconCss = {
		fill: isSelected ? "var(--accent-blue)" : "var(--text1_5)",
	};
	return (
		<div onClick={onSelect} className={styles.ActivityItem} style={css}>
			<svg className={styles.ActivityItem_icon} style={iconCss}>
				<use xlinkHref={`${sprite2}#icon-${icon}`}></use>
			</svg>
		</div>
	);
};

const effortOptions = ["None", "Easy", "Moderate", "Hard", "Strenuous"].map(
	(level) => ({
		value: level,
		label: level,
	})
);
const WorkoutOption = ({
	workout,
	isSelected,
	onSelect,
}: WorkoutOptionProps) => {
	const name = workout.workoutName || "Unknown Workout";
	const css = {
		color: isSelected ? "#fff" : "var(--text1)",
		borderColor: isSelected ? "var(--accent-blue)" : "var(--blueGrey800)",
		backgroundColor: isSelected ? "var(--blueBG)" : "transparent",
	};
	return (
		<li className={styles.WorkoutOption} onClick={onSelect} style={css}>
			<div className={styles.WorkoutOption_isSelected}>
				{isSelected && (
					<svg className={styles.WorkoutOption_isSelected_icon}>
						<use xlinkHref={`${sprite}#icon-check1`} />
					</svg>
				)}
			</div>
			<div className={styles.WorkoutOption_value}>{name}</div>
		</li>
	);
};

const isSetsType = (activityType: string) => {
	if (!activityType || activityType === "") return false;
	return (
		activityType === "Strength" ||
		activityType === "Stretch" ||
		activityType === "Timed" ||
		activityType === "Cardio" ||
		activityType === "Other"
	);
};

type MoreDetailsProps = {
	onSetChange: (sets: WorkoutSet[]) => void;
} & StepProps;

const MoreDetailsStep = ({
	values,
	onChange,
	onSetChange,
}: MoreDetailsProps) => {
	const isWalk = isWalkType(values.activityType);
	const isStrength = isStrengthType(values.activityType);
	const isExercise = isExerciseType(values.activityType);
	const showSetsUI = isSetsType(values.activityType as Activity);

	return (
		<div className={styles.MoreDetailsStep}>
			<StepHeader title="More Details" />
			<div className={styles.MainDetailsStep_effort}>
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

			{/* WALK UI */}
			{isWalk && (
				<div className={styles.MainDetailsStep_walk}>
					<EditWalkInfo
						miles={values.miles}
						duration={values.duration}
						onChange={onChange}
					/>
				</div>
			)}
			{/* SETS UI */}
			{showSetsUI && (
				<div className={styles.MainDetailsStep_sets}>
					<label htmlFor="sets">Sets:</label>
					{isStrength && (
						<EditStrengthSets
							sets={4}
							reps={10}
							weight={20}
							onChange={onSetChange}
						/>
					)}
					{isExercise && (
						<EditWorkoutSets
							sets={4}
							reps={10}
							exercise=""
							onChange={onSetChange}
						/>
					)}
				</div>
			)}
		</div>
	);
};

const MainDetailsStep = ({ values, onChange, onSelect }: StepProps) => {
	return (
		<div className={styles.MainDetailsStep}>
			<StepHeader title="When was this workout?" />

			<div className={styles.MainDetailsStep_time}>
				<div className={styles.MainDetailsStep_time_start}>
					<label htmlFor="startTime">Started:</label>
					<TimePicker
						value={values.startTime}
						name="startTime"
						id="startTime"
						onChange={onChange}
					/>
				</div>
				<div className={styles.MainDetailsStep_time_end}>
					<label htmlFor="endTime">Ended:</label>
					<TimePicker
						value={values.endTime}
						name="endTime"
						id="endTime"
						onChange={onChange}
					/>
				</div>
			</div>
			<div className={styles.MainDetailsStep_date}>
				<label htmlFor="workoutDate">Date:</label>
				<DatePicker
					value={values.workoutDate}
					name="workoutDate"
					id="workoutDate"
					onChange={onChange}
					onSelect={onSelect}
				/>
			</div>
			<div className={styles.MainDetailsStep_mins}>
				<label htmlFor="duration">Workout Mins:</label>
				<MinutesSelector
					name="duration"
					minutes={values.duration}
					onSelect={onChange}
				/>
			</div>
		</div>
	);
};

const SelectWorkoutStep = ({
	values,
	onSelectWorkout,
	workouts,
}: SelectWorkoutStepProps) => {
	const baseFilters: FilterType[] = ["All", ...ACTIVITIES];
	const [filter, setFilter] = useState<FilterType>("All");
	const filteredWorkouts = useMemo(() => {
		if (filter === "All") {
			return workouts;
		}
		return workouts.filter((workout) => workout.activityType === filter);
	}, [workouts, filter]);

	const isWorkoutSelected = (workout: Workout) => {
		const { workoutID, activityType } = values;
		return (
			workout.workoutID === workoutID && workout.activityType === activityType
		);
	};

	const selectFilter = (newFilter: FilterType) => {
		if (newFilter === filter) {
			setFilter("All"); // Toggle off if the same filter is clicked
		} else {
			setFilter(newFilter);
		}
	};

	return (
		<div className={styles.SelectWorkoutStep}>
			<StepHeader title="Select Workout" />
			<div className={styles.SelectWorkoutStep_filters}>
				{baseFilters.map((item, idx) => (
					<div key={idx} className={styles.SelectWorkoutStep_filters_item}>
						<ActivityItem
							key={item + idx}
							activity={item}
							isSelected={item === filter}
							onSelect={() => selectFilter(item)}
						/>
						<span>{item}</span>
					</div>
				))}
			</div>
			<ul className={styles.SelectWorkoutStep_options}>
				{filteredWorkouts.map((workout: Workout, idx: number) => (
					<WorkoutOption
						key={workout.workoutID + "-" + idx}
						workout={workout}
						isSelected={isWorkoutSelected(workout)}
						onSelect={() =>
							onSelectWorkout(workout.workoutID, workout.activityType)
						}
					/>
				))}
			</ul>
		</div>
	);
};

const ConfirmLogStep = ({ values }: StepProps) => {
	const type = values.activityType;
	return (
		<div className={styles.ConfirmLogStep}>
			<StepHeader title="Confirm Workout Details" />
			<div className={styles.ConfirmLogStep_main}>
				<div className={styles.ConfirmLogStep_main_main}>Activity: {type}</div>
			</div>
		</div>
	);
};

const LogWorkout = ({ currentUser, onClose, allWorkouts }: Props) => {
	const [values, setValues] = useState<LogWorkoutValues>({
		workoutID: 0,
		activityType: "", // Default to Strength, can be changed later
		workoutDate: formatDate(new Date().toString(), "long"),
		startTime: formatTime(new Date().toString(), "short"),
		endTime: formatTime(new Date().toString(), "short"),
		duration: 0,
		effort: "None",
		steps: 0,
		miles: 0,
		pace: 0,
		exercise: "",
		sets: [],
	});
	const [logWorkout] = useLogWorkoutMutation();

	const onSelectWorkout = (workoutID: number, activityType: Activity) => {
		setValues({
			...values,
			workoutID,
			activityType,
		});
	};

	const onChange = (name: string, value: string | number) => {
		setValues({ ...values, [name]: value });
	};
	const onSelect = (name: string, value: string | Date) => {
		setValues({ ...values, [name]: value });
	};
	const onSetChange = (sets: WorkoutSet[]) => {
		setValues({ ...values, sets });
	};

	const saveWorkoutLog = async () => {
		const { userID } = currentUser;
		const newLog = prepareLogWorkout(userID, values);

		await logWorkout({ userID, newLog });

		return onClose && onClose();
	};

	const steps: StepItem[] = [
		{
			id: 1,
			title: "Select Workout",
			content: (
				<SelectWorkoutStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					workouts={allWorkouts}
					onSelectWorkout={onSelectWorkout}
				/>
			),
			next: 2,
			validate: () => true,
		},
		{
			id: 2,
			title: "What was this workout?",
			content: (
				<MainDetailsStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
				/>
			),
			prev: 1,
			next: 3,
			validate: () => true,
		},
		{
			id: 3,
			title: "More Details",
			content: (
				<MoreDetailsStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onSetChange={onSetChange}
				/>
			),
			prev: 2,
			next: 4,
			validate: () => true,
		},
		{
			id: 4,
			title: "Confirm Workout",
			content: (
				<ConfirmLogStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
				/>
			),
			prev: 3,
			validate: () => true,
		},
	];

	return (
		<>
			<MultiStepModal steps={steps} onClose={onClose} onSave={saveWorkoutLog} />
		</>
	);
};

export default LogWorkout;
