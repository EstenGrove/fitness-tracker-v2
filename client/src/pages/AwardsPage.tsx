import sprite from "../assets/icons/calendar.svg";
import styles from "../css/pages/AwardsPage.module.scss";
import { WorkoutStreakDetails } from "../features/streaks/types";
import { formatDate } from "../utils/utils_dates";
import { ReactNode } from "react";
import Loader from "../components/layout/Loader";
import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import StreaksSummary from "../components/awards/StreaksSummary";
import { useWorkoutStreaksAndAwards } from "../hooks/useWorkoutStreaksAndAwards";
import { WorkoutAwardsAndStreaks } from "../features/awards/types";
import { useNavigate } from "react-router";

const Section = ({
	title,
	children,
	goTo,
}: {
	title: string;
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

const AwardsPage = () => {
	const navigate = useNavigate();
	const date = formatDate(new Date(), "db");
	const { data: awardsData, isLoading } = useWorkoutStreaksAndAwards(date);
	const awards = awardsData as WorkoutAwardsAndStreaks;
	const streaks = awards?.streaks?.details;

	console.log(awards);

	const goToStreaks = () => {
		navigate("/awards/streaks");
	};

	return (
		<PageContainer>
			<PageHeader title="Awards & Streaks" />
			<div className={styles.AwardsPage}>
				{isLoading && <Loader />}
				{!!streaks && (
					<Section title="Streaks" goTo={goToStreaks}>
						<StreaksSummary streaks={streaks as WorkoutStreakDetails} />
					</Section>
				)}
			</div>
		</PageContainer>
	);
};

export default AwardsPage;
