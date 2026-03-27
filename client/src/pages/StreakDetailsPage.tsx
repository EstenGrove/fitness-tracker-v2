import styles from "../css/pages/StreakDetailsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import { useLocation, useNavigate } from "react-router";
import { StreakAward } from "../features/awards/types";
import NavArrows from "../components/layout/NavArrows";
import StreakDetails from "../components/awards/StreakDetails";

const StreakDetailsPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const award = location.state?.award as StreakAward;

	return (
		<PageContainer>
			<NavArrows onBack={() => navigate("/awards/streaks")} />
			<PageHeader title={award.streakName} />
			<div className={styles.StreakDetailsPage_main}>
				<StreakDetails streak={award} />
			</div>
		</PageContainer>
	);
};

export default StreakDetailsPage;
