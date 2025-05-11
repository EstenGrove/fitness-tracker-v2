import styles from "../../css/details/ScheduleDetails.module.scss";
import { WorkoutSchedule } from "../../features/workouts/types";
import { RepeatType } from "../../features/shared/types";
import { formatTime, MONTHS, parseAnyTime } from "../../utils/utils_dates";
import DetailsBlock from "./DetailsBlock";
import { getMonthDaySuffix, isRecurring } from "../../utils/utils_recurring";

type Props = {
	schedule: WorkoutSchedule;
};

const getStart = (start: string) => {
	const startP = parseAnyTime(start);
	const startTime = formatTime(startP, "short");

	return startTime;
};

type RepeatProps = {
	schedule: WorkoutSchedule;
};
const DailyDetails = ({ schedule }: RepeatProps) => {
	const { interval = 3, startTime } = schedule;
	const frequency = schedule.frequency as RepeatType;
	const every = interval > 1 ? `${interval} days` : `${interval} day`;
	return (
		<div className={styles.DailyDetails}>
			<DetailsBlock type="Repeat" label="Repeats" value={frequency} />
			<DetailsBlock type="Date" label="When" value={startTime} />
			<DetailsBlock type="Every" label="Every" value={every} />
		</div>
	);
};
const WeeklyDetails = ({ schedule }: RepeatProps) => {
	const { byDay, startTime } = schedule;
	const start = getStart(startTime);
	const frequency = schedule.frequency as RepeatType;
	const days = byDay.length + "x/week";
	const daysList = byDay.join(",");

	return (
		<div className={styles.WeeklyDetails}>
			<DetailsBlock type="Repeat" label="Repeats" value={frequency} />
			<DetailsBlock type="Date" label="When" value={start} />
			<DetailsBlock type="ByDay" label="Days" value={days} />
			<DetailsBlock type="ByDay" label="Days" value={daysList} />
		</div>
	);
};

const MonthlyDetails = ({ schedule }: RepeatProps) => {
	const { byMonthDay = 18, startTime } = schedule;
	const idx = 18;
	const frequency = schedule.frequency as RepeatType;
	const every = idx + getMonthDaySuffix(byMonthDay);
	return (
		<div className={styles.MonthlyDetails}>
			<DetailsBlock type="Repeat" label="Repeats" value={frequency} />
			<DetailsBlock type="Date" label="When" value={startTime} />
			<DetailsBlock type="ByDay" label="Each Month" value={every} />
		</div>
	);
};
const YearlyDetails = ({ schedule }: RepeatProps) => {
	const { byMonth = 3, byMonthDay = 18, startTime } = schedule;
	const idx = !byMonthDay || byMonthDay === 0 ? 1 : byMonthDay;
	const frequency = schedule.frequency as RepeatType;
	const month = MONTHS[Number(byMonth)].slice(0, 3) + ".";
	const day = getMonthDaySuffix(idx);
	const when = month + " " + idx + day;
	return (
		<div className={styles.YearlyDetails}>
			<DetailsBlock type="Repeat" label="Repeats" value={frequency} />
			<DetailsBlock type="Date" label="When" value={startTime} />
			<DetailsBlock type="ByDay" label="Every" value={when} />
		</div>
	);
};

const ScheduleDetails = ({ schedule }: Props) => {
	if (!schedule) return null;
	const frequency = schedule.frequency as RepeatType;

	return (
		<div className={styles.ScheduleDetails}>
			<div className={styles.ScheduleDetails_title}>Schedule Details:</div>
			{isRecurring(frequency) && (
				<div className={styles.ScheduleDetails_details}>
					{frequency === "Daily" && <DailyDetails schedule={schedule} />}
					{frequency === "Weekly" && <WeeklyDetails schedule={schedule} />}
					{frequency === "Monthly" && <MonthlyDetails schedule={schedule} />}
					{frequency === "Yearly" && <YearlyDetails schedule={schedule} />}
				</div>
			)}
		</div>
	);
};

export default ScheduleDetails;
