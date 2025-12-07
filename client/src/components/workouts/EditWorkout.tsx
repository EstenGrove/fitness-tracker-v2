import styles from "../../css/workouts/EditWorkout.module.scss";
import { useMemo, useRef, useState } from "react";
import { addDays, isBefore } from "date-fns";
import { EditWorkoutValues, WorkoutSet } from "../../utils/utils_workouts";
import { RecurringValues } from "../../utils/utils_recurring";
import {
	ActiveWorkout,
	RecurringWorkoutData,
	TodaysWorkout,
	WorkoutSchedule,
} from "../../features/workouts/types";
import {
	formatDate,
	formatTime,
	parseAnyDate,
	parseAnyTime,
} from "../../utils/utils_dates";
import WeeklyRecurrenceOptions from "../form/WeeklyRecurrenceOptions";
import EditWorkoutGoals from "../form/EditWorkoutGoals";
import CustomCheckbox from "../shared/CustomCheckbox";
import NumberInput from "../shared/NumberInput";
import DatePicker from "../shared/DatePicker";
import TimePicker from "../shared/TimePicker";
import TextInput from "../shared/TextInput";
import TextArea from "../shared/TextArea";
import { useGetRecurringWorkoutData } from "../../hooks/useGetRecurringWorkoutData";
import Loader from "../layout/Loader";

type Props = {
	workout: TodaysWorkout;
	onClose: () => void;
};

