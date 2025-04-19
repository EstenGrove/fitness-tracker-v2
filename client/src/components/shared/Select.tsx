import { ChangeEvent, ComponentPropsWithoutRef } from "react";
import styles from "../../css/shared/Select.module.scss";

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	name: string;
	id: string;
	value: string;
	defaultValue?: string;
	options: SelectOption[];
	onChange: (name: string, value: string) => void;
}

// @ts-expect-error: this is fine
interface Props extends SelectProps, ComponentPropsWithoutRef<"div"> {}

const Select = ({ name, id, value, options, onChange, ...rest }: Props) => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		return onChange && onChange(name, value);
	};

	return (
		<div className={styles.Select} {...rest}>
			<select
				name={name}
				id={id}
				className={styles.Select_select}
				onChange={handleChange}
				onSelect={handleChange}
				value={value}
			>
				{options &&
					options.map((item, idx) => (
						<option key={item.value + idx} value={item.value}>
							{item.label}
						</option>
					))}
			</select>
		</div>
	);
};

export default Select;
