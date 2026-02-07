import { ChangeEvent, useRef, useState, useEffect } from "react";
import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/habits/HabitTracker.module.scss";
import {
	Habit,
	HabitFrequency,
	HabitLog,
	HabitLogValues,
	HabitSummary,
} from "../../features/habits/types";
import { addEllipsis, sortByDate } from "../../utils/utils_misc";
import { habitIcons } from "../../utils/utils_habits";
import {
	formatCustomDate,
	formatDateTime,
	formatTime,
} from "../../utils/utils_dates";
import HabitLogger from "./HabitLogger";
import { isThisMonth, isThisWeek } from "date-fns";

import HabitHistory from "./HabitHistory";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLogHabitOverrideMutation } from "../../features/habits/habitsApi";

type Props = {
	habit: Habit;
	summary: HabitSummary;
	allLogs: HabitLog[];
	// Used for invalidating the cache upon saving changes
	onChanges?: () => void;
};

type HeaderProps = {
	habit: Habit;
	lastEntry: string;
};

const fallbackMsg = "No logs yet.";

const getLastEntry = (frequency: HabitFrequency, logs: HabitLog[]): string => {
	if (!logs || !logs?.length) return fallbackMsg;
	const sorted: HabitLog[] = sortByDate<HabitLog>("logTime", logs);
	const last: HabitLog = sorted[0];
	const newDate = new Date(last.logTime);

	switch (frequency) {
		case "Daily": {
			const time = formatTime(newDate, "longMs");
			return `Last entry was at ${time}`;
		}
		case "Weekly": {
			const thisWeek = isThisWeek(newDate);
			const dayAndTime = formatCustomDate(newDate, "dayAndTime");
			if (thisWeek) {
				return `Last entry as ${dayAndTime}`;
			}
			return `Last entry was last ${dayAndTime}`;
		}
		case "Monthly": {
			const thisMonth = isThisMonth(newDate);
			const dayAndTime = formatCustomDate(newDate, "monthDayAndTime");
			if (thisMonth) {
				return `Last entry was last month on ${dayAndTime}`;
			}
			const monthDateAndTime = formatCustomDate(newDate, "monthDateAndTime");
			return `Last entry was last month on the ${monthDateAndTime}`;
		}

		default:
			return "Invalid Frequency Type";
	}
};

const HabitHeader = ({ habit, lastEntry }: HeaderProps) => {
	const icon = habitIcons[habit.icon];
	const css = { fill: habit.iconColor };
	const name = addEllipsis(habit.habitName, 20);
	return (
		<div className={styles.HabitHeader}>
			<div className={styles.HabitHeader_title}>
				<svg className={styles.HabitHeader_title_icon} style={css}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
				<div className={styles.HabitHeader_title_name}>{name}</div>
			</div>
			<div className={styles.HabitHeader_title_last}>{lastEntry}</div>
		</div>
	);
};

type InputModalProps = {
	value: string;
	closeModal: () => void;
	habitUnit: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSave: () => void;
};
const InputModal = ({
	value,
	closeModal,
	onChange,
	onSave,
}: InputModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useOutsideClick(modalRef, closeModal);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	return (
		<div ref={modalRef} className={styles.InputModal}>
			<div className={styles.InputModal_title}>Enter a manual value</div>
			<input
				ref={inputRef}
				type="number"
				name="input"
				id="input"
				value={value}
				onChange={onChange}
				className={styles.InputModal_input}
			/>
			<div className={styles.InputModal_action}>
				<button className={styles.InputModal_action_save} onClick={onSave}>
					Save Log
				</button>
			</div>
		</div>
	);
};

const ManualLogger = ({
	habit,
	onSave,
}: {
	habit: Habit;
	onSave: (value: number) => void;
}) => {
	const { habitUnit } = habit;
	const [showInput, setShowInput] = useState<boolean>(false);
	const [newValue, setNewValue] = useState<string>(String(0));

	const openInput = () => {
		setShowInput(true);
	};
	const closeInput = () => {
		// confirmSave();
		setShowInput(false);
	};

	const confirmSave = async () => {
		const value = Number(newValue);

		if (!value) return;

		await onSave(value);

		closeInput();
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		setNewValue(String(value));
	};

	return (
		<div className={styles.ManualLogger}>
			<button className={styles.ManualLogger_btn} onClick={openInput}>
				Log {habitUnit}
			</button>
			{/*  */}
			{showInput && (
				<InputModal
					value={newValue}
					onChange={handleChange}
					habitUnit={habitUnit}
					closeModal={closeInput}
					onSave={confirmSave}
				/>
			)}
		</div>
	);
};

const HistorySection = ({ habit }: { habit: Habit }) => {
	const [showHistory, setShowHistory] = useState<boolean>(false);

	const openHistory = () => {
		setShowHistory(true);
	};
	const closeHistory = () => {
		setShowHistory(false);
	};

	return (
		<div className={styles.HistorySection}>
			<button
				type="button"
				onClick={openHistory}
				className={styles.HistorySection_btn}
			>
				<svg className={styles.HistorySection_btn_icon}>
					<use xlinkHref={`${sprite}#icon-synchronize`}></use>
				</svg>
				<span>Show History</span>
			</button>

			{showHistory && <HabitHistory habit={habit} onClose={closeHistory} />}
		</div>
	);
};

const HabitTracker = ({ habit, summary, allLogs, onChanges }: Props) => {
	const lastTaken = getLastEntry(habit.frequency, allLogs);
	const [habitLogOverride] = useLogHabitOverrideMutation();

	const saveHabitLog = async (newValue: number) => {
		const newLog: HabitLogValues = {
			userID: habit.userID,
			habitID: habit.habitID,
			loggedAmount: newValue,
			notes: "Habit logged",
			loggedAt: formatDateTime(new Date(), "db"),
		};
		console.log("newLog", newLog);
		await habitLogOverride(newLog);

		return onChanges && onChanges();
	};

	return (
		<div className={styles.HabitTracker}>
			<HabitHeader habit={habit} lastEntry={lastTaken ?? ""} />
			<HabitLogger habit={habit} summary={summary} habitStep={1} />
			<ManualLogger habit={habit} onSave={saveHabitLog} />
			<HistorySection habit={habit} />
		</div>
	);
};

export default HabitTracker;
