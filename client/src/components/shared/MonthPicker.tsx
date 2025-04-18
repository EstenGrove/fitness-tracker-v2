import { useMemo, useRef, useState } from "react";
import sprite from "../../assets/icons/calendar2.svg";
import styles from "../../css/shared/MonthPicker.module.scss";
import { MONTHS as monthOptions, MONTHS } from "../../utils/utils_dates";
import { addYears, subYears } from "date-fns";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	name: string;
	id?: string;
	value: Date | string;
	onSelect: (name: string, value: Date) => void;
	enableFocusMode?: boolean;
};
type CurrentDisplayProps = {
	currentYear: number;
};
type MonthsDropdownProps = {
	currentYear: number;
	currentMonth: number;
	selectMonth: (month: number) => void;
	goToPrev: () => void;
	goToNext: () => void;
	close: () => void;
	focusMode: boolean;
};
type MonthOptionProps = {
	month: string;
	isSelected: boolean;
	selectMonth: () => void;
};
type NavProps = {
	goToPrev: () => void;
	goToNext: () => void;
};

const CurrentYear = ({ currentYear }: CurrentDisplayProps) => {
	return (
		<div className={styles.CurrentYear}>
			<div className={styles.CurrentYear_year}>{currentYear || 2024}</div>
		</div>
	);
};

const MonthOption = ({
	month,
	isSelected = false,
	selectMonth,
}: MonthOptionProps) => {
	return (
		<button
			type="button"
			onClick={selectMonth}
			className={styles.MonthOption}
			data-selected-month={isSelected}
		>
			{month}
		</button>
	);
};

const PickerNavButtons = ({ goToNext, goToPrev }: NavProps) => {
	return (
		<div className={styles.PickerNavButtons}>
			<button
				type="button"
				onClick={goToPrev}
				className={styles.PickerNavButtons_prev}
			>
				<svg className={styles.PickerNavButtons_prev_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_left`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={goToNext}
				className={styles.PickerNavButtons_next}
			>
				<svg className={styles.PickerNavButtons_next_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</button>
		</div>
	);
};

type MonthItem = {
	month: string;
	idx: number;
};
const isSelectedMonth = (item: MonthItem, selected: SelectedState) => {
	const { idx } = item;
	const isMatch = idx === selected.month;

	return isMatch;
};

const MonthsDropdown = ({
	currentYear,
	currentMonth,
	selectMonth,
	goToNext,
	goToPrev,
	close,
	focusMode = true,
}: MonthsDropdownProps) => {
	const optionsRef = useRef<HTMLDivElement>(null);
	useOutsideClick(optionsRef, close);
	return (
		<div
			ref={optionsRef}
			className={`${styles.MonthsDropdown} ${focusMode && styles.focusMode}`}
		>
			<div className={styles.MonthsDropdown_header}>
				<CurrentYear currentYear={currentYear} />
				<PickerNavButtons goToNext={goToNext} goToPrev={goToPrev} />
			</div>
			<div className={styles.MonthsDropdown_months}>
				{monthOptions.map((month: string, idx: number) => {
					const monthItem = { month, idx };
					const selected = { month: currentMonth, year: currentYear };
					return (
						<MonthOption
							key={`${idx}:${month}`}
							month={month}
							selectMonth={() => selectMonth(idx)}
							isSelected={isSelectedMonth(monthItem, selected)}
						/>
					);
				})}
			</div>
		</div>
	);
};

interface PickerState {
	month: number;
	year: number;
}
interface SelectedState {
	month: number;
	year: number;
}

const createBaseDate = (state: PickerState) => {
	const date = new Date(state.year, state.month, 1);

	return date;
};

const MonthPicker = ({
	name,
	id,
	value = new Date(),
	onSelect,
	enableFocusMode = true,
}: Props) => {
	const [showDropdown, setShowDropdown] = useState(false);
	// month is zero-based
	const [selection, setSelection] = useState<SelectedState>({
		month: new Date(value).getMonth(),
		year: new Date(value).getFullYear(),
	});

	const monthDisplay = useMemo(() => {
		const display = MONTHS[selection.month] + " " + selection.year;
		return display;
	}, [selection.month, selection.year]);

	const selectMonth = (month: number) => {
		const year = selection.year;
		setSelection({
			month: month,
			year: year,
		});

		const baseDate = createBaseDate({ month, year });

		return onSelect && onSelect(name, baseDate);
	};

	const goToPrev = () => {
		const baseDate = createBaseDate(selection);
		const prevDate = subYears(baseDate, 1);

		setSelection({
			month: prevDate.getMonth(),
			year: prevDate.getFullYear(),
		});
	};
	const goToNext = () => {
		const baseDate = createBaseDate(selection);
		const nextDate = addYears(baseDate, 1);

		setSelection({
			month: nextDate.getMonth(),
			year: nextDate.getFullYear(),
		});
	};

	const openDropdown = () => {
		setShowDropdown(true);
	};
	const closeDropdown = () => {
		setShowDropdown(false);
	};

	return (
		<div className={styles.MonthPicker}>
			<div className={styles.MonthPicker_inputWrapper}>
				<input
					type="text"
					name={name}
					id={id}
					value={monthDisplay}
					readOnly
					className={styles.MonthPicker_inputWrapper_input}
				/>
				<button
					type="button"
					onClick={openDropdown}
					className={styles.MonthPicker_inputWrapper_button}
				>
					<svg className={styles.MonthPicker_inputWrapper_button_icon}>
						<use xlinkHref={`${sprite}#icon-calendar_today`}></use>
					</svg>
				</button>

				{showDropdown && (
					<MonthsDropdown
						goToNext={goToNext}
						goToPrev={goToPrev}
						close={closeDropdown}
						selectMonth={selectMonth}
						currentYear={selection.year}
						currentMonth={selection.month}
						focusMode={enableFocusMode}
					/>
				)}
			</div>
		</div>
	);
};

export default MonthPicker;
