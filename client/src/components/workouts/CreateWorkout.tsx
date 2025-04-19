import { useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/workouts/CreateWorkout.module.scss";
import { Activity, RepeatType } from "../../features/shared/types";
import { ACTIVITIES as defaultTypes } from "../../utils/utils_activity";
import { RecurringValues } from "../../utils/utils_recurring";
import RecurringOptions from "../form/RecurringOptions";
import CustomCheckbox from "../shared/CustomCheckbox";
import DatePicker from "../shared/DatePicker";
import MinutesSelector from "../shared/MinutesSelector";
import MultiStepModal, { StepItem } from "../shared/MultiStepModal";
import TextArea from "../shared/TextArea";
import TextInput from "../shared/TextInput";
import EditStrengthSets from "../form/EditStrengthSets";
import { formatDate } from "../../utils/utils_dates";
import { ExerciseSet, StrengthSet } from "../../features/workouts/types";
import EditWorkoutSets from "../form/EditWorkoutSets";

type Props = {
	onClose: () => void;
};

export interface CreateWorkoutValues {
	activityType: Activity | string;
	date: Date | string;
	name: string;
	desc: string;
	duration: number;
	effort: number;
	isRecurring: boolean;
	interval: number;
	frequency: RepeatType;
	byDay: string[];
	byMonth: number | string;
	byMonthDay: number | string;
	startDate: Date | string;
	endDate: Date | string;
}

type StepProps = {
	values: CreateWorkoutValues;
	onChecked: (name: string, value: boolean) => void;
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | Date) => void;
	onSetChange: (sets: StrengthSet[] | ExerciseSet[]) => void;
};

const StepHeader = ({ title }: { title: string }) => {
	return (
		<div className={styles.StepHeader}>
			<h2 className={styles.StepHeader_title}>{title}</h2>
		</div>
	);
};

type WorkoutTypeProps = {
	activity: Activity;
	onSelect: () => void;
	isSelected: boolean;
};

const activityIcons = {
	Walk: "walking-2",
	Stretch: "stretching-2",
	Strength: "dumbbell-2",
	Timed: "time",
	Cardio: "heart-with-pulse",
	Other: "nothing-found",
};

const WorkoutType = ({
	activity,
	onSelect,
	isSelected = false,
}: WorkoutTypeProps) => {
	const icon = activityIcons[activity];
	const css = {
		backgroundColor: isSelected
			? "rgba(0, 124, 255, 0.1)"
			: "var(--bg-foreground)",
		color: isSelected ? "var(--accent-blue)" : "var(--blueGrey300)",
		borderColor: isSelected ? "var(--accent-blue)" : "var(--blueGrey800)",
	};
	const iconCss = {
		fill: isSelected ? "var(--accent-blue)" : "var(--text1_5)",
	};
	return (
		<div onClick={onSelect} className={styles.WorkoutType} style={css}>
			<svg className={styles.WorkoutType_icon} style={iconCss}>
				<use xlinkHref={`${sprite}#icon-${icon}`}></use>
			</svg>
		</div>
	);
};

type WorkoutTypesProps = {
	name?: string;
	selectedType: Activity;
	workoutTypes?: Activity[];
	onSelect: (name: string, value: Activity | string) => void;
};

const WorkoutTypes = ({
	name = "workoutType",
	workoutTypes = defaultTypes,
	selectedType,
	onSelect,
}: WorkoutTypesProps) => {
	return (
		<div className={styles.WorkoutTypes}>
			{workoutTypes &&
				workoutTypes.map((type: Activity, idx: number) => (
					<div key={idx} className={styles.WorkoutTypes_item}>
						<WorkoutType
							key={type + idx}
							activity={type}
							isSelected={selectedType === type}
							onSelect={() => onSelect(name, type)}
						/>
						<span>{type}</span>
					</div>
				))}
			{/*  */}
		</div>
	);
};

const ActivityStep = ({ values, onSelect }: StepProps) => {
	return (
		<div className={styles.ActivityStep}>
			<StepHeader title="What kind of exercise?" />
			<div className={styles.ActivityStep_main}>
				<WorkoutTypes
					name="activityType"
					selectedType={values.activityType as Activity}
					onSelect={onSelect}
				/>
			</div>
		</div>
	);
};

const WorkoutNameStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.WorkoutNameStep}>
			<StepHeader title="What's this workout called?" />
			<div className={styles.WorkoutNameStep_main}>
				<div className={styles.WorkoutNameStep_main_row}>
					<TextInput
						name="name"
						id="name"
						value={values.name}
						onChange={onChange}
					/>
				</div>
				<div className={styles.WorkoutNameStep_main_row}>
					<label htmlFor="desc">Add a description (optional)</label>
					<TextArea
						name="desc"
						id="desc"
						value={values.desc}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

const DurationStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.DurationStep}>
			<StepHeader title="How long is this workout?" />
			<div className={styles.DurationStep_main}>
				<MinutesSelector
					name="duration"
					minutes={values.duration}
					onSelect={onChange}
				/>
			</div>
		</div>
	);
};

