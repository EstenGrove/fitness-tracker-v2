import { useState } from "react";
import { Outlet } from "react-router";
import sprite from "../assets/icons/calendar.svg";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/HistoryPage.module.scss";
import ModalLG from "../components/shared/ModalLG";
import HistoryTabs from "../components/history/HistoryTabs";

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
	const [showRangeCalendar, setShowRangeCalendar] = useState<boolean>(false);

	const openCalendar = () => {
		setShowRangeCalendar(true);
	};
	const closeCalendar = () => {
		setShowRangeCalendar(false);
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
					<div>Select date range</div>
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default HistoryPage;
