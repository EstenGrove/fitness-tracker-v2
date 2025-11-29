import styles from "../../css/details/WorkoutDetails.module.scss";
import sprite from "../../assets/icons/main.svg";
import { WorkoutByType, WorkoutSchedule } from "../../features/workouts/types";
import { HistoryOfType } from "../../features/history/types";

import { formatDuration as formatDurationDF } from "date-fns";
import { formatTime, parseAnyTime } from "../../utils/utils_dates";
import Icon from "../ui/Icon";
import { IconKey } from "../../utils/utils_icons";
import { ReactNode } from "react";

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
			{/* <svg className={styles.InfoRow_icon} style={iconCss}>
				<use xlinkHref={`${sprite}#icon-${icon}`}></use>
			</svg> */}
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

const WorkoutDetails = ({ workout, schedule, history = [] }: Props) => {
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
			<Section>
				<InfoRow
					value={"Equipment: " + (workout?.equipment ?? "None")}
					icon="effort"
					iconColor="var(--accent-orange)"
				/>
				<InfoRow
					value={workout?.reps}
					icon="effort"
					iconColor="var(--accent-orange)"
				/>
			</Section>
		</div>
	);
};

export default WorkoutDetails;
