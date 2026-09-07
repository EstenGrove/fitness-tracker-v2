import { useState } from "react";
import styles from "../../css/history/EditHistory.module.scss";
import { Activity, Effort } from "../../features/shared/types";
import { WorkoutSet } from "../../utils/utils_workouts";
import { HistoryOfType } from "../../features/history/types";
import { formatTime } from "../../utils/utils_dates";
import Button from "../shared/Button";
import Select, { SelectOption } from "../shared/Select";
import TimePicker from "../shared/TimePicker";
import MinutesSelector from "../shared/MinutesSelector";
import { useEditWorkoutHistoryMutation } from "../../features/history/historyApi";
import { prepareUpdateHistoryData } from "../../utils/utils_history";

type Props = {
	historyEntry: HistoryOfType;
	onClose: () => void;
	onConfirm?: () => void;
};

interface UpdateHistoryData {
	workoutID: number;
	historyID: number;
	activityType: Activity;
	startTime: string;
	endTime: string;
	duration: number;
	effort: Effort;
	sets?: WorkoutSet[];
	steps?: number;
	miles?: number;
	pace?: number;
}

type HistoryValues = Omit<
	UpdateHistoryData,
	"steps" | "sets" | "miles" | "pace" | "workoutID" | "historyID"
>;
type WalkValues = Pick<UpdateHistoryData, "steps" | "sets" | "miles" | "pace">;

const levels: SelectOption[] = [
	"Easy",
	"Moderate",
	"Hard",
	"Strenuous",
	"All Out",
].map((item) => ({
	value: item,
	label: item,
}));

type StepProps = {
	values: HistoryValues;
	onChange: (name: string, value: string | number) => void;
};

const EffortStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.EffortStep} style={{ minWidth: "100%" }}>
			<label htmlFor="effort">How much effort was this workout?</label>
			<Select
				name="effort"
				id="effort"
				value={values.effort}
				options={levels}
				onChange={onChange}
				style={{ minWidth: "100%" }}
			/>
		</div>
	);
};
const DatetimeStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.DatetimeStep}>
			<label>Start/End Time</label>
			<div className={styles.DatetimeStep_row}>
				<TimePicker
					name="startTime"
					value={values.startTime}
					onChange={onChange}
				/>
				<TimePicker name="endTime" value={values.endTime} onChange={onChange} />
			</div>
		</div>
	);
};

const DurationStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.DurationStep}>
			<label>Duration</label>
			<MinutesSelector
				name="duration"
				minutes={values.duration}
				onSelect={onChange}
			/>
		</div>
	);
};

const ResetButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button onClick={onClick} styles={styles}>
			Reset All
		</Button>
	);
};

const DEFAULTS = {
	walk: {
		steps: 0,
		miles: 0,
		pace: 0,
	},
	workoutSets: [],
};

const EditHistory = ({ historyEntry, onClose, onConfirm }: Props) => {
	const [editWorkoutHistory, { isLoading }] = useEditWorkoutHistoryMutation();
	const [values, setValues] = useState<HistoryValues>({
		activityType: historyEntry.activityType,
		startTime: formatTime(historyEntry.startTime),
		endTime: formatTime(historyEntry.endTime),
		duration: historyEntry.duration,
		effort: historyEntry.effort,
	});
	const [walkValues, setWalkValues] = useState<WalkValues>(DEFAULTS.walk);

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	const onSave = async () => {
		const { userID } = historyEntry;
		const data = prepareUpdateHistoryData(userID, {
			historyID: historyEntry.historyID,
			activityType: historyEntry.activityType,
			startTime: values.startTime,
			endTime: values.endTime,
			duration: values.duration,
			effort: values.effort,
			steps: walkValues.steps || 0,
			miles: walkValues.miles || 0,
			pace: walkValues.pace || 0,
		});
		// await editWorkoutHistory({ userID, data });
		console.log("DATA:", data);

		if (onConfirm) return onConfirm();
		return onClose && onClose();
	};

	const onReset = () => {
		setWalkValues({ ...DEFAULTS.walk });
		setValues({
			activityType: historyEntry.activityType,
			startTime: formatTime(historyEntry.startTime),
			endTime: formatTime(historyEntry.endTime),
			duration: historyEntry.duration,
			effort: historyEntry.effort,
		});
	};

	return (
		<div className={styles.EditHistory}>
			<div className={styles.EditHistory_header}>
				<h2>Edit History</h2>
			</div>
			<div className={styles.EditHistory_field} style={{ minWidth: "100%" }}>
				<EffortStep values={values} onChange={onChange} />
			</div>
			<div className={styles.EditHistory_field}>
				<DatetimeStep values={values} onChange={onChange} />
			</div>
			<div className={styles.EditHistory_field}>
				<DurationStep values={values} onChange={onChange} />
			</div>
			<div
				className={styles.EditHistory_field}
				style={{
					minWidth: "100%",
					display: "flex",
					justifyContent: "center",
					marginTop: "4rem",
				}}
			>
				<ResetButton onClick={onReset} />
				<Button
					onClick={onSave}
					styles={{ width: "max-content" }}
					isDisabled={isLoading}
				>
					{isLoading ? "Saving..." : "Save Changes"}
				</Button>
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default EditHistory;
