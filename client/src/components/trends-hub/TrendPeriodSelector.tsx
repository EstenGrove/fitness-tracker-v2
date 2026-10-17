import styles from "../../css/trends-hub/TrendPeriodSelector.module.scss";
import { TrendPeriodKey } from "../../features/trends-hub/types";
import { TREND_PERIODS } from "../../utils/utils_trendsHub";

type Props = {
	period: TrendPeriodKey;
	onChange: (period: TrendPeriodKey) => void;
};

// Segmented control for the trends period (used on the hub & detail pages)
const TrendPeriodSelector = ({ period, onChange }: Props) => {
	return (
		<div className={styles.TrendPeriodSelector} role="radiogroup">
			{TREND_PERIODS.map((option) => {
				const isSelected = option.key === period;
				return (
					<button
						key={option.key}
						type="button"
						role="radio"
						aria-checked={isSelected}
						className={styles.TrendPeriodSelector_option}
						data-selected={isSelected}
						onClick={() => onChange(option.key)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
};

export default TrendPeriodSelector;
