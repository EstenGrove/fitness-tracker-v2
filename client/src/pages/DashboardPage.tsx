import { useSelector } from "react-redux";
import styles from "../css/pages/DashboardPage.module.scss";
import { selectCurrentUser } from "../features/user/userSlice";
import { useWeekHeader } from "../hooks/useWeekHeader";
import { useGetDashboardSummaryQuery } from "../features/dashboard/summaryApi";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import UserBadge from "../components/user/UserBadge";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import MinutesSummary from "../components/summary/MinutesSummary";
import { DashboardSummary } from "../features/dashboard/types";
import CaloriesSummary from "../components/summary/CaloriesSummary";
import CardsCarousel from "../components/layout/CardsCarousel";
import { useRef } from "react";
import CardsSection from "../components/layout/CardsSection";
import StepsSummary from "../components/summary/StepsSummary";

const DashboardPage = () => {
	const baseDate = new Date();
	const cardsRef = useRef<HTMLDivElement>(null);
	const header = useWeekHeader(baseDate.toString());
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetDashboardSummaryQuery({
		userID: currentUser?.userID,
		targetDate: header.selectedDate,
	});
	const summary = data as DashboardSummary;

	console.log("data", data);

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
					{!isLoading && (
						<CardsSection title="Recent Activity" to="/activity?view=WEEK">
							<CardsCarousel containerRef={cardsRef}>
								<MinutesSummary minsSummary={summary.dailyMins} />
								<CaloriesSummary caloriesSummary={summary.dailyCalories} />
								<StepsSummary stepsSummary={summary.dailySteps} />
							</CardsCarousel>
						</CardsSection>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default DashboardPage;
