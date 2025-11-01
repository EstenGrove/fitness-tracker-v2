import { useState } from "react";
import styles from "../../css/recent-activity/RangeSelector.module.scss";
import { ActivityRangeType } from "../../features/recent-activity/types";

type Props = {
	value: string;
	options?: OptionItem[];
	onSelect: (type: string) => void;
};

interface OptionItem {
	value: ActivityRangeType;
	label: string;
}

type OptionProps = {
	option: OptionItem;
	isSelected: boolean;
	onSelect: () => void;
};

const RangeOption = ({ option, onSelect, isSelected = false }: OptionProps) => {
	const { label } = option;
	const css = isSelected
		? `${styles.RangeOption} ${styles.isSelected}`
		: styles.RangeOption;
	return (
		<li className={css} onClick={onSelect}>
			<div>{label}</div>
		</li>
	);
};

const defaultOptions: OptionItem[] = [
	{ value: "DAY", label: "D" },
	{ value: "WEEK", label: "W" },
	{ value: "MONTH", label: "M" },
	{ value: "YEAR", label: "Y" },
];

const isSelected = (value: string, option: string) => {
	const valLower = value.toLowerCase();
	const optLower = option.toLowerCase();

	return valLower === optLower;
};

const RangeSelector = ({
	value = "Week",
	options = defaultOptions,
	onSelect,
}: Props) => {
	const [selection, setSelection] = useState<string>(value);

	const selectOption = (type: string) => {
		setSelection(type);

		return onSelect && onSelect(type);
	};

	return (
		<div className={styles.RangeSelector}>
			<div className={styles.RangeSelector_options}>
				{options &&
					options.map((option, idx) => {
						const key = option.value + idx;
						return (
							<RangeOption
								key={key}
								option={option}
								isSelected={isSelected(value, option.value)}
								onSelect={() => selectOption(option.value)}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default RangeSelector;
