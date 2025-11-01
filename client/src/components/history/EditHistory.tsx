import { useState } from "react";
import styles from "../../css/history/EditHistory.module.scss";
import { Activity, Effort } from "../../features/shared/types";
import { WorkoutSet } from "../../utils/utils_workouts";
import { HistoryOfType } from "../../features/history/types";
import { formatTime } from "../../utils/utils_dates";
import Select, { SelectOption } from "../shared/Select";
import TimePicker from "../shared/TimePicker";

type Props = {
	historyEntry: HistoryOfType;
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

type EffortProps = {
	values: HistoryValues;
	onChange: (name: string, value: string | number) => void;
};

const EffortStep = ({ values, onChange }: EffortProps) => {
	return (
		<div className={styles.EffortStep}>
			<label>How much effort was this workout?</label>
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
const DatetimeStep = ({ values, onChange }: EffortProps) => {
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

const EditHistory = ({ historyEntry }: Props) => {
	const [values, setValues] = useState<HistoryValues>({
		activityType: historyEntry.activityType,
		startTime: formatTime(historyEntry.startTime),
		endTime: formatTime(historyEntry.endTime),
		duration: historyEntry.duration,
		effort: historyEntry.effort,
	});
	const [walkValues, setWalkValues] = useState<WalkValues>({
		steps: 0,
		miles: 0,
		pace: 0,
	});
	const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	return (
		<div className={styles.EditHistory}>
			<div className={styles.EditHistory_field}>
				<EffortStep values={values} onChange={onChange} />
			</div>
			<div className={styles.EditHistory_field}>
				<DatetimeStep values={values} onChange={onChange} />
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default EditHistory;