const ScheduleStep = ({ values, onChange, onChecked, onSelect }: StepProps) => {
	return (
		<div className={styles.ScheduleStep}>
			<StepHeader title="When should this workout occur?" />
			<div className={styles.ScheduleStep_main}>
				<div className={styles.ScheduleStep_main_date}>
					<DatePicker
						name="date"
						id="date"
						value={values.date}
						onSelect={onSelect}
					/>
				</div>
				<div className={styles.ScheduleStep_main_repeat}>
					<CustomCheckbox
						name="isRecurring"
						id="isRecurring"
						label="Repeat this workout"
						value={values.isRecurring}
						onChange={onChecked}
					/>
				</div>
				{values.isRecurring && (
					<div className={styles.ScheduleStep_main_options}>
						<RecurringOptions
							values={values as unknown as RecurringValues}
							onChange={onChange}
							onSelect={onSelect as () => void}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

const SummaryStep = ({ values, onChange, onSetChange }: StepProps) => {
	return (
		<div className={styles.SummaryStep}>
			<StepHeader title="Workout Summary" />
			<div className={styles.SummaryStep_body}>
				<p>Review your workout details before saving.</p>
				{/* Add summary details here */}
			</div>
		</div>
	);
};

const DetailsStep = ({ values, onChange, onSetChange }: StepProps) => {
	const type = values.activityType as Activity;
	const isStrength = type === "Strength";
	const isExercise = ["Timed", "Cardio", "Other"].includes(type);

	return (
		<div className={styles.DetailsStep}>
			<StepHeader title="Add Workout Details (optional)" />
			<div className={styles.DetailsStep_body}>
				{isStrength && (
					<EditStrengthSets
						sets={4}
						reps={20}
						weight={20}
						onChange={onSetChange}
					/>
				)}
				{isExercise && (
					<EditWorkoutSets
						sets={4}
						reps={10}
						exercise={""}
						onChange={onSetChange}
					/>
				)}
			</div>
		</div>
	);
};

const CreateWorkout = ({ onClose }: Props) => {
	const [values, setValues] = useState<CreateWorkoutValues>({
		activityType: "Strength",
		date: formatDate(new Date(), "db"),
		name: "",
		desc: "",
		duration: 30,
		effort: 0,
		isRecurring: false,
		interval: 1,
		frequency: "Daily",
		byDay: [],
		byMonth: "",
		byMonthDay: "",
		startDate: formatDate(new Date(), "db"),
		endDate: formatDate(new Date(), "db"),
	});
	const [workoutSets, setWorkoutSets] = useState<StrengthSet[] | ExerciseSet[]>(
		[]
	);

	const onChecked = (name: string, value: boolean) => {
		setValues({ ...values, [name]: value });
	};
	const onChange = (name: string, value: string | number) => {
		setValues({ ...values, [name]: value });
	};
	const onSelect = (name: string, value: string | Date) => {
		setValues({ ...values, [name]: value });
	};
	const onSetChange = (sets: StrengthSet[] | ExerciseSet[]) => {
		setWorkoutSets(sets);
	};

	const steps: StepItem[] = [
		{
			id: 1,
			title: "Details Step",
			content: (
				<DetailsStep
					values={values}
					onSelect={onSelect}
					onChange={onChange}
					onChecked={onChecked}
					onSetChange={onSetChange}
				/>
			),
			next: 2,
			validate: () => true,
		},
		// {
		// 	id: 1,
		// 	title: "Activity Type",
		// 	content: (
		// 		<ActivityStep
		// 			values={values}
		// 			onSelect={onSelect}
		// 			onChange={onChange}
		// 			onChecked={onChecked}
		// 			onSetChange={onSetChange}
		// 		/>
		// 	),
		// 	next: 2,
		// 	validate: () => true,
		// },
		{
			id: 2,
			title: "Workout Name",
			content: (
				<WorkoutNameStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onChecked={onChecked}
					onSetChange={onSetChange}
				/>
			),
			prev: 1,
			next: 3,
			validate: () => true,
		},
		{
			id: 3,
			title: "Workout Duration",
			content: (
				<DurationStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onChecked={onChecked}
					onSetChange={onSetChange}
				/>
			),
			prev: 2,
			next: 4,
			validate: () => true,
		},
		{
			id: 4,
			title: "Add a schedule",
			content: (
				<ScheduleStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onChecked={onChecked}
					onSetChange={onSetChange}
				/>
			),
			prev: 3,
			next: 5,
			validate: () => true,
		},
		{
			id: 5,
			title: "Workout Summary",
			content: (
				<SummaryStep
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onChecked={onChecked}
					onSetChange={onSetChange}
				/>
			),
			prev: 3,
			next: 5,
			validate: () => true,
		},
	];

	return (
		<>
			<MultiStepModal steps={steps} onClose={onClose} />
		</>
	);
};

export default CreateWorkout;
