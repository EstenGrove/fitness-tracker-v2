import { ChangeEvent, MouseEvent, useState } from "react";
import styles from "../../css/shared/TimerInput.module.scss";

type Props = {
	name: string;
	value: number; // value in mins???
	onChange: (name: string, value: number) => void; // mins??
};

interface TimerState {
	hours: number;
	mins: number;
}

const convertToMins = (timerState: TimerState): number => {
	const { hours, mins } = timerState;
	const allMins = hours * 60 + mins;

	return allMins;
};

const getStateFromValue = (value: number): TimerState => {
	return {
		hours: Math.trunc(value >= 60 ? value / 60 : 0),
		mins: value >= 60 ? value % 60 : value,
	};
};

const selectTextOnFocus = (e: MouseEvent<HTMLInputElement>) => {
	const target = e.currentTarget as HTMLInputElement;

	if (target) {
		target.select();
	}
};

const TimerInput = ({ name, value, onChange }: Props) => {
	const initial = getStateFromValue(value);
	const [timer, setTimer] = useState<TimerState>(initial);

	const handleHours = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		setTimer({
			...timer,
			hours: Number(value),
		});
	};
	const handleMins = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const newMins = Number(value);

		if (newMins >= 60) {
			const asHrs = newMins / 60;
			const remainingMins = Math.trunc(newMins % 60);
			const newHours = Math.trunc(timer.hours + asHrs);

			setTimer({
				hours: newHours,
				mins: remainingMins,
			});

			const asMins: number = convertToMins({
				hours: newHours,
				mins: remainingMins,
			});

			return onChange && onChange(name, asMins);
		} else {
			const asMins: number = convertToMins({
				hours: timer.hours,
				mins: newMins,
			});

			setTimer({
				...timer,
				mins: newMins,
			});

			return onChange && onChange(name, asMins);
		}
	};

	const syncChanges = () => {
		const asMins = convertToMins(timer);

		return onChange && onChange(name, asMins);
	};

	return (
		<div className={styles.TimerInput}>
			<div className={styles.TimerInput_hrs}>
				<input
					type="number"
					name="hours"
					id="hours"
					value={timer.hours}
					onChange={handleHours}
					className={styles.TimerInput_hrs_input}
					inputMode="numeric"
					onClick={selectTextOnFocus}
					onBlur={syncChanges}
				/>
				<span>hrs.</span>
			</div>
			<div className={styles.TimerInput_mins}>
				<input
					type="number"
					name="mins"
					id="mins"
					value={timer.mins}
					onChange={handleMins}
					className={styles.TimerInput_mins_input}
					inputMode="numeric"
					onClick={selectTextOnFocus}
				/>
				<span>mins.</span>
			</div>
		</div>
	);
};

export default TimerInput;
