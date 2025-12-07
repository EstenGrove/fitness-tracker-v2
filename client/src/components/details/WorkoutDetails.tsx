import styles from "../../css/details/WorkoutDetails.module.scss";
import sprite from "../../assets/icons/main.svg";
import {
	WalkWorkout,
	WorkoutByType,
	WorkoutSchedule,
	WorkoutWithSets,
} from "../../features/workouts/types";
import { HistoryOfType } from "../../features/history/types";

import { formatDuration as formatDurationDF } from "date-fns";
import { formatTime, parseAnyTime } from "../../utils/utils_dates";
import Icon from "../ui/Icon";
import { IconKey } from "../../utils/utils_icons";
import { ReactNode } from "react";
import { isSetsActivity } from "../../utils/utils_activity";
import { formatThousand } from "../../utils/utils_misc";

type Props = {
	workout: WorkoutByType;
	schedule: WorkoutSchedule | null;
	history: HistoryOfType[];
};

const formatDur = (dur: number) => {
	if (!dur) return "Open";
	const time = formatDurationDF({
		minutes: dur,
	});

	return time;
};

const getTimeRange = (schedule: WorkoutSchedule | null) => {
	if (!schedule) return "Any time";
	const { startTime, endTime } = schedule;
	const sTime = formatTime(parseAnyTime(startTime));
	const eTime = formatTime(parseAnyTime(endTime));
	console.log("sTime", sTime);

	return `${sTime} - ${eTime}`;
};

type InfoProps = {
	label?: string;
	value: string;
	icon: IconKey;
	iconColor?: string;
};

const InfoRow = ({
	label = "",
	value,
	icon,
	iconColor = "var(--blueGrey700)",
}: InfoProps) => {
	const iconCss = { width: "2.2rem", height: "2.2rem" };
	return (
		<div className={styles.InfoRow}>
			<Icon style={iconCss} icon={icon} color={iconColor} />
			<span>
				{label}
				{value}
			</span>
		</div>
	);
};

const getRepeatsOn = (schedule: WorkoutSchedule | null) => {
	if (!schedule || schedule?.frequency === "None") return "Does not repeat.";
	const { frequency, byDay, byMonth, byMonthDay } = schedule;
	const freqMap = {
		Daily: "Daily",
		Weekly: `weekly on ${byDay?.join(", ")}`,
		Monthly: `monthly on ${byMonth}/${byMonthDay}`,
		Yearly: `yearly on ${byMonthDay}`,
	};
	const repeats = `Repeats ${freqMap[frequency]}`;
	return repeats;
};

const Section = ({ children }: { children?: ReactNode }) => {
	return <div className={styles.Section}>{children}</div>;
};

type StepsInfoProps = {
	workout: WalkWorkout;
	history: HistoryOfType[];
};
const StepsInfo = ({ workout, history }: StepsInfoProps) => {
	const steps = formatThousand(workout.steps);
	return (
		<>
			<InfoRow
				value={workout?.miles + "mi."}
				icon="run"
				iconColor="var(--blueGrey700)"
			/>
			<InfoRow
				value={steps + " steps"}
				icon="steps"
				// iconColor="var(--accent-orange)"
				iconColor="var(--blueGrey700)"
			/>
			<InfoRow
				value={workout?.pace + "'/sec"}
				icon="cardio"
				iconColor="var(--blueGrey700)"
			/>
		</>
	);
};

type SetsInfoProps = {
	workout: WorkoutWithSets;
	history: HistoryOfType[];
};
const SetsInfo = ({ workout, history }: SetsInfoProps) => {
	return (
		<>
			<InfoRow
				value={"Equipment: " + (workout?.equipment ?? "None")}
				icon="effort"
				iconColor="var(--accent-orange)"
			/>
			<InfoRow
				value={workout?.reps + " reps"}
				icon="cardio"
				iconColor="var(--accent-orange)"
			/>
		</>
	);
};

const WorkoutDetails = ({ workout, schedule, history = [] }: Props) => {
	const hasSteps = workout.activityType === "Walk";
	const hasSets = isSetsActivity(workout.activityType);
	const duration = formatDur(workout.duration);
	const range = getTimeRange(schedule);
	const repeatsOn = getRepeatsOn(schedule);
	console.log("workout", workout);
	console.log("schedule", schedule);
	return (
		<div className={styles.WorkoutDetails}>
			<Section>
				<InfoRow value={duration} icon="timer" iconColor="var(--accent)" />
				<InfoRow value={range} icon="history" iconColor="var(--accent-blue)" />
				<InfoRow
					value={repeatsOn}
					icon="history2"
					iconColor="var(--accent-orange)"
				/>
			</Section>
			{hasSets && (
				<Section>
					<SetsInfo workout={workout as WorkoutWithSets} history={history} />
				</Section>
			)}
			{hasSteps && (
				<Section>
					<StepsInfo workout={workout as WalkWorkout} history={history} />
				</Section>
			)}
		</div>
	);
};

export default WorkoutDetails;
