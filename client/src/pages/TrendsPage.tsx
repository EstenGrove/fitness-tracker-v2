import styles from "../css/pages/TrendsPage.module.scss";
import { useNavigate } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import WorkoutHistorySummary from "../components/summary/WorkoutHistorySummary";

const TrendsPage = () => {
	const navigate = useNavigate();

	const goToWorkouts = () => {
		navigate("/workouts");
	};

	return (
		<PageContainer>
			<div className={styles.TrendsPage}>
				<NavArrows onBack={goToWorkouts} />
				<div className={styles.TrendsPage_title}>Workout Trends</div>
				<div className={styles.TrendsPage_main}>
					<WorkoutHistorySummary />
				</div>
			</div>
		</PageContainer>
	);
};

export default TrendsPage;
