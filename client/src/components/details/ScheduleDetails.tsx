import sprite from "../../assets/icons/main2.svg";
import styles from "../../css/details/ScheduleDetails.module.scss";
import { WorkoutSchedule } from "../../features/workouts/types";
import DetailsItem from "./DetailsItem";
import { RepeatType } from "../../features/shared/types";
import {
	formatDate,
	formatTime,
	MONTHS,
	parseAnyTime,
} from "../../utils/utils_dates";
import DetailsBlock from "./DetailsBlock";
import { getMonthDaySuffix, isRecurring } from "../../utils/utils_recurring";

type Props = {
	schedule: WorkoutSchedule;
};

const RepeatTypeBadge = ({ repeatType }: { repeatType: RepeatType }) => {
	return (
		<div className={styles.RepeatTypeBadge}>
			<svg className={styles.RepeatTypeBadge_icon}>
				<use xlinkHref={`${sprite}#icon-synchronize`}></use>
			</svg>
			<span>{repeatType}</span>
		</div>
	);
};

const getWhenDates = (schedule: WorkoutSchedule) => {
	const { startDate, endDate } = schedule;
	const start = formatDate(startDate, "clean");
	const end = formatDate(endDate, "clean");

	return `${start} to ${end}`;
};

// Convert start times
const getWhenTimes = (schedule: WorkoutSchedule) => {
	if (!schedule.startTime && !schedule.endTime) {
		return "All Day";
	} else {
		const startP = parseAnyTime(schedule.startTime);
		const endP = parseAnyTime(schedule.endTime);
		const start = formatTime(startP, "short");
		const end = formatTime(endP, "short");
		// convert times
		return `${start} - ${end}`;
	}
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
	return (
		<div className={styles.WeeklyDetails}>
			<DetailsBlock type="Repeat" label="Repeats" value={frequency} />
			<DetailsBlock type="Date" label="When" value={start} />
			<DetailsBlock type="ByDay" label="Days" value={days} />
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
