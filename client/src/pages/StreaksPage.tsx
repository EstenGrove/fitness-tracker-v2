import { useNavigate } from "react-router";
import styles from "../css/pages/StreaksPage.module.scss";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import {
	StreakAward as StreakAwardType,
	WorkoutAwardsAndStreaks,
} from "../features/awards/types";
import { useWorkoutStreaksAndAwards } from "../hooks/useWorkoutStreaksAndAwards";
import { formatDate } from "../utils/utils_dates";
import Loader from "../components/layout/Loader";
import StreakAward from "../components/awards/StreakAward";

const StreaksPage = () => {
	const navigate = useNavigate();
	const date = formatDate(new Date(), "db");
	const { data: awardsData, isLoading } = useWorkoutStreaksAndAwards(date);
	const awards = awardsData as WorkoutAwardsAndStreaks;
	const streakAwards = awards?.streaks?.achieved;

	const goToAwardsPage = () => {
		navigate("/awards");
	};

	const goToStreakDetails = (award: StreakAwardType) => {
		navigate(`/awards/streaks/${award.streakID}`, { state: { award } });
	};

	return (
		<PageContainer>
			<NavArrows onBack={goToAwardsPage} />
			<PageHeader title="Streaks" />
			<div className={styles.StreaksPage}>
				{isLoading && <Loader />}
				<div className={styles.StreaksPage_awards}>
					{streakAwards &&
						streakAwards.map((award, idx) => {
							return (
								<StreakAward
									key={idx + "streak"}
									label={award.streakName}
									value={award.targetDays}
									hasAchieved={award.wasAchieved}
									achievedOn={award.achievedOn}
									flameSize="LG"
									onClick={() => goToStreakDetails(award)}
								/>
							);
						})}
				</div>
			</div>
		</PageContainer>
	);
};

export default StreaksPage;
