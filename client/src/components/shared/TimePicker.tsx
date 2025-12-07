import {
	ChangeEvent,
	ComponentPropsWithoutRef,
	RefObject,
	useRef,
	useState,
} from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/TimePicker.module.scss";
import { parseAnyTime } from "../../utils/utils_dates";
import { format, getHours, getMinutes } from "date-fns";

type TodVals = "AM" | "PM";

interface TimeVals {
	hours: string;
	mins: string;
	tod: TodVals;
}

type InputProps = {
	value: string;
	onChange: (name: string, value: string) => void;
	inputRef: RefObject<HTMLInputElement | null>;
};
type SelectProps = {
	value: string;
	onChange: (name: string, value: string) => void;
	inputRef: RefObject<HTMLSelectElement | null>;
};

const HoursInput = ({ value, onChange, inputRef }: InputProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const minsValue = e.target.value;

		return onChange("hours", minsValue);
	};

	return (
		<input
			ref={inputRef}
			type="text"
			name="hours"
			id="hours"
			value={value}
			inputMode="decimal"
			className={styles.HoursInput}
			onChange={handleChange}
			onContextMenu={(e) => e.preventDefault()}
			onFocus={() => {
				if (inputRef.current) {
					inputRef.current.select();
				}
			}}
		/>
	);
};
const MinsInput = ({ value, onChange, inputRef }: InputProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const minsValue = e.target.value;

		return onChange("mins", minsValue);
	};

	return (
		<input
			ref={inputRef}
			type="text"
			name="mins"
			id="mins"
			value={value}
			inputMode="decimal"
			className={styles.MinsInput}
			onChange={handleChange}
			onContextMenu={(e) => e.preventDefault()}
			onFocus={() => {
				if (inputRef.current) {
					inputRef.current.select();
				}
			}}
		/>
	);
};
const TodInput = ({ value, onChange, inputRef }: SelectProps) => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const val = e.target.value;

		return onChange("tod", val);
	};
	return (
		<div className={styles.TodInput}>
			<select
				name="tod"
				id="tod"
				value={value}
				onChange={handleChange}
				className={styles.TodInput_select}
				ref={inputRef}
				onContextMenu={(e) => e.preventDefault()}
			>
				<option value="AM" className={styles.TodInput_select_option}>
					AM
				</option>
				<option value="PM" className={styles.TodInput_select_option}>
					PM
				</option>
			</select>
		</div>
	);
};

const getTimeFromState = (time: TimeVals) => {
	const { hours, mins, tod } = time;

	const newTime = `${hours}:${mins} ${tod}`;

	return newTime;
};

const getInitialState = (initialTime: string): TimeVals => {
	const parsed = parseAnyTime(initialTime);
	const formatted = format(parsed, "h:mm a");

	const hrs = getHours(parsed);
	const mins = getMinutes(parsed);
	const tod = formatted.split(/(AM|PM)/g)[1].trim();
	const newHrs = hrs > 12 ? hrs - 12 : hrs;
	const paddedHrs = newHrs < 10 ? "0" + newHrs : newHrs;
	const paddedMins = mins < 10 ? "0" + mins : mins;

	return {
		hours: String(paddedHrs),
		mins: String(paddedMins),
		tod: tod as TodVals,
	};
};

type TimeProps = {
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
};

// @ts-expect-error: this is fine
interface Props extends TimeProps, ComponentPropsWithoutRef<"div"> {}

const TimePicker = ({ name, value, onChange, ...rest }: Props) => {
	const hoursRef = useRef<HTMLInputElement>(null);
	const minsRef = useRef<HTMLInputElement>(null);
	const todRef = useRef<HTMLSelectElement>(null);

	const [time, setTime] = useState<TimeVals>({
		...getInitialState(value),
	});

	const selectHours = (_: string, value: string) => {
		const num: number = Number(value);
		if (isNaN(num)) return;

		if (num >= 2) {
			const newVal = num < 10 ? "0" + num : value;
			setTime({
				...time,
				hours: newVal,
			});
			const newTime = getTimeFromState({
				...time,
				hours: newVal,
			});
			onChange(name, newTime);
			return goToMins();
		}

		setTime({
			...time,
			hours: value,
		});
	};

	const selectMins = (_: string, value: string) => {
		const num: number = Number(value);
		if (isNaN(num)) return;
		if (num > 59) return;

		setTime({
			...time,
			mins: value,
		});

		const newTime = getTimeFromState({
			...time,
			mins: value,
		});
		onChange(name, newTime);
		// return goToTod();
		return;
	};

	const selectTod = (_: string, value: string) => {
		setTime({
			...time,
			tod: value as TodVals,
		});

		const newTime = getTimeFromState({
			...time,
			tod: value as TodVals,
		});

		return onChange(name, newTime);
	};

	const goToMins = () => {
		// focus mins input
		if (minsRef.current) {
			minsRef.current.focus();
			minsRef.current.select();
		}
	};

	return (
		<div className={styles.TimePicker} {...rest}>
			<div className={styles.TimePicker_display}>
				<HoursInput
					key="Hours"
					value={time.hours}
					inputRef={hoursRef}
					onChange={selectHours}
				/>
				<span>:</span>
				<MinsInput
					key="Minutes"
					inputRef={minsRef}
					value={time.mins}
					onChange={selectMins}
				/>
				<TodInput
					key="Time of Day"
					inputRef={todRef}
					value={time.tod}
					onChange={selectTod}
				/>
				<svg className={styles.TimePicker_display_icon}>
					<use xlinkHref={`${sprite}#icon-access_time`}></use>
				</svg>
			</div>
		</div>
	);
};

export default TimePicker;
