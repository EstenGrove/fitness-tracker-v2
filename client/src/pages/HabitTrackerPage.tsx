import { useNavigate, useParams } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/HabitTrackerPage.module.scss";
import HabitTracker from "../components/habits/HabitTracker";
import { useHabitDetails } from "../hooks/useHabitDetails";
import { formatDate } from "../utils/utils_dates";
import { HabitDetails } from "../features/habits/types";
import Loader from "../components/layout/Loader";

const HabitTrackerPage = () => {
	const { id } = useParams();
	const habitID = Number(id);
	const navigate = useNavigate();
	const targetDate = formatDate(new Date(), "long");
	const { data, isLoading, refetch } = useHabitDetails(habitID, targetDate);
	const details = data as HabitDetails;

	const goBack = () => {
		refetch();
		navigate(-1);
	};

	return (
		<PageContainer>
			<NavArrows onBack={goBack} />
			<div className={styles.HabitTrackerPage}>
				{isLoading && <Loader />}
				{!isLoading && !!details && (
					<HabitTracker habit={details.habit} summary={details.summary} />
				)}
			</div>
		</PageContainer>
	);
};

export default HabitTrackerPage;
