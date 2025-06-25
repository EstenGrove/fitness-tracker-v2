import sprite from "../../assets/icons/main.svg";
import styles from "../../css/medications/MedicationLogHistory.module.scss";
import { MedLogEntry } from "../../features/medications/types";
import {
	addEllipsis,
	groupByFn,
	isEmptyArray,
	TRecord,
} from "../../utils/utils_misc";
import {
	formatCustomDate,
	formatDate,
	formatTime,
} from "../../utils/utils_dates";

type Props = {
	logs: MedLogEntry[];
};

type LogsForDateProps = {
	date: string;
	logs: MedLogEntry[];
};

const getTotalForDate = (logs: MedLogEntry[]) => {
	if (isEmptyArray(logs)) return 0;
	return logs.reduce((total, item) => (total += item.dose), 0);
};

const formatLogDate = (date: string) => {
	const newDate = formatCustomDate(date, "monthAndDay");
	return newDate;
};

const getAmountDesc = (logEntry: MedLogEntry) => {
	const { notes, dose } = logEntry;

	if (notes === "Taken") {
		return `Took ${dose}`;
	}

	if (notes === "Skipped") {
		return `Skipped`;
	}

	// unknown notes
	return dose;
};

const pillFractions = {
	"0.125": "1/8",
	"0.25": "1/4",
	"0.50": "1/2",
	"0.75": "3/4",
	"1.00": "1",
	"1.25": "1 1/4",
	"1.50": "1 1/2",
	"1.75": "1 3/4",
	"2.00": "2",
} as const;

const getPillFraction = (dose: number): string => {
	const normed = dose.toFixed(2);
	const fraction = pillFractions[normed as keyof object];

	return fraction;
};

const TakenBadge = () => {
	return (
		<div className={styles.TakenBadge}>
			<svg className={styles.TakenBadge_icon}>
				<use xlinkHref={`${sprite}#icon-double-tick`}></use>
			</svg>
		</div>
	);
};
const SkippedBadge = () => {
	return (
		<div className={styles.SkippedBadge}>
			<svg className={styles.SkippedBadge_icon}>
				<use xlinkHref={`${sprite}#icon-multiply`}></use>
			</svg>
		</div>
	);
};

type MedLogProps = {
	name?: string;
	logEntry: MedLogEntry;
};

const MedLogItem = ({ name = "Buprenorphine", logEntry }: MedLogProps) => {
	const { dose, notes, loggedAt, pillSizeInMg = 8 } = logEntry;
	const medName = addEllipsis(name, 10);
	const desc = getAmountDesc(logEntry);
	const mgTaken: number = dose * pillSizeInMg;
	const action: string = notes.toLowerCase();
	const doseage = getPillFraction(dose);

	return (
		<li className={styles.MedLogItem}>
			<div className={styles.MedLogItem_top}>
				{action.toUpperCase() === "TAKEN" && <TakenBadge />}
				{action.toUpperCase() === "SKIPPED" && <SkippedBadge />}
				<div className={styles.MedLogItem_top_head}>
					<div className={styles.MedLogItem_top_head_name}>
						{desc} {medName}
					</div>
					<div className={styles.MedLogItem_top_head_time}>
						{formatTime(loggedAt, "long")}
					</div>
				</div>
			</div>
			<div className={styles.MedLogItem_bottom}>
				<div className={styles.MedLogItem_bottom_amount}>
					{notes === "Skipped" && "Dose was skipped"}
					{notes === "Taken" && (
						<span>
							<b>{doseage}</b> of a pill
						</span>
					)}
				</div>
				<div className={styles.MedLogItem_bottom_amount}>{mgTaken}mg</div>
			</div>
		</li>
	);
};

const LogsForDate = ({ date, logs }: LogsForDateProps) => {
	const logsDate = formatLogDate(date);
	const total = getTotalForDate(logs).toFixed(2);
	const logsCount = logs.length || 0;
	return (
		<div className={styles.LogsForDate}>
			<div className={styles.LogsForDate_header}>
				<div className={styles.LogsForDate_header_date}>
					<h4>{logsDate}</h4>
					<div>({logsCount})</div>
				</div>
				<div className={styles.LogsForDate_header_total}>Total: {total}</div>
			</div>
			<ul className={styles.LogsForDate_list}>
				{logsCount > 0 &&
					logs.map((log, idx) => {
						const key = `${log.logID}-${idx}`;
						return <MedLogItem key={key} logEntry={log} />;
					})}
			</ul>
		</div>
	);
};

const groupLogs = (logs: MedLogEntry[]) => {
	const grouped = groupByFn<MedLogEntry>(logs, (entry) =>
		formatDate(entry.loggedAt, "long")
	);

	return grouped;
};

const sortLogHistory = (logsByDate: TRecord<MedLogEntry>) => {
	return Object.keys(logsByDate).sort((a, b) => {
		const dateA = new Date(a).getTime();
		const dateB = new Date(b).getTime();
		return dateB - dateA;
	});
};

const MedicationLogHistory = ({ logs }: Props) => {
	const logsByDate = groupLogs(logs);
	const dates = sortLogHistory(logsByDate);
	return (
		<div className={styles.MedicationLogHistory}>
			<div className={styles.MedicationLogHistory_list}>
				{dates &&
					dates.map((date, idx) => {
						const logs = logsByDate[date];
						const key = `${idx}-${date}`;
						return <LogsForDate key={key} date={date} logs={logs} />;
					})}
			</div>
		</div>
	);
};

export default MedicationLogHistory;
