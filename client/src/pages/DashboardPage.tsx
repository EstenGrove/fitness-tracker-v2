import { useSelector } from "react-redux";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import UserBadge from "../components/user/UserBadge";
import styles from "../css/pages/DashboardPage.module.scss";
import { selectCurrentUser } from "../features/user/userSlice";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import { useWeekHeader } from "../hooks/useWeekHeader";

const DashboardPage = () => {
	const baseDate = new Date();
	const header = useWeekHeader(baseDate.toString());
	const currentUser = useSelector(selectCurrentUser);

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
			</div>
		</PageContainer>
	);
};

export default DashboardPage;
