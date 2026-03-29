import {
	ChangeEvent,
	FocusEvent,
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/habits/QuickLogHabit.module.scss";
import { logHabitsBatched } from "../../utils/utils_habits";
import {
	formatTime,
	parseAnyTime,
	prepareTimestamp,
} from "../../utils/utils_dates";
import { DeferredFetch } from "../../hooks/useDeferredLogQueue";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { HabitCard, HabitLogValues } from "../../features/habits/types";
import { useBatchedHabitLogger } from "../../hooks/useBatchedHabitLogger";
import { useLogHabitOverrideMutation } from "../../features/habits/habitsApi";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/user/userSlice";
import DatePicker from "../shared/DatePicker";
import TimePicker from "../shared/TimePicker";
import { set } from "date-fns";
import { useHaptic } from "../../hooks/useHaptic";

type Props = {
	habit: HabitCard;
};

const prepareHabitLog = (
	value: number,
	habit: HabitCard,
	loggedTime?: Date | string,
) => {
	const loggedAt = loggedTime
		? prepareTimestamp(loggedTime)
		: prepareTimestamp(new Date());
	const values: HabitLogValues = {
		userID: habit.userID,
		habitID: habit.habitID,
		loggedAmount: value,
		loggedAt: loggedAt,
		notes: "Habit logged",
	};
	return values;
};

const MinusButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.MinusButton}>
			<svg className={styles.MinusButton_icon}>
				<use xlinkHref={`${sprite}#icon-minus`}></use>
			</svg>
		</button>
	);
};
const AddButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.AddButton}>
			<svg className={styles.AddButton_icon}>
				<use xlinkHref={`${sprite}#icon-plus-math`}></use>
			</svg>
		</button>
	);
};

type DisplayProps = {
	value: number;
	originalValue: number;
	onChange: (value: number) => void;
	onSave: (newValue: number) => Promise<void>;
};
type DisplayInputProps = {
	habitValue: number;
	originalValue: number;
	closeInput: () => void;
	onChange: (value: number) => void;
	onSave: (newValue: number) => Promise<void>;
};

const DisplayInput = ({
	habitValue,
	originalValue,
	onChange,
	onSave,
	closeInput,
}: DisplayInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useOutsideClick(inputRef, () => {
		// closeInput();
		// closeInput();
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		return onChange(Number(value));
	};

	const selectText = (e: FocusEvent<HTMLInputElement>) => {
		e.currentTarget.select();
	};

	const handleSave = async () => {
		const el = inputRef.current as HTMLInputElement;
		const current = Number(el.value);
		if (current !== originalValue) {
			await onSave(Number(el.value));
		}
		closeInput();
	};

	const handleBlur = async () => {
		console.log("BLURRED");

		await handleSave();
	};

	const onEnter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			const el = inputRef.current as HTMLInputElement;
			onSave(Number(el.value));
		}
	};

	// Focus & select text onMount
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<input
			type="number"
			name="value"
			id="value"
			inputMode="numeric"
			ref={inputRef}
			value={habitValue}
			onChange={handleChange}
			onFocus={selectText}
			onBlur={handleBlur}
			onKeyDown={onEnter}
			className={styles.DisplayInput}
		/>
	);
};

const habitStep = 1;

const DisplayValue = ({
	value = 0,
	originalValue = 0,
	onChange,
	onSave,
}: DisplayProps) => {
	const [showInput, setShowInput] = useState<boolean>(false);

	const openInput = () => {
		setShowInput(true);
	};
	const closeInput = () => {
		setShowInput(false);
	};

	const saveManual = async () => {
		onSave(value);
	};

	return (
		<div className={styles.DisplayValue}>
			{!showInput && (
				<div className={styles.DisplayValue_text} onClick={openInput}>
					{value}
				</div>
			)}
			{showInput && (
				<DisplayInput
					originalValue={originalValue}
					habitValue={value}
					onChange={onChange}
					closeInput={closeInput}
					onSave={saveManual}
				/>
			)}
		</div>
	);
};
type OptionValues = {
	date: Date | string;
	time: string;
};

type OptionProps = {
	date: Date | string;
	time: string;
	onChange: (name: string, dateOrTime: Date | string) => void;
};

