import styles from "../css/pages/TrendsPage.module.scss";
import { useNavigate } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";

// Trends Overview Summary:
// - This page will show a categorized summary of noted trends & insights with the ability to drill down into each category's details on a separate nested route/page.

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
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			</div>
		</PageContainer>
	);
};

export default TrendsPage;
