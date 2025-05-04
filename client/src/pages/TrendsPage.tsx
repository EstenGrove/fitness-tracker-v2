import styles from "../css/pages/TrendsPage.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useNavigate } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";

const TrendsPage = () => {
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser);

	const goToWorkouts = () => {
		navigate("/workouts");
	};

	console.log("currentUser", currentUser);
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
