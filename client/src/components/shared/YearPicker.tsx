import { useRef, useState } from "react";
import sprite from "../../assets/icons/calendar2.svg";
import styles from "../../css/shared/YearPicker.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	name: string;
	id?: string;
	value: number;
	onSelect: (name: string, value: number) => void;
};
type YearOptionProps = {
	year: number;
	isSelected: boolean;
	selectYear: () => void;
};
type YearDropdownProps = {
	currentYear: number;
	selectYear: (year: number) => void;
	goToPrev: () => void;
	goToNext: () => void;
	close: () => void;
};
type CurrentDisplayProps = {
	currentYear: number;
};
type NavProps = {
	goToPrev: () => void;
	goToNext: () => void;
	isPrevDisabled: boolean;
	isNextDisabled: boolean;
};

const CurrentYear = ({ currentYear }: CurrentDisplayProps) => {
	return (
		<div className={styles.CurrentYear}>
			<div className={styles.CurrentYear_year}>{currentYear || 2024}</div>
		</div>
	);
};

const YearOption = ({
	year,
	isSelected = false,
	selectYear,
}: YearOptionProps) => {
	return (
		<button
			type="button"
			onClick={selectYear}
			className={styles.YearOption}
			data-selected-year={isSelected}
		>
			{year}
		</button>
	);
};

const PickerNavButtons = ({
	goToNext,
	goToPrev,
	isPrevDisabled,
	isNextDisabled,
}: NavProps) => {
	return (
		<div className={styles.PickerNavButtons}>
			<button
				type="button"
				onClick={goToPrev}
				className={styles.PickerNavButtons_prev}
				disabled={isPrevDisabled}
			>
				<svg className={styles.PickerNavButtons_prev_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_left`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={goToNext}
				className={styles.PickerNavButtons_next}
				disabled={isNextDisabled}
			>
				<svg className={styles.PickerNavButtons_next_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</button>
		</div>
	);
};

const getRangeOfYears = (range: number = 10): number[] => {
	const currentYear: number = new Date().getFullYear();
	const years: number[] = [];

	for (let i = 0; i <= range; i++) {
		const year = currentYear - i;
		years.push(year);
	}

	return years;
};

// Range: 2014-2024 => 2014
const getFirstYrOfRange = (range: number = 10) => {
	const thisYear = new Date().getFullYear();
	const lastOfRange = thisYear - range;

	return lastOfRange;
};
// Range: 2014-2024 => 2024
const getLastYrOfRange = () => {
	const thisYear = new Date().getFullYear();
	return thisYear;
};

const YearsDropdown = ({
	currentYear,
	selectYear,
	goToNext,
	goToPrev,
	close,
}: YearDropdownProps) => {
	const optionsRef = useRef<HTMLDivElement>(null);
	useOutsideClick(optionsRef, close);
	const years = getRangeOfYears();
	const disabledPrev: boolean = currentYear <= getFirstYrOfRange();
	const disabledNext: boolean = currentYear >= getLastYrOfRange();

	return (
		<div ref={optionsRef} className={styles.YearsDropdown}>
			<div className={styles.YearsDropdown_header}>
				<CurrentYear currentYear={currentYear} />
				<PickerNavButtons
					goToNext={goToNext}
					goToPrev={goToPrev}
					isPrevDisabled={disabledPrev}
					isNextDisabled={disabledNext}
				/>
			</div>
			<div className={styles.YearsDropdown_years}>
				{years.map((year, idx) => {
					return (
						<YearOption
							key={`${year}__${idx}`}
							year={year}
							isSelected={currentYear === year}
							selectYear={() => selectYear(year)}
						/>
					);
				})}
			</div>
		</div>
	);
};

const YearPicker = ({
	name,
	id,
	value = new Date().getFullYear(),
	onSelect,
}: Props) => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(value);

	const selectYear = (year: number) => {
		setSelectedYear(year);

		return onSelect && onSelect(name, year);
	};

	// change to prev year
	const goToPrev = () => {
		const year = selectedYear;
		const newYear = year - 1;
		// keep nav within our year's range (eg. 10 years)
		const lastOfRange = new Date().getFullYear() - 10;
		if (newYear < lastOfRange) return;
		setSelectedYear(newYear);
	};

	// change to next year
	const goToNext = () => {
		const thisYear = new Date().getFullYear();
		const year = selectedYear;
		const newYear = year + 1;
		if (newYear > thisYear) return;
		setSelectedYear(newYear);
	};

	const openDropdown = () => {
		setShowDropdown(true);
	};
	const closeDropdown = () => {
		setShowDropdown(false);
	};

	return (
		<div className={styles.YearPicker}>
			<div className={styles.YearPicker_inputWrapper}>
				<input
					type="text"
					name={name}
					id={id}
					value={selectedYear}
					readOnly
					className={styles.YearPicker_inputWrapper_input}
				/>
				<button
					type="button"
					onClick={openDropdown}
					className={styles.YearPicker_inputWrapper_button}
				>
					<svg className={styles.YearPicker_inputWrapper_button_icon}>
						<use xlinkHref={`${sprite}#icon-calendar_today`}></use>
					</svg>
				</button>

				{showDropdown && (
					<YearsDropdown
						goToNext={goToNext}
						goToPrev={goToPrev}
						currentYear={selectedYear}
						selectYear={selectYear}
						close={closeDropdown}
					/>
				)}
			</div>
		</div>
	);
};

export default YearPicker;
