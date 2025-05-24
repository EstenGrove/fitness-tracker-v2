import { useSelector } from "react-redux";
import styles from "../css/pages/DashboardPage.module.scss";
import { useRef } from "react";
import { DashboardSummary } from "../features/dashboard/types";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { selectCurrentUser } from "../features/user/userSlice";
import { useWeekHeader } from "../hooks/useWeekHeader";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import UserBadge from "../components/user/UserBadge";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import MinutesSummary from "../components/summary/MinutesSummary";
import CaloriesSummary from "../components/summary/CaloriesSummary";
import CardsCarousel from "../components/layout/CardsCarousel";
import CardsSection from "../components/layout/CardsSection";
import StepsSummary from "../components/summary/StepsSummary";
import Loader from "../components/layout/Loader";
import RecentHistoryTabs from "../components/dashboard/RecentHistoryTabs";
import DashboardHabits from "../components/dashboard/DashboardHabits";

const activityInfo = {
	title: "Recent Activity",
	path: "/activity?view=WEEK",
};

const habitInfo = {
	title: "Habit Progress",
	path: "/habits",
};

const Spacer = ({
	margin = "0 0",
	padding = "0 0",
}: {
	padding?: string;
	margin?: string;
}) => {
	const css = {
		margin,
		padding,
	};
	return <div className={styles.Spacer} style={css}></div>;
};

const DashboardPage = () => {
	const baseDate = new Date();
	const cardsRef = useRef<HTMLDivElement>(null);
	const header = useWeekHeader(baseDate.toString());
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useDashboardSummary(header.selectedDate);
	const summary = data as DashboardSummary;

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
					{!isLoading && summary ? (
						<>
							<CardsSection title={activityInfo.title} to={activityInfo.path}>
								<CardsCarousel containerRef={cardsRef}>
									<MinutesSummary minsSummary={summary.dailyMins} />
									<CaloriesSummary caloriesSummary={summary.dailyCalories} />
									<StepsSummary stepsSummary={summary.dailySteps} />
								</CardsCarousel>
							</CardsSection>
							{/* HABITS PROGRESS */}
							<Spacer margin="1rem 0" />
							<CardsSection title={habitInfo.title} to={habitInfo.path}>
								<DashboardHabits
									habits={summary?.habitProgress?.todaysSummaries}
								/>
							</CardsSection>

							{/* LOGS (WORKOUT & HABITS) */}
							<RecentHistoryTabs
								recentWorkouts={summary?.recentWorkouts}
								recentHabitLogs={summary?.habitProgress?.todaysLogs}
							/>
						</>
					) : (
						<Loader>
							<span>Loading summary...please wait..</span>
						</Loader>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default DashboardPage;
