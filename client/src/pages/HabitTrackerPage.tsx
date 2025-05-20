import { useNavigate, useParams } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/HabitTrackerPage.module.scss";
import HabitTracker from "../components/habits/HabitTracker";
import { useHabitDetails } from "../hooks/useHabitDetails";
import { formatDate } from "../utils/utils_dates";
import { HabitDetails } from "../features/habits/types";
import { useAppDispatch } from "../store/store";
import { habitsApi } from "../features/habits/habitsApi";
import Loader from "../components/layout/Loader";

const HabitTrackerPage = () => {
	const { id } = useParams();
	const habitID = Number(id);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const targetDate = formatDate(new Date(), "long");
	const { data, isLoading, refetch } = useHabitDetails(habitID, targetDate);
	const details = data as HabitDetails;
	const allLogs = details?.logsForRange;

	// Insure we re-fetch recent activity after logging is recorded
	const invalidateCache = () => {
		dispatch(
			habitsApi.util.invalidateTags([
				{ type: "HabitCards" },
				{ type: "HabitLogs" },
			])
		);
	};

	const goBack = () => {
		refetch();
		navigate(-1);
		invalidateCache();
	};

	return (
		<PageContainer>
			<NavArrows onBack={goBack} />
			<div className={styles.HabitTrackerPage}>
				{isLoading && <Loader />}
				{!isLoading && !!details && (
					<HabitTracker
						habit={details.habit}
						summary={details.summary}
						allLogs={allLogs}
					/>
				)}
			</div>
		</PageContainer>
	);
};

export default HabitTrackerPage;
