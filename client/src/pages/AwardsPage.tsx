import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../utils/utils_dates";
import sprite from "../assets/icons/calendar.svg";
import styles from "../css/pages/AwardsPage.module.scss";
import { WorkoutStreakDetails } from "../features/streaks/types";
import { useWorkoutStreaksAndAwards } from "../hooks/useWorkoutStreaksAndAwards";
import {
	WorkoutAwards,
	WorkoutAwardsAndStreaks,
	WorkoutAward,
	StreakAward,
} from "../features/awards/types";
import Loader from "../components/layout/Loader";
import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import StreaksSummary from "../components/awards/StreaksSummary";
import AwardsSummary from "../components/awards/AwardsSummary";
import CountBadge from "../components/awards/CountBadge";

const Section = ({
	title,
	children,
	goTo,
}: {
	title: ReactNode | string;
	children?: ReactNode;
	goTo?: () => void;
}) => {
	return (
		<section className={styles.Section}>
			<div className={styles.Section_header}>
				<div className={styles.Section_header_title}>{title}</div>
				<button
					type="button"
					className={styles.Section_header_goTo}
					onClick={goTo}
				>
					<svg className={styles.Section_header_goTo_icon}>
						<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
					</svg>
				</button>
			</div>
			<div className={styles.Section_children}>{children}</div>
		</section>
	);
};

const getAchievedCounts = (list: StreakAward[] | WorkoutAward[]) => {
	const earned = list.filter((item) => item.wasAchieved);
	const total = list.length;
	return {
		earned: earned.length,
		total,
	};
};

const AwardsPage = () => {
	const navigate = useNavigate();
	const date = formatDate(new Date(), "db");
	const { data: awardsData, isLoading } = useWorkoutStreaksAndAwards(date);
	const awards = awardsData as WorkoutAwardsAndStreaks;
	const streaks = awards?.streaks?.details;
	const workoutAwards = awards?.awards;
	const streaksCounts = getAchievedCounts(awards?.streaks?.achieved ?? []);
	const awardsCounts = getAchievedCounts(awards?.awards?.achieved ?? []);

	console.log(awards);

	const streaksTitle = (
		<>
			<span>Streaks</span>
			<CountBadge count={streaksCounts.earned} outOf={streaksCounts.total} />
		</>
	);

	const awardsTitle = (
		<>
			<span>Awards</span>
			<CountBadge count={awardsCounts.earned} outOf={awardsCounts.total} />
		</>
	);

	const goToStreaks = () => {
		navigate("/awards/streaks");
	};

	const goToAwards = () => {
		navigate("/awards/all");
	};

	return (
		<PageContainer>
			<PageHeader title="Awards & Streaks" />
			<div className={styles.AwardsPage}>
				{isLoading && <Loader />}
				{!!streaks && (
					<Section title={streaksTitle} goTo={goToStreaks}>
						<StreaksSummary streaks={streaks as WorkoutStreakDetails} />
					</Section>
				)}
				<br />
				{!!awards && (
					<Section title={awardsTitle} goTo={goToAwards}>
						<AwardsSummary awards={workoutAwards as WorkoutAwards} />
					</Section>
				)}
			</div>
		</PageContainer>
	);
};

export default AwardsPage;
