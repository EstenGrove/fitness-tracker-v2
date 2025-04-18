import React, { useMemo, useRef, useState } from "react";
import styles from "../../css/shared/QuarterPicker.module.scss";
import sprite from "../../assets/icons/calendar2.svg";
import { getQuarter } from "date-fns";
import { MONTHS_BY_QUARTER, QUARTERS } from "../../utils/utils_dates";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	name: string;
	id?: string;
	value: Date | string;
	onSelect: (name: string, value: Date) => void;
};
type QuarterOptionProps = {
	quarter: string;
	isSelected: boolean;
	selectQuarter: () => void;
};
type QuarterDropdownProps = {
	currentQuarter: number;
	currentYear: number;
	selectQuarter: (quarterIdx: number) => void;
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
};

const CurrentYear = ({ currentYear }: CurrentDisplayProps) => {
	return (
		<div className={styles.CurrentYear}>
			<div className={styles.CurrentYear_year}>{currentYear || 2024}</div>
		</div>
	);
};

const QuarterOption = ({
	quarter,
	isSelected = false,
	selectQuarter,
}: QuarterOptionProps) => {
	return (
		<button
			type="button"
			onClick={selectQuarter}
			className={styles.QuarterOption}
			data-selected-quarter={isSelected}
		>
			{quarter}
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

const QuartersDropdown = ({
	currentYear,
	currentQuarter,
	selectQuarter,
	goToNext,
	goToPrev,
	close,
}: QuarterDropdownProps) => {
	const optionsRef = useRef<HTMLDivElement>(null);
	useOutsideClick(optionsRef, close);
	return (
		<div ref={optionsRef} className={styles.QuartersDropdown}>
			<div className={styles.QuartersDropdown_header}>
				<CurrentYear currentYear={currentYear} />
				<PickerNavButtons goToNext={goToNext} goToPrev={goToPrev} />
			</div>
			<div className={styles.QuartersDropdown_quarters}>
				{QUARTERS.map((quarter, idx) => {
					const nonIndexQuarter = idx + 1;

					return (
						<QuarterOption
							key={quarter + idx}
							quarter={quarter}
							isSelected={currentQuarter === nonIndexQuarter}
							selectQuarter={() => selectQuarter(nonIndexQuarter)}
						/>
					);
				})}
			</div>
		</div>
	);
};

const createBaseDate = (selection: QuarterPicker) => {
	const { quarter, year } = selection;
	const keyQ: string = `Q${quarter}`;

	// returns the starting month of the given quarter as an index (eg. 0-11)
	const monthStartQ: number = MONTHS_BY_QUARTER[keyQ][0];
	const base = new Date(year, monthStartQ, 1);

	return base;
};

interface QuarterPicker {
	quarter: number;
	year: number;
}

const getDisplay = (selection: QuarterPicker) => {
	const { quarter, year } = selection;
	const targetQ: string = `Q${quarter}`;
	return targetQ + " " + year;
};

const QuarterPicker = ({ name, id, value = new Date(), onSelect }: Props) => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selection, setSelection] = useState<QuarterPicker>({
		quarter: getQuarter(value),
		year: new Date(value).getFullYear(),
	});

	const quarterValue = useMemo(() => {
		return getDisplay(selection);
	}, [selection]);

	const selectQuarter = (value: number) => {
		const quarterStart: Date = createBaseDate({
			quarter: value,
			year: selection.year,
		});

		setSelection({
			...selection,
			quarter: value,
		});

		return onSelect && onSelect(name, quarterStart);
	};

	// change to prev year
	const goToPrev = () => {
		const { year } = selection;
		const newYear = year - 1;
		setSelection({
			...selection,
			year: newYear,
		});
	};

	// change to next year
	const goToNext = () => {
		const { year } = selection;
		const newYear = year + 1;
		setSelection({
			...selection,
			year: newYear,
		});
	};

	const openDropdown = () => {
		setShowDropdown(true);
	};
	const closeDropdown = () => {
		setShowDropdown(false);
	};

	return (
		<div className={styles.QuarterPicker}>
			<div className={styles.QuarterPicker_inputWrapper}>
				<input
					type="text"
					name={name}
					id={id}
					value={quarterValue || ""}
					readOnly
					className={styles.QuarterPicker_inputWrapper_input}
				/>
				<button
					type="button"
					onClick={openDropdown}
					className={styles.QuarterPicker_inputWrapper_button}
				>
					<svg className={styles.QuarterPicker_inputWrapper_button_icon}>
						<use xlinkHref={`${sprite}#icon-calendar_today`}></use>
					</svg>
				</button>

				{showDropdown && (
					<QuartersDropdown
						goToNext={goToNext}
						goToPrev={goToPrev}
						close={closeDropdown}
						selectQuarter={selectQuarter}
						currentYear={selection.year}
						currentQuarter={selection.quarter}
					/>
				)}
			</div>
		</div>
	);
};

export default QuarterPicker;
