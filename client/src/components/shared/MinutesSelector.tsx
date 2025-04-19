import { useState } from "react";
import styles from "../../css/shared/MinutesSelector.module.scss";
import TimerInput from "./TimerInput";

type Props = {
	name?: string;
	minutes: number;
	onSelect: (name: string, value: number) => void;
	options?: Array<number>;
};
type QuickOptProps = {
	isSelected: boolean;
	minsOption: number;
	onSelect: () => void;
	isDisabled?: boolean;
};
type OtherOptProps = {
	isSelected: boolean;
	onSelect: () => void;
	isDisabled?: boolean;
};
const QuickOption = ({
	isSelected = false,
	minsOption,
	onSelect,
	isDisabled = false,
}: QuickOptProps) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={isDisabled}
			className={`${styles.QuickOption} ${isSelected ? styles.isSelected : ""}`}
		>
			{minsOption}
			<span>m</span>
		</button>
	);
};
const OtherOption = ({
	onSelect,
	isDisabled = false,
	isSelected = false,
}: OtherOptProps) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={isDisabled}
			className={`${styles.OtherOption} ${isSelected ? styles.isSelected : ""}`}
		>
			Other
		</button>
	);
};

// Default minutes options
const defaultOptions = [5, 10, 15, 20, 25, 30];

const MinutesSelector = ({
	name = "mins",
	minutes,
	onSelect,
	options = defaultOptions,
}: Props) => {
	const [showOther, setShowOther] = useState<boolean>(false);

	const toggleOther = () => {
		setShowOther(!showOther);
	};

	return (
		<div className={styles.MinutesSelector}>
			<div className={styles.MinutesSelector_quickOptions}>
				{options &&
					options.map((mins, idx) => (
						<QuickOption
							key={`${idx}-${mins}`}
							minsOption={mins}
							onSelect={() => onSelect(name, mins)}
							isDisabled={showOther}
							isSelected={minutes === mins && !showOther}
						/>
					))}
				<OtherOption
					key="Other"
					onSelect={toggleOther}
					isSelected={showOther}
				/>
			</div>
			{showOther && (
				<div className={styles.MinutesSelector_otherOptions}>
					<TimerInput name={name} value={minutes} onChange={onSelect} />
				</div>
			)}
		</div>
	);
};

export default MinutesSelector;
