import sprite from "../assets/icons/calendar.svg";
import styles from "../css/pages/AwardsPage.module.scss";
import { WorkoutStreakDetails } from "../features/streaks/types";
import { useWorkoutStreaks } from "../hooks/useWorkoutStreaks";
import { formatDate } from "../utils/utils_dates";
import { ReactNode } from "react";
import Loader from "../components/layout/Loader";
import PageHeader from "../components/layout/PageHeader";
import PageContainer from "../components/layout/PageContainer";
import StreaksSummary from "../components/awards/StreaksSummary";

const Section = ({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) => {
	return (
		<section className={styles.Section}>
			<div className={styles.Section_header}>
				<div className={styles.Section_header_title}>{title}</div>
				<button type="button" className={styles.Section_header_goTo}>
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
	const date = formatDate(new Date(), "db");
	const { data, isLoading } = useWorkoutStreaks(date);
	const streaks = data as WorkoutStreakDetails;

	return (
		<PageContainer>
			<PageHeader title="Awards & Streaks">
				{/*  */}
				{/*  */}
			</PageHeader>
			<div className={styles.AwardsPage}>
				{isLoading && <Loader />}
				{!!streaks && (
					<Section title="Streaks">
						<StreaksSummary streaks={streaks} />
					</Section>
				)}
			</div>
		</PageContainer>
	);
};

export default AwardsPage;
