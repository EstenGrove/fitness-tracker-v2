import styles from "../../css/workouts/EditWorkout.module.scss";
import { useState } from "react";
import { addDays, addMinutes } from "date-fns";
import { WorkoutSet } from "../../utils/utils_workouts";
import { RepeatType } from "../../features/shared/types";
import { RecurringValues } from "../../utils/utils_recurring";
import { TodaysWorkout } from "../../features/workouts/types";
import { formatDate, formatTime } from "../../utils/utils_dates";
import WeeklyRecurrenceOptions from "../form/WeeklyRecurrenceOptions";
import CustomCheckbox from "../shared/CustomCheckbox";
import DatePicker from "../shared/DatePicker";
import TimePicker from "../shared/TimePicker";
import TextInput from "../shared/TextInput";
import TextArea from "../shared/TextArea";
import NumberInput from "../shared/NumberInput";

type Props = {
	workout: TodaysWorkout;
	onClose: () => void;
};

// EDIT WORKOUT TABS/SECTIONS:
// - Edit Goals (eg, target sets/reps, target steps, target reps etc)
// - Edit Schedule (eg. make recurring, change recurrence schedule, discontinue etc.)
// - Edit Info (eg. duration, workout name, description etc.)

const EditTabs = ({
	onSelect,
	selectedTab,
}: {
	onSelect: (tab: EActiveSection) => void;
	selectedTab: EActiveSection;
}) => {
	return (
		<div className={styles.EditTabs}>
			<button
				onClick={() => onSelect(EActiveSection.INFO)}
				className={styles.EditTabs_tab}
				data-selected={Boolean(selectedTab === EActiveSection.INFO)}
			>
				Info
			</button>
			<button
				onClick={() => onSelect(EActiveSection.GOALS)}
				className={styles.EditTabs_tab}
				data-selected={selectedTab === EActiveSection.GOALS}
			>
				Goals
			</button>
			<button
				onClick={() => onSelect(EActiveSection.SCHEDULE)}
				className={styles.EditTabs_tab}
				data-selected={selectedTab === EActiveSection.SCHEDULE}
			>
				Schedule
			</button>
		</div>
	);
};

enum EActiveSection {
	GOALS = "GOALS",
	SCHEDULE = "SCHEDULE",
	INFO = "INFO",
}

type EditInfoProps = {
	values: EditWorkoutValues;
	onChange: (name: string, value: string | number) => void;
};

interface EditWorkoutValues {
	// INFO
	name: string;
	desc: string;
	duration: number;
	// GOALS
	sets: WorkoutSet[];
	steps: number;
	miles: number;
	pace: number;
	// SCHEDULE
	isRecurring: boolean;
	frequency: RepeatType | string;
	interval: 1;
	byDay: string[];
	byMonth: string | number;
	byMonthDay: string | number;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
}

