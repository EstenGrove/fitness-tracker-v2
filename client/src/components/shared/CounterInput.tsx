import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/CounterInput.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	name: string;
	id: string;
	value: number;
	step?: number;
	min?: number;
	max?: number;
	onChange: (name: string, value: number) => void;
};

type HiddenInputProps = {
	name: string;
	id: string;
	value: number;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	hideInput: () => void;
};

const HiddenInput = ({
	value,
	name,
	handleChange,
	hideInput,
}: HiddenInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useOutsideClick(inputRef, hideInput);

	const onKeyDown = (e: KeyboardEvent) => {
		const key = e.key;

		if (key === "Enter") {
			hideInput();
		}
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

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
			name={name}
			id={name}
			value={value}
			onChange={handleChange}
			onKeyDown={onKeyDown}
			onBlur={hideInput}
			className={styles.CounterInput_value_input}
			inputMode="decimal"
		/>
	);
};

const CounterInput = ({
	name,
	value,
	min = 0,
	max = 100,
	step = 1,
	onChange,
}: Props) => {
	const [showInput, setShowInput] = useState<boolean>(false);
	const isMinusDisabled: boolean = min !== null && value <= (min as number);
	const isPlusDisabled: boolean = !!max && value >= max;

	const decrement = () => {
		const next = value - step;
		const newValue: number = Math.max(next, min);

		return onChange && onChange(name, newValue);
	};
	const increment = () => {
		const next = value + step;
		const newValue: number = Math.min(next, max);

		return onChange && onChange(name, newValue);
	};

	const openInput = () => {
		setShowInput(true);
	};
	const closeInput = () => {
		setShowInput(false);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		return onChange && onChange(name, Number(value));
	};

	return (
		<div className={styles.CounterInput}>
			<button
				type="button"
				onClick={decrement}
				className={styles.CounterInput_minus}
				disabled={isMinusDisabled}
			>
				<svg className={styles.CounterInput_minus_icon}>
					<use xlinkHref={`${sprite}#icon-remove`}></use>
				</svg>
			</button>
			<div className={styles.CounterInput_value} onClick={openInput}>
				{!showInput && (
					<div tabIndex={0} onFocus={openInput}>
						{value}
					</div>
				)}
				{showInput && (
					<HiddenInput
						name={name}
						id={name}
						value={value}
						handleChange={handleChange}
						hideInput={closeInput}
					/>
				)}
			</div>
			<button
				type="button"
				onClick={increment}
				className={styles.CounterInput_add}
				disabled={isPlusDisabled}
			>
				<svg className={styles.CounterInput_add_icon}>
					<use xlinkHref={`${sprite}#icon-add`}></use>
				</svg>
			</button>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default CounterInput;
