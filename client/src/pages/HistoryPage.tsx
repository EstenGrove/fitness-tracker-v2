import { useState } from "react";
import { Outlet } from "react-router";
import sprite from "../assets/icons/calendar.svg";
import {
	selectHistoryRange,
	setDateRange,
} from "../features/history/historySlice";
import { DateRange } from "../features/types";
import { useAppDispatch } from "../store/store";
import { formatDate } from "../utils/utils_dates";
import { useSelector } from "react-redux";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/HistoryPage.module.scss";
import ModalLG from "../components/shared/ModalLG";
import HistoryTabs from "../components/history/HistoryTabs";
import DateRangeCalendar from "../components/calendars/DateRangeCalendar";

const CalendarIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.CalendarIcon}>
			<svg className={styles.CalendarIcon_icon}>
				<use xlinkHref={`${sprite}#icon-date_range`}></use>
			</svg>
		</button>
	);
};

const HistoryPage = () => {
	const dispatch = useAppDispatch();
	const dateRange = useSelector(selectHistoryRange);
	const [showRangeCalendar, setShowRangeCalendar] = useState<boolean>(false);

	const openCalendar = () => {
		setShowRangeCalendar(true);
	};
	const closeCalendar = () => {
		setShowRangeCalendar(false);
	};

	const changeDateRange = (range: DateRange) => {
		const newRange: DateRange = {
			startDate: formatDate(range.startDate, "long"),
			endDate: formatDate(range.endDate, "long"),
		};
		dispatch(setDateRange(newRange));
		closeCalendar();
	};

	return (
		<PageContainer padding="1rem 2.5rem">
			<div className={styles.HistoryPage}>
				<div className={styles.HistoryPage_header}>
					<PageHeader title="History">
						<CalendarIcon onClick={openCalendar} />
					</PageHeader>
					<HistoryTabs />
				</div>

				<div className={styles.HistoryPage_main}>
					<Outlet />
				</div>
			</div>

			{showRangeCalendar && (
				<ModalLG onClose={closeCalendar}>
					<DateRangeCalendar
						onClose={closeCalendar}
						onConfirm={changeDateRange}
						initialSelection={dateRange}
					/>
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default HistoryPage;