const LoggingOptions = ({ date, time, onChange }: OptionProps) => {
	const handleDateSelect = (name: string, date: Date) => {
		onChange(name, date);
	};
	const handleTimeChange = (name: string, time: string) => {
		onChange(name, time);
	};
	return (
		<div className={styles.LoggingOptions}>
			<div className={styles.LoggingOptions_date}>
				<DatePicker
					name="date"
					id="date"
					value={date}
					onSelect={handleDateSelect}
				/>
			</div>
			<div className={styles.LoggingOptions_time}>
				<TimePicker
					name="time"
					id="time"
					value={time}
					onChange={handleTimeChange}
					styles={{ minHeight: "4rem" }}
				/>
			</div>
		</div>
	);
};

const getInitialOptions = () => {
	const date = new Date();
	const time = formatTime(date, "db");

	return {
		date,
		time,
	};
};

const getLoggedTimestamp = (date: Date | string, time: string) => {
	const baseDate = new Date(date);
	// Ensure we're working with the date at midnight local time
	const dateAtMidnight = new Date(
		baseDate.getFullYear(),
		baseDate.getMonth(),
		baseDate.getDate(),
	);
	const parsedTime = parseAnyTime(time) as Date;

	const withTime = set(dateAtMidnight, {
		hours: parsedTime.getHours(),
		minutes: parsedTime.getMinutes(),
	});
	return withTime.toISOString();
};

const QuickLogHabit = ({ habit }: Props) => {
	useLockBodyScroll();
	const { trigger } = useHaptic();
	const currentUser = useSelector(selectCurrentUser);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [optionValues, setOptionValues] = useState<OptionValues>({
		...getInitialOptions(),
	});
	const [todaysValue, setTodaysValue] = useState<number>(
		habit.habitsLogged || 0,
	);
	const { queueLog } = useBatchedHabitLogger(
		650,
		logHabitsBatched as DeferredFetch<HabitLogValues>,
	);
	const [logManual] = useLogHabitOverrideMutation();

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	const handleOptionChange = (name: string, value: Date | string) => {
		if (name === "mins") {
			return setOptionValues((prev) => ({
				...prev,
				time: value as string,
			}));
		}
		return setOptionValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleManualEdit = (value: number) => {
		setTodaysValue(value);
	};

	const saveManualEdit = async (newValue: number) => {
		const loggedAt = getLoggedTimestamp(optionValues.date, optionValues.time);
		const newLog = prepareHabitLog(
			newValue,
			{
				...habit,
				userID: currentUser.userID,
			},
			loggedAt,
		);

		await logManual(newLog);
	};

	const add = () => {
		const loggedAt = getLoggedTimestamp(optionValues.date, optionValues.time);
		const value = todaysValue + habitStep;
		setTodaysValue(value);

		const newLog = prepareHabitLog(habitStep, habit, loggedAt);
		queueLog(newLog);
		trigger("success");
	};
	const minus = () => {
		const loggedAt = getLoggedTimestamp(optionValues.date, optionValues.time);
		const newValue = todaysValue - habitStep;
		const value = newValue >= 0 ? newValue : 0;
		setTodaysValue(value);

		const newLog = prepareHabitLog(-habitStep, habit, loggedAt);
		queueLog(newLog);
		trigger("success");
	};

	return (
		<div className={styles.QuickLogHabit}>
			<div className={styles.QuickLogHabit_top}>
				<h2>{habit.habitName}</h2>
			</div>
			<div className={styles.QuickLogHabit_display}>
				<div className={styles.QuickLogHabit_display_main}>
					<MinusButton onClick={minus} />
					<DisplayValue
						value={todaysValue}
						onChange={handleManualEdit}
						onSave={saveManualEdit}
						originalValue={habit.habitsLogged}
					/>
					<AddButton onClick={add} />
				</div>
				<div className={styles.QuickLogHabit_display_unitDesc}>
					of {habit.habitTarget} {habit.habitUnit}
				</div>
			</div>
			<div className={styles.QuickLogHabit_options}>
				<div className={styles.QuickLogHabit_options_toggle}>
					<button
						type="button"
						onClick={toggleOptions}
						className={styles.QuickLogHabit_options_toggle_btn}
					>
						<span>{showOptions ? "Hide Options" : "Not for today?"}</span>
					</button>
				</div>
				{showOptions && (
					<LoggingOptions
						date={optionValues.date}
						time={optionValues.time}
						onChange={handleOptionChange}
					/>
				)}
			</div>
		</div>
	);
};

export default QuickLogHabit;