const EditWorkoutInfo = ({ values, onChange }: EditInfoProps) => {
	return (
		<div className={styles.EditWorkoutInfo}>
			<div className={styles.EditWorkoutInfo_main}>
				<div className={styles.EditWorkoutInfo_main_row}>
					<TextInput
						name="name"
						id="name"
						value={values.name}
						onChange={onChange}
					/>
				</div>
				<div className={styles.EditWorkoutInfo_main_row}>
					<label htmlFor="desc">Add a description (optional)</label>
					<TextArea
						name="desc"
						id="desc"
						value={values.desc}
						onChange={onChange}
					/>
				</div>
				<div className={styles.EditWorkoutInfo_main_row}>
					<label htmlFor="duration">Workout Length (mins)</label>
					<NumberInput
						name="duration"
						id="duration"
						value={values.duration}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

type EditScheduleProps = {
	values: EditWorkoutValues;
	onChange: (name: string, value: string | number) => void;
	onChecked: (name: string, value: boolean) => void;
	onSelect: (name: string, value: string | number | Date) => void;
};

const EditWorkoutSchedule = ({
	values,
	onChange,
	onSelect,
	onChecked,
}: EditScheduleProps) => {
	return (
		<div className={styles.EditWorkoutSchedule}>
			<div className={styles.EditWorkoutSchedule_main}>
				<div className={styles.EditWorkoutSchedule_main_time}>
					<label htmlFor="startTime">Starts at</label>
					<label htmlFor="endTime">Ends at</label>
					<TimePicker
						name="startTime"
						id="startTime"
						value={values.startTime}
						onChange={onChange}
					/>
					<TimePicker
						name="endTime"
						id="endTime"
						value={values.endTime}
						onChange={onChange}
					/>
				</div>

				<div className={styles.EditWorkoutSchedule_main_repeat}>
					<CustomCheckbox
						name="isRecurring"
						id="isRecurring"
						label="Repeat this workout"
						value={values.isRecurring}
						onChange={onChecked}
					/>
				</div>
				{values.isRecurring && (
					<div className={styles.EditWorkoutSchedule_main_options}>
						<WeeklyRecurrenceOptions
							values={values as unknown as RecurringValues}
							onSelect={onSelect}
						/>

						<div className={styles.EditWorkoutSchedule_main_options_end}>
							<span>When should this end?</span>
							<DatePicker
								name="endDate"
								id="endDate"
								value={values.endDate as string}
								onSelect={onSelect}
								onChange={onChange}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

type EditGoalsProps = {
	values: EditWorkoutValues;
	onChange: (name: string, value: string | number) => void;
	onChecked: (name: string, value: boolean) => void;
	onSelect: (name: string, value: string | number | Date) => void;
};

const EditWorkoutGoals = ({
	values,
	onChange,
	onSelect,
	onChecked,
}: EditGoalsProps) => {
	return (
		<div className={styles.EditWorkoutGoals}>
			{/*  */}
			{/*  */}
		</div>
	);
};

type FooterProps = {
	onCancel: () => void;
	onSave: () => void;
};

const Footer = ({ onCancel, onSave }: FooterProps) => {
	return (
		<section className={styles.Footer}>
			<button
				type="button"
				onClick={onCancel}
				className={styles.Footer_cancelBtn}
			>
				Cancel
			</button>
			<button type="button" onClick={onSave} className={styles.Footer_btn}>
				Save All
			</button>
		</section>
	);
};

const EditWorkout = ({ workout, onClose }: Props) => {
	const [activeTab, setActiveTab] = useState<EActiveSection>(
		EActiveSection.INFO
	);
	const [values, setValues] = useState<EditWorkoutValues>({
		name: workout?.workoutName,
		desc: "",
		duration: 30,
		isRecurring: false,
		interval: 1,
		frequency: "Daily",
		byDay: [],
		byMonth: "",
		byMonthDay: "",
		startDate: formatDate(new Date(), "db"),
		endDate: formatDate(addDays(new Date(), 60), "db"),
		startTime: formatTime(new Date(), "short"),
		endTime: formatTime(addMinutes(new Date(), 30), "short"),
		steps: 0,
		miles: 0,
		pace: 0,
		sets: [],
	});

	const onTabChange = (tab: EActiveSection) => {
		setActiveTab(tab);
	};

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	const onChecked = (name: string, value: boolean) => {
		setValues({
			...values,
			[name]: value,
		});
	};
	const onSelect = (name: string, value: string | number | Date) => {
		if (name === "byDay") {
			const { byDay } = values;
			const newList = (
				byDay.includes(value as string)
					? [...byDay.filter((d) => d !== value)]
					: [...byDay, value]
			) as string[];
			setValues({ ...values, byDay: newList });
		} else {
			setValues({ ...values, [name]: value });
		}
	};

	const saveChanges = async () => {
		// do stuff

		return onClose && onClose();
	};

	const cancelChanges = () => {
		return onClose && onClose();
	};

	return (
		<div className={styles.EditWorkout}>
			<div className={styles.EditWorkout_header}>
				<h2>Edit Workout</h2>
			</div>
			<div className={styles.EditWorkout_tabs}>
				<EditTabs onSelect={onTabChange} selectedTab={activeTab} />
			</div>
			<div className={styles.EditWorkout_content}>
				{activeTab === EActiveSection.INFO && (
					<EditWorkoutInfo values={values} onChange={onChange} />
				)}
				{activeTab === EActiveSection.GOALS && (
					<EditWorkoutGoals
						values={values}
						onChange={onChange}
						onSelect={onSelect}
						onChecked={onChecked}
					/>
				)}
				{activeTab === EActiveSection.SCHEDULE && (
					<EditWorkoutSchedule
						values={values}
						onChange={onChange}
						onSelect={onSelect}
						onChecked={onChecked}
					/>
				)}
			</div>

			<Footer onSave={saveChanges} onCancel={cancelChanges} />
		</div>
	);
};

export default EditWorkout;
