import styles from "../css/pages/GoalsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import NavArrows from "../components/layout/NavArrows";
import { useNavigate } from "react-router";

const GoalsPage = () => {
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser);

	const goToWorkouts = () => {
		navigate("/workouts");
	};

	console.log("currentUser", currentUser);
	return (
		<PageContainer>
			<div className={styles.GoalsPage}>
				<NavArrows onBack={goToWorkouts} />
				<div className={styles.GoalsPage_title}>Goals</div>
				<div className={styles.GoalsPage_main}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			</div>
		</PageContainer>
	);
};

export default GoalsPage;
