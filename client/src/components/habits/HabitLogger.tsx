import {
	ChangeEvent,
	FocusEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/habits/HabitLogger.module.scss";
import {
	Habit,
	HabitLogValues,
	HabitSummary,
} from "../../features/habits/types";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { DeferredFetch } from "../../hooks/useDeferredLogQueue";
import { logHabitsBatched } from "../../utils/utils_habits";
import { prepareTimestamp } from "../../utils/utils_dates";
import { useBatchedHabitLogger } from "../../hooks/useBatchedHabitLogger";
import FadeIn from "../ui/FadeIn";

type Props = { habit: Habit; summary: HabitSummary; habitStep: number };

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
	const [value, setValue] = useState<number>(habitValue);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value: local } = e.target;

		setValue(Number(local));
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
		<div className={styles.DisplayInput}>
			<input
				type="number"
				name="value"
				id="value"
				inputMode="numeric"
				ref={inputRef}
				value={value}
				onChange={handleChange}
				onBlur={() => {
					onChange(habitValue - value);
					closeInput();
				}}
				onFocus={selectText}
				className={styles.DisplayInput_input}
			/>
		</div>
	);
};

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

const HitGoal = () => {
	return (
		<div className={styles.HitGoal}>
			<svg className={styles.HitGoal_icon}>
				<use xlinkHref={`${sprite}#icon-guarantee`}></use>
			</svg>
			<div className={styles.HitGoal_text}>You Hit Your Goal!!</div>
		</div>
	);
};

const hasHitGoal = (habitsLogged: number, habit: Habit) => {
	const { intent, habitTarget } = habit;
	const current = Number(habitsLogged);

	switch (intent) {
		case "BUILD": {
			return !!current && current >= habitTarget;
		}
		case "ELIMINATE": {
			return !!current && current === 0;
		}
		case "REDUCE": {
			return !!current && current < habitTarget;
		}
		case "LAPSE": {
			return !(current > 0);
		}

		default:
			return false;
	}
};

const prepareHabitLog = (value: number, habit: Habit) => {
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

// Previously 650
const batchDelay = 450;

const HabitLogger = ({ habit, summary, habitStep = 1 }: Props) => {
	const [todaysValue, setTodaysValue] = useState<number>(
		summary.totalLogged || 0
	);
	const { queueLog } = useBatchedHabitLogger(
		batchDelay,
		logHabitsBatched as DeferredFetch<HabitLogValues>
	);

	const hitGoal = useMemo(() => {
		return hasHitGoal(todaysValue, habit);
	}, [todaysValue, habit]);

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

	// Sync this change. DO not add 'todaysValue' to the deps
	useEffect(() => {
		if (summary?.totalLogged !== todaysValue) {
			setTodaysValue(summary?.totalLogged);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [summary?.totalLogged]);

	return (
		<div className={styles.HabitLogger}>
			<div className={styles.HabitLogger_display}>
				<div className={styles.HabitLogger_display_main}>
					<MinusButton onClick={minus} />
					<DisplayValue value={todaysValue} onChange={handleEdit} />
					<AddButton onClick={add} />
				</div>
				<div className={styles.HabitLogger_display_unitDesc}>
					of {habit.habitTarget} {habit.habitUnit}
				</div>
			</div>
			<div className={styles.HabitLogger_goal}>
				{hitGoal && (
					<FadeIn>
						<HitGoal />
					</FadeIn>
				)}
			</div>
		</div>
	);
};

export default HabitLogger;
