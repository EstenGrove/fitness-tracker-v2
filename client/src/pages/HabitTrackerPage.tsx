import { useParams } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/HabitTrackerPage.module.scss";
import HabitTracker from "../components/habits/HabitTracker";

const HabitTrackerPage = () => {
	const { id } = useParams();
	const habitID = Number(id);

	return (
		<PageContainer>
			<NavArrows />
			<div className={styles.HabitTrackerPage}>
				<HabitTracker />
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</PageContainer>
	);
};

export default HabitTrackerPage;
