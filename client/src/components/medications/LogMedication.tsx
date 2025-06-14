import { ReactNode, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/medications/LogMedication.module.scss";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../features/user/types";
import { PillSummary } from "../../features/medications/types";
import { formatDate, formatTime } from "../../utils/utils_dates";
import { selectCurrentUser } from "../../features/user/userSlice";
import { MedLogBody, prepareMedLog } from "../../utils/utils_medications";
import { useLogMedicationMutation } from "../../features/medications/medicationsApi";
import CounterInput from "../shared/CounterInput";
import TimePicker from "../shared/TimePicker";
import DatePicker from "../shared/DatePicker";

type Props = {
	medication: {
		name: string;
		medID: number;
		scheduleID: number;
	};
	logs: MedLogEntry[];
	summary: PillSummary;
	selectedDate: Date | string;
	onSave?: () => void;
};

interface MedLogEntry {
	logID: number;
	scheduleID: number;
	loggedAt: Date | string;
	dose: number;
	notes: string;
	pillSizeInMg: number;
}

type TodaySummaryProps = {
	medName: string;
	logs: MedLogEntry[];
	summary: PillSummary;
};

type MedLogProps = {
	logEntry: MedLogEntry;
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

type ActionBtnProps = {
	onClick: () => void;
	children?: ReactNode;
};

const TakeButton = ({ onClick, children }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.TakeButton}>
			<svg className={styles.TakeButton_icon}>
				<use xlinkHref={`${sprite}#icon-checkmark`}></use>
			</svg>
			<span>{children ? children : "Take"}</span>
		</button>
	);
};
const SkipButton = ({ onClick, children }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.SkipButton}>
			<svg className={styles.SkipButton_icon}>
				<use xlinkHref={`${sprite}#icon-multiply`}></use>
			</svg>
			<span>{children ? children : "Skip"}</span>
		</button>
	);
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
	0.125: "1/8",
	0.25: "1/4",
	0.5: "1/2",
	0.75: "3/4",
	1.0: "1",
	1.25: "1 1/4",
	1.5: "1 1/2",
	1.75: "1 3/4",
	2.0: "2",
};

const getPillFraction = (dose: number) => {
	const fraction = pillFractions[dose as keyof object];

	return fraction;
};

const MedLogItem = ({ logEntry }: MedLogProps) => {
	const { dose, notes, loggedAt, pillSizeInMg = 8 } = logEntry;
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
					<div className={styles.MedLogItem_top_head_name}>{desc}</div>
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

const getTodayTotal = (summary: PillSummary) => {
	if ("pillsTakenToday" in summary) {
		return Number(summary.pillsTakenToday).toFixed(2);
	} else {
		return 0.0;
	}
};

const TodaysMedSummary = ({ logs, summary }: TodaySummaryProps) => {
	const totalToday = getTodayTotal(summary);
	const [showTodaysLogs, setShowTodaysLogs] = useState<boolean>(false);

	const toggleLogs = () => {
		setShowTodaysLogs(!showTodaysLogs);
	};

	return (
		<div className={styles.TodaysMedSummary}>
			<div className={styles.TodaysMedSummary_summary}>
				<div>
					You've taken <b>{totalToday}</b> pills today!
				</div>
			</div>
			<div className={styles.TodaysMedSummary_showMore}>
				<button
					onClick={toggleLogs}
					className={styles.TodaysMedSummary_showMore_btn}
				>
					{showTodaysLogs ? "Hide" : "Show"} today's doses
				</button>
			</div>
			{showTodaysLogs && (
				<>
					<div className={styles.TodaysMedSummary_title}>
						<div className={styles.TodaysMedSummary_title_label}>
							Today's Doses
						</div>
						<div className={styles.TodaysMedSummary_title_count}>
							{logs.length} logs
						</div>
					</div>
					<div className={styles.TodaysMedSummary_logs}>
						{logs &&
							logs.map((log, idx) => (
								<MedLogItem key={`${log.logID}-${idx}`} logEntry={log} />
							))}
					</div>
				</>
			)}
		</div>
	);
};

const LogMedication = ({
	medication = { name: "Buphrenorphine", medID: 1, scheduleID: 3 },
	logs,
	summary,
	onSave,
	selectedDate,
}: Props) => {
	const { name } = medication;
	const [values, setValues] = useState({
		dose: 0.25,
		loggedAt: formatTime(new Date(), "long"),
		loggedDate: formatDate(selectedDate || new Date(), "long"),
	});
	const currentUser: CurrentUser = useSelector(selectCurrentUser);
	const [logMed] = useLogMedicationMutation();

	const handleTime = (name: string, value: string) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleDate = (name: string, value: Date) => {
		const target = formatDate(value, "long");
		setValues({
			...values,
			[name]: target,
		});
	};

	const handleDose = (name: string, value: number) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	const takeMed = async () => {
		const { userID } = currentUser;
		const { scheduleID } = medication;
		const medLog: MedLogBody = prepareMedLog({
			userID: userID,
			scheduleID: scheduleID ?? 3,
			medID: medication.medID,
			loggedAt: values.loggedAt,
			dose: values.dose,
			action: "Taken",
			loggedDate: values.loggedDate || new Date(),
		});

		await logMed(medLog);
		return onSave && onSave();
	};

	const skipMed = async () => {
		const { userID } = currentUser;
		const { scheduleID } = medication;
		const medLog: MedLogBody = prepareMedLog({
			userID,
			scheduleID: scheduleID ?? 3,
			medID: medication.medID,
			loggedAt: values.loggedAt,
			dose: values.dose,
			loggedDate: values.loggedDate || new Date(),
			action: "Skipped",
		});

		console.log("[SKIPPED]:", medLog);
		await logMed(medLog);
		return onSave && onSave();
	};

	return (
		<div className={styles.LogMedication}>
			<div className={styles.LogMedication_name}>{name}</div>
			<div className={styles.LogMedication_todaysLogs}>
				<TodaysMedSummary logs={logs} summary={summary} medName={name} />
			</div>
			<div className={styles.LogMedication_loggedAt}>
				<div style={{ marginBottom: "1rem" }}>Logged At</div>
				<TimePicker
					name="loggedAt"
					id="loggedAt"
					value={values.loggedAt}
					onChange={handleTime}
				/>
			</div>
			<div className={styles.LogMedication_loggedAt}>
				<div style={{ marginBottom: "1rem" }}>Logged Date</div>
				<DatePicker
					name="loggedDate"
					id="loggedDate"
					value={values.loggedDate}
					onSelect={handleDate}
				/>
			</div>
			<div className={styles.LogMedication_takeAmount}>
				<div>Dosage</div>
				<CounterInput
					id="dose"
					name="dose"
					value={values.dose}
					min={0.25}
					max={2}
					step={0.25}
					onChange={handleDose}
				/>
			</div>
			<div className={styles.LogMedication_actions}>
				<SkipButton onClick={skipMed} />
				<TakeButton onClick={takeMed}>Take {values.dose}</TakeButton>
			</div>
		</div>
	);
};

export default LogMedication;
