import { useSelector } from "react-redux";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import UserBadge from "../components/user/UserBadge";
import styles from "../css/pages/DashboardPage.module.scss";
import { selectCurrentUser } from "../features/user/userSlice";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import { useWeekHeader } from "../hooks/useWeekHeader";
import { useState } from "react";
import { DateRange } from "../features/types";
import { formatDate } from "../utils/utils_dates";
import { parseISO, startOfWeek } from "date-fns";
import { useGetDashboardSummaryQuery } from "../features/dashboard/summaryApi";
import MinutesSummary from "../components/summary/MinutesSummary";

const getWeekToDate = (base: Date | string = new Date()) => {
	const now = base;
	const weekStart = startOfWeek(now);
	return {
		startDate: formatDate(weekStart, "db"),
		endDate: formatDate(now, "db"),
	};
};

const DashboardPage = () => {
	const baseDate = new Date();
	const header = useWeekHeader(baseDate.toString());
	const weekRange = getWeekToDate();
	const currentUser = useSelector(selectCurrentUser);
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: weekRange.startDate,
		endDate: weekRange.endDate,
	});
	// const { data, isLoading } = useGetDashboardSummaryQuery({
	// 	userID: currentUser.userID,
	// 	startDate: dateRange.startDate,
	// 	endDate: dateRange.endDate,
	// });

	// console.log("data", data);

	return (
		<PageContainer padding="1rem 2rem">
			<div className={styles.DashboardPage}>
				<div className={styles.DashboardPage_header}>
					<PageHeader title="Dashboard">
						<UserBadge currentUser={currentUser} size="SM" />
					</PageHeader>
					<WeeklyHeader
						onSelect={header.selectDate}
						baseDate={baseDate.toString()}
						selectedDate={header.selectedDate}
					/>
				</div>
				<div className={styles.DashboardPage_body}>
					<MinutesSummary minsSummary={[]} />
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			</div>
		</PageContainer>
	);
};

export default DashboardPage;
