import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/habits/HabitLogger.module.scss";
import { HabitCardInfo } from "../../features/habits/types";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLongPressInterval } from "../../hooks/useLongPressInterval";
import FadeIn from "../ui/FadeIn";

type Props = { habit: HabitCardInfo; habitStep: number };

const MinusButton = ({ onClick }: { onClick: () => void }) => {
	const handlers = useLongPressInterval({
		delay: 300,
		interval: 100,
		onPress: onClick,
	});
	return (
		<button
			type="button"
			{...handlers}
			onClick={onClick}
			className={styles.MinusButton}
		>
			<svg className={styles.MinusButton_icon}>
				<use xlinkHref={`${sprite}#icon-minus`}></use>
			</svg>
		</button>
	);
};
const AddButton = ({ onClick }: { onClick: () => void }) => {
	const handlers = useLongPressInterval({
		delay: 300,
		interval: 100,
		onPress: onClick,
	});
	return (
		<button
			type="button"
			{...handlers}
			onClick={onClick}
			className={styles.AddButton}
		>
			<svg className={styles.AddButton_icon}>
				<use xlinkHref={`${sprite}#icon-plus-math`}></use>
			</svg>
		</button>
	);
};

type DisplayProps = {
	value: number;
	onChange: (value: number) => void;
	hitGoal: boolean;
};
type DisplayInputProps = {
	habitValue: number;
	closeInput: () => void;
	onChange: (value: number) => void;
	hitGoal: boolean;
};

const DisplayInput = ({
	habitValue,
	onChange,
	closeInput,
	hitGoal,
}: DisplayInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useOutsideClick(inputRef, closeInput);
	const css = { color: hitGoal ? "var(--accent-green)" : "initial" };

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		return onChange(Number(value));
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
			ref={inputRef}
			type="number"
			name="value"
			id="value"
			inputMode="numeric"
			value={habitValue}
			onChange={handleChange}
			className={styles.DisplayInput}
			style={css}
			// onFocus={(el) => el.currentTarget.select()}
		/>
	);
};

const DisplayValue = ({
	value = 0,
	onChange,
	hitGoal = false,
}: DisplayProps) => {
	const [showInput, setShowInput] = useState<boolean>(false);
	const css = {
		color: hitGoal ? "var(--accent-green)" : "var(--habitDisplay)",
	};

	const openInput = () => {
		setShowInput(true);
	};
	const closeInput = () => {
		setShowInput(false);
	};

	return (
		<div className={styles.DisplayValue}>
			{!showInput && (
				<div
					className={styles.DisplayValue_text}
					onClick={openInput}
					style={css}
				>
					{value}
				</div>
			)}
			{showInput && (
				<DisplayInput
					hitGoal={hitGoal}
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

const hasHitGoal = (habitsLogged: number, habit: HabitCardInfo) => {
	const { intent, habitTarget } = habit;
	const current = Number(habitsLogged);

	switch (intent) {
		case "BUILD": {
			return current >= habitTarget;
		}
		case "ELIMINATE": {
			return current === 0;
		}
		case "REDUCE": {
			return current < habitTarget;
		}
		case "LAPSE": {
			return !(current > 0);
		}

		default:
			return false;
	}
};

const HabitLogger = ({ habit, habitStep = 1 }: Props) => {
	const [todaysValue, setTodaysValue] = useState<number>(
		habit.habitsLogged || 0
		// 10
	);
	const hitGoal = useMemo(() => {
		return hasHitGoal(todaysValue, habit);
		// return true;
	}, [todaysValue, habit]);

	const handleEdit = (value: number) => {
		setTodaysValue(value);
	};

	const add = () => {
		setTodaysValue(todaysValue + habitStep);
	};
	const minus = () => {
		const newValue = todaysValue - habitStep;
		setTodaysValue(newValue >= 0 ? newValue : 0);
	};

	return (
		<div className={styles.HabitLogger}>
			<div className={styles.HabitLogger_display}>
				<div className={styles.HabitLogger_display_main}>
					<MinusButton onClick={minus} />
					<DisplayValue
						hitGoal={hitGoal}
						value={todaysValue}
						onChange={handleEdit}
					/>
					<AddButton onClick={add} />
				</div>
				<div className={styles.HabitLogger_display_unitDesc}>
					of 10 {habit.habitUnit}
				</div>
			</div>
			<div className={styles.HabitLogger_goal}>
				{/*  */}
				{hitGoal && (
					<FadeIn>
						<HitGoal />
					</FadeIn>
				)}
				{/*  */}
			</div>
		</div>
	);
};

export default HabitLogger;
