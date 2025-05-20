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
	HabitLog,
	HabitLogValues,
	HabitSummary,
} from "../../features/habits/types";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import FadeIn from "../ui/FadeIn";
import {
	DeferredFetch,
	DeferredLog,
	useDeferredLogQueue,
} from "../../hooks/useDeferredLogQueue";
import { logHabitsBatched } from "../../utils/utils_habits";
import { prepareTimestamp } from "../../utils/utils_dates";
import { useBatchedHabitLogger } from "../../hooks/useBatchedHabitLogger";

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

const HabitLogger = ({ habit, summary, habitStep = 1 }: Props) => {
	const [todaysValue, setTodaysValue] = useState<number>(
		summary.totalLogged || 0
	);
	const { queueLog } = useBatchedHabitLogger(
		650,
		logHabitsBatched as DeferredFetch<HabitLogValues>
	);
	// const { queueLog } = useDeferredLogQueue(
	// 	600,
	// 	logHabitsBatched as DeferredFetch<HabitLogValues>
	// );

	const hitGoal = useMemo(() => {
		return hasHitGoal(todaysValue, habit);
	}, [todaysValue, habit]);

	const handleEdit = (value: number) => {
		setTodaysValue(value);

		const newLog = prepareHabitLog(value, habit);
		// queueLog(newLog as unknown as DeferredLog);
		queueLog(newLog);
	};

	const add = () => {
		const value = todaysValue + habitStep;
		setTodaysValue(value);

		const newLog = prepareHabitLog(habitStep, habit);
		// queueLog(newLog as unknown as DeferredLog);
		queueLog(newLog);
	};
	const minus = () => {
		const newValue = todaysValue - habitStep;
		const value = newValue >= 0 ? newValue : 0;
		setTodaysValue(value);

		const newLog = prepareHabitLog(-habitStep, habit);
		// queueLog(newLog as unknown as DeferredLog);
		queueLog(newLog);
	};

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
