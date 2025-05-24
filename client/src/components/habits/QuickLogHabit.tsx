import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/habits/QuickLogHabit.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { HabitCard, HabitLogValues } from "../../features/habits/types";
import { logHabitsBatched } from "../../utils/utils_habits";
import { DeferredFetch } from "../../hooks/useDeferredLogQueue";
import { useBatchedHabitLogger } from "../../hooks/useBatchedHabitLogger";
import { prepareTimestamp } from "../../utils/utils_dates";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

type Props = {
	habit: HabitCard;
};

const prepareHabitLog = (value: number, habit: HabitCard) => {
	const loggedAt = prepareTimestamp(new Date());
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
	onChange: (value: number) => void;
};
type DisplayInputProps = {
	habitValue: number;
	closeInput: () => void;
	onChange: (value: number) => void;
};

const DisplayInput = ({
	habitValue,
	onChange,
	closeInput,
}: DisplayInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useOutsideClick(inputRef, closeInput);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		return onChange(Number(value));
	};

	const selectText = (e: FocusEvent<HTMLInputElement>) => {
		e.currentTarget.select();
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
			className={styles.DisplayInput}
		/>
	);
};

const habitStep = 1;

const DisplayValue = ({ value = 0, onChange }: DisplayProps) => {
	const [showInput, setShowInput] = useState<boolean>(false);

	const openInput = () => {
		setShowInput(true);
	};
	const closeInput = () => {
		setShowInput(false);
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
					habitValue={value}
					onChange={onChange}
					closeInput={closeInput}
				/>
			)}
		</div>
	);
};

const QuickLogHabit = ({ habit }: Props) => {
	useLockBodyScroll();
	const [todaysValue, setTodaysValue] = useState<number>(
		habit.habitsLogged || 0
	);
	const { queueLog } = useBatchedHabitLogger(
		650,
		logHabitsBatched as DeferredFetch<HabitLogValues>
	);

	const handleEdit = (value: number) => {
		setTodaysValue(value);

		const newLog = prepareHabitLog(value, habit);
		queueLog(newLog);
	};

	const add = () => {
		const value = todaysValue + habitStep;
		setTodaysValue(value);

		const newLog = prepareHabitLog(habitStep, habit);
		queueLog(newLog);
	};
	const minus = () => {
		const newValue = todaysValue - habitStep;
		const value = newValue >= 0 ? newValue : 0;
		setTodaysValue(value);

		const newLog = prepareHabitLog(-habitStep, habit);
		queueLog(newLog);
	};

	return (
		<div className={styles.QuickLogHabit}>
			<div className={styles.QuickLogHabit_top}>
				<h2>{habit.habitName}</h2>
			</div>
			<div className={styles.QuickLogHabit_display}>
				<div className={styles.QuickLogHabit_display_main}>
					<MinusButton onClick={minus} />
					<DisplayValue value={todaysValue} onChange={handleEdit} />
					<AddButton onClick={add} />
				</div>
				<div className={styles.QuickLogHabit_display_unitDesc}>
					of {habit.habitTarget} {habit.habitUnit}
				</div>
			</div>
		</div>
	);
};

export default QuickLogHabit;
