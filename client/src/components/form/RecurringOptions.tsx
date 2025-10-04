import { useState } from "react";
import styles from "../../css/form/RecurringOptions.module.scss";
import {
	getFrequencyLabel,
	getMonthDaySuffix,
	RecurringValues,
	REPEAT_TYPE_OPTIONS,
} from "../../utils/utils_recurring";
import { MONTHS, WEEK_DAYS } from "../../utils/utils_dates";
import Select from "../shared/Select";
import NumberInput from "../shared/NumberInput";
import DatePicker from "../shared/DatePicker";
import { CreateWorkoutValues } from "../../features/workouts/types";

type Props = {
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | number | Date) => void;
	values: RecurringValues;
};
type WeekDayProps = {
	day: string;
	isSelected: boolean;
	onClick: () => void;
};
type FreqAndIntervalProps = {
	values: RecurringValues;
	onSelect: (name: string, value: string) => void;
	onChange: (name: string, value: string | number) => void;
};
// (Daily, Weekly, Monthly, Yearly )Options' props
type FreqOptionsProps = {
	values: RecurringValues;
	onChange: (name: string, value: number | string) => void;
	onSelect: (name: string, value: string | number | Date) => void;
};

// ['Su', 'Mo', ...]
const weekDays = [...WEEK_DAYS].map((day) => day.slice(0, 2));
// { value, label}

// { value, label}
const monthOpts = MONTHS.map((month, idx) => ({
	value: String(idx),
	label: month,
}));

const WeeklyOptions = ({ values, onSelect }: FreqOptionsProps) => {
	return (
		<div className={styles.WeeklyOptions}>
			<span>On</span>
			<div className={styles.WeeklyOptions_days}>
				{weekDays &&
					weekDays.map((day, idx) => (
						<WeekDay
							key={day + idx}
							day={day}
							isSelected={values.byDay.includes(day)}
							onClick={() => onSelect("byDay", day)}
						/>
					))}
			</div>
		</div>
	);
};
const MonthlyOptions = ({ values, onChange }: FreqOptionsProps) => {
	const { byMonthDay } = values;
	const monthSuffix = getMonthDaySuffix(byMonthDay as number);
	return (
		<div className={styles.MonthlyOptions}>
			{/* on day:  */}
			<span>On the </span>
			<NumberInput
				name="byMonthDay"
				id="byMonthDay"
				min={1}
				max={31}
				onChange={onChange}
				value={byMonthDay}
			/>
			<span>
				<b>{monthSuffix}</b> of the month
			</span>
		</div>
	);
};
const YearlyOptions = ({ values, onSelect, onChange }: FreqOptionsProps) => {
	const { byMonth, byMonthDay } = values;
	const monthSuffix = getMonthDaySuffix(byMonthDay as number);

	const handleMonthChoice = (_: string, value: string) => {
		onSelect("byMonth", Number(value));
	};

	return (
		<div className={styles.YearlyOptions}>
			<div className={styles.YearlyOptions_months}>
				<div>Every </div>
				<Select
					name="byMonth"
					id="byMonth"
					onChange={handleMonthChoice}
					value={String(byMonth)}
					options={monthOpts}
				/>
			</div>
			<div className={styles.YearlyOptions_row}>
				{/* on day:  */}
				<span>On the </span>
				<NumberInput
					name="byMonthDay"
					id="byMonthDay"
					min={1}
					max={31}
					onChange={onChange}
					value={byMonthDay}
				/>
				<span>
					<b>{monthSuffix}</b> of the month
				</span>
			</div>
		</div>
	);
};
const FreqAndInterval = ({
	values,
	onChange,
	onSelect,
}: FreqAndIntervalProps) => {
	const { frequency, interval } = values;
	const label = getFrequencyLabel(frequency, interval as number);

	return (
		<div className={styles.FreqAndInterval}>
			<Select
				name="frequency"
				id="frequency"
				value={values.frequency}
				onChange={onSelect}
				options={REPEAT_TYPE_OPTIONS}
				style={{ width: "11rem" }}
			/>

			<span> every</span>
			<NumberInput
				name="interval"
				id="interval"
				value={values.interval}
				onChange={onChange}
				min={1}
				style={{ width: "5rem" }}
			/>
			<span>{label}</span>
		</div>
	);
};
const WeekDay = ({ day, onClick, isSelected = false }: WeekDayProps) => {
	const css = {
		backgroundColor: isSelected
			? "rgba(0, 124, 255, 0.1)"
			: "var(--bg-foreground)",
		color: isSelected ? "var(--accent-blue)" : "#fff",
		borderColor: isSelected ? "var(--accent-blue)" : "var(--blueGrey800)",
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
// On date => endDate
// After => after X occurrences
// Never => no end date
type EndsOnType = "On date" | "After" | "Never";

const EndsOn = ({ values, onSelect, onChange }: FreqOptionsProps) => {
	const [endsOn, setEndsOn] = useState<EndsOnType>("Never");
	const [afterXOcurrences, setAfterXOccurrences] = useState<number>(1);

	const handleEndsOn = (_: string, value: string) => {
		setEndsOn(value as EndsOnType);
	};
	const handleAfter = (_: string, value: string | number) => {
		setAfterXOccurrences(Number(value));
	};

	const options = [
		{ value: "On date", label: "On date" },
		{ value: "After", label: "After" },
		{ value: "Never", label: "Never" },
	];

	return (
		<div className={styles.EndsOn}>
			<div className={styles.EndsOn_top}>
				<span>Ends: </span>
				<Select
					name="endsOn"
					id="endsOn"
					value={endsOn}
					onChange={handleEndsOn}
					options={options}
					style={{ width: "17rem" }}
				/>
			</div>
			<div className={styles.EndsOn_bottom}>
				{endsOn === "On date" && (
					<div className={styles.EndsOn_bottom_after}>
						<span>ends on</span>
						<DatePicker
							name="endDate"
							id="endDate"
							value={values.endDate as string}
							onSelect={onSelect}
							onChange={onChange}
						/>
					</div>
				)}
				{endsOn === "After" && (
					<div className={styles.EndsOn_bottom_after}>
						<span>after</span>
						<NumberInput
							name="after"
							id="after"
							value={afterXOcurrences}
							onChange={handleAfter}
							style={{ width: "4ch" }}
						/>
						<span>occurrences{afterXOcurrences >= 2 ? "s" : ""}</span>
					</div>
				)}
			</div>
		</div>
	);
};

const RecurringOptions = ({ values, onChange, onSelect }: Props) => {
	const { frequency } = values;
	return (
		<div className={styles.RecurringOptions}>
			<div className={styles.RecurringOptions_title}>Repeat</div>
			<div className={styles.RecurringOptions_row}>
				<FreqAndInterval
					values={values}
					onChange={onChange}
					onSelect={onSelect}
				/>
			</div>
			<div className={styles.RecurringOptions_options}>
				{frequency === "Weekly" && (
					<WeeklyOptions
						values={values}
						onChange={onChange}
						onSelect={onSelect}
					/>
				)}
				{frequency === "Monthly" && (
					<MonthlyOptions
						values={values}
						onChange={onChange}
						onSelect={onSelect}
					/>
				)}
				{frequency === "Yearly" && (
					<YearlyOptions
						values={values}
						onChange={onChange}
						onSelect={onSelect}
					/>
				)}
			</div>
			<div className={styles.RecurringOptions_endsOn}>
				<EndsOn values={values} onChange={onChange} onSelect={onSelect} />
			</div>
		</div>
	);
};

export default RecurringOptions;