interface EditedData {
	values: EditWorkoutValues;
	sets: WorkoutSet[];
}

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
								isInvalid={(date) => {
									if (!date) return true;
									return isBefore(date, new Date());
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
type FooterProps = {
	onCancel: () => void;
	onSave: () => void;
	isDisabled: boolean;
};

const Footer = ({ onCancel, onSave, isDisabled = false }: FooterProps) => {
	return (
		<section className={styles.Footer}>
			<button
				type="button"
				onClick={onCancel}
				className={styles.Footer_cancelBtn}
			>
				Cancel
			</button>
			<button
				type="button"
				disabled={isDisabled}
				onClick={onSave}
				className={styles.Footer_btn}
			>
				Save All
			</button>
		</section>
	);
};

type ContentProps = {
	activeTab: EActiveSection;
	onClose: () => void;
	onSave: ({ values, sets }: EditedData) => void;
	onCancel: () => void;
	workout: TodaysWorkout;
	recurringData: RecurringWorkoutData;
};

const EditWorkoutContent = ({
	activeTab,
	workout,
	recurringData,
	onClose,
	onSave,
	onCancel,
}: ContentProps) => {
	const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
	const [values, setValues] = useState<EditWorkoutValues>({
		...getInitialValues(workout, recurringData),
	});
	const hasChanges = useRef<boolean>(false);

	const onSetChange = (sets: WorkoutSet[]) => {
		setWorkoutSets(sets);
	};

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});
		hasChanges.current = true;
	};

	const onChecked = (name: string, value: boolean) => {
		setValues({
			...values,
			[name]: value,
		});
		hasChanges.current = true;
	};
	const onSelect = (name: string, value: string | number | Date) => {
		if (name === "byDay") {
			const newDay = value as string; // 'Su', 'Mo', 'Tu' etc.
			const newList = handleByDay(newDay);
			setValues({ ...values, byDay: newList });
		} else {
			setValues({ ...values, [name]: value });
		}
	};

	const handleByDay = (value: string): string[] => {
		const { byDay } = values;
		const isAlreadySelected = byDay.includes(value);
		hasChanges.current = true;
		if (isAlreadySelected) {
			const newList = [...byDay.filter((d) => d !== value)];
			return newList;
		} else {
			const newList = [...byDay, value];
			return newList;
		}
	};

	const saveChanges = async () => {
		// do stuff
		// prepare edit workout values for server

		// return onClose && onClose();

		if (onSave) {
			return onSave({
				values,
				sets: workoutSets,
			});
		}
	};

	const cancelChanges = () => {
		if (onCancel) onCancel();

		return onClose();
	};
	return (
		<>
			{activeTab === EActiveSection.INFO && (
				<EditWorkoutInfo values={values} onChange={onChange} />
			)}
			{activeTab === EActiveSection.GOALS && (
				<EditWorkoutGoals
					values={values}
					onChange={onChange}
					onSetChange={onSetChange}
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
			<Footer
				onSave={saveChanges}
				onCancel={cancelChanges}
				isDisabled={!hasChanges.current}
			/>
		</>
	);
};

const getInitialValues = (
	workout: TodaysWorkout,
	recurringData: RecurringWorkoutData
) => {
	const { activityType, isRecurring, duration, workoutName } = workout;
	const workoutInfo: ActiveWorkout = recurringData?.workout;
	const schedule: WorkoutSchedule = recurringData?.schedule;
	const baseVals: EditWorkoutValues = {
		activityType: activityType,
		name: workoutName,
		desc: workoutInfo?.workoutDesc ?? "",
		duration: Number(duration),
		isRecurring: isRecurring ?? false,
		interval: 1,
		frequency: "Weekly",
		byDay: [],
		byMonth: "",
		byMonthDay: "",
		startDate: formatDate(new Date(), "db"),
		endDate: formatDate(addDays(new Date(), 60), "db"),
		startTime: formatTime(new Date(), "db"),
		endTime: formatTime(new Date(), "db"),
		steps: 0,
		miles: 0.0,
		pace: 0.0,
		exercise: activityType,
	};

	if (!schedule || !isRecurring) {
		return baseVals;
	} else {
		const parsedStart = parseAnyDate(schedule.startDate);
		const parsedEnd = parseAnyDate(schedule.endDate);
		const parsedStartTime = parseAnyTime(schedule.startTime);
		const parsedEndTime = parseAnyTime(schedule.endTime);
		const newStartDate = formatDate(parsedStart, "db");
		const newEndDate = formatDate(parsedEnd, "db");
		const newStartTime = formatTime(parsedStartTime, "db");
		const newEndTime = formatTime(parsedEndTime, "db");

		const scheduleVals = {
			workoutDesc: workoutInfo?.workoutDesc ?? "",
			isRecurring: isRecurring ?? false,
			interval: schedule?.interval ?? 1,
			frequency: "Weekly",
			byDay: schedule?.byDay ?? [],
			byMonth: schedule?.byMonth ?? "",
			byMonthDay: schedule?.byMonthDay ?? "",
			startDate: newStartDate,
			endDate: newEndDate,
			startTime: newStartTime,
			endTime: newEndTime,
		};
		return {
			...baseVals,
			...scheduleVals,
		} as EditWorkoutValues;
	}
};

const EditWorkout = ({ workout, onClose }: Props) => {
	const { workoutID, activityType } = workout;
	const { data: recurringData, isLoading } = useGetRecurringWorkoutData({
		workoutID,
		activityType,
	});
	const [activeTab, setActiveTab] = useState<EActiveSection>(
		EActiveSection.INFO
	);

	const onTabChange = (tab: EActiveSection) => {
		setActiveTab(tab);
	};

	const saveChanges = async (data: EditedData) => {
		const { values, sets } = data;
		console.log("[VALUES]", values);
		console.log("[SETS]", sets);

		// do stuff
		// prepare edit workout values for server

		// return onClose && onClose();
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
				{isLoading && (
					<div className={styles.EditWorkout_content_loading}>
						<Loader />
						<span>Loading details...</span>
					</div>
				)}
				{!isLoading && (
					<EditWorkoutContent
						activeTab={activeTab}
						workout={workout}
						recurringData={recurringData}
						onClose={onClose}
						onSave={saveChanges}
						onCancel={cancelChanges}
					/>
				)}
			</div>
		</div>
	);
};

export default EditWorkout;
