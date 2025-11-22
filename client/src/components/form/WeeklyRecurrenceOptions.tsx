import styles from "../../css/form/WeeklyRecurrenceOptions.module.scss";
import { WEEK_DAYS } from "../../utils/utils_dates";

type WeeklyVals = {
	byDay: string[];
} & Record<string, string | number | Date | string[] | number[] | Date[]>;

type Props = {
	name?: string;
	values: WeeklyVals;
	onSelect: (name: string, value: string) => void;
};

const dayColors = {
	bgSelected: "rgba(0, 124, 255, 0.1)",
	bgUnselected: "var(--bg-foreground)",
	colorSelected: "var(--accent-blue)",
	colorUnselected: "#fff",
	borderSelected: "var(--accent-blue)",
	borderUnselected: "var(--blueGrey800)",
};

const colors = {
	bg: dayColors.bgSelected,
	bgPlain: dayColors.bgUnselected,
	blue: dayColors.colorSelected,
	white: dayColors.colorUnselected,
	border: dayColors.borderUnselected,
};

// ['Su', 'Mo', ...]
const weekDays: string[] = [...WEEK_DAYS].map((day) => day.slice(0, 2));

type WeekDayProps = {
	day: string;
	onClick: () => void;
	isSelected: boolean;
};

const WeekDay = ({ day, onClick, isSelected = false }: WeekDayProps) => {
	const css = {
		backgroundColor: isSelected ? colors.bg : colors.bgPlain,
		color: isSelected ? colors.blue : colors.white,
		borderColor: isSelected ? colors.blue : colors.border,
	};
	return (
		<button
			type="button"
			onClick={onClick}
			className={styles.WeekDay}
			style={css}
		>
			{day}
		</button>
	);
};

const WeeklyRecurrenceOptions = ({
	name = "byDay",
	values,
	onSelect,
}: Props) => {
	return (
		<div className={styles.WeeklyRecurrenceOptions}>
			<div className={styles.WeeklyRecurrenceOptions_every}>On:</div>
			<div className={styles.WeeklyRecurrenceOptions_days}>
				{weekDays &&
					weekDays.map((day, idx) => (
						<WeekDay
							key={day + idx}
							day={day}
							isSelected={values.byDay.includes(day)}
							onClick={() => onSelect(name, day)}
						/>
					))}
			</div>
		</div>
	);
};

export default WeeklyRecurrenceOptions;
