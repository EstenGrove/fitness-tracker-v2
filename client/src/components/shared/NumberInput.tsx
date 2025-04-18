import {
	ChangeEvent,
	ComponentPropsWithRef,
	MouseEvent,
	RefObject,
} from "react";
import styles from "../../css/shared/NumberInput.module.scss";

type InputMode =
	| "search"
	| "text"
	| "none"
	| "tel"
	| "url"
	| "email"
	| "numeric"
	| "decimal"
	| undefined;

interface InputProps {
	id?: string;
	name: string;
	value: string | number;
	onChange: (name: string, value: string | number) => void;
	inputRef?: RefObject<HTMLInputElement>;
	min?: number;
	max?: number;
	inputMode?: InputMode;
}

// @ts-expect-error: Extends input's props to support forwarding via ...rest
interface Props extends InputProps, ComponentPropsWithRef<"input"> {}

const selectTextOnFocus = (e: MouseEvent<HTMLInputElement>) => {
	const target = e.currentTarget as HTMLInputElement;

	if (target) {
		target.select();
	}
};

const NumberInput = ({
	id,
	name,
	value,
	onChange,
	inputRef,
	min,
	max,
	inputMode = "numeric",
	...rest
}: Props) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const num = Number(value);

		if (min || max) {
			let val = num;
			const hasMin = !!min;
			const hasMax = !!max;

			if (hasMin && num < min) val = min;
			if (hasMax && num > max) val = max;

			return onChange && onChange(name, val);
		}

		return onChange && onChange(name, value);
	};

	return (
		<div className={styles.NumberInput} {...rest}>
			<input
				ref={inputRef}
				type="number"
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				className={styles.NumberInput_input}
				min={min}
				max={max}
				inputMode={inputMode}
				onClick={selectTextOnFocus}
				{...rest}
			/>
		</div>
	);
};

export default NumberInput;
