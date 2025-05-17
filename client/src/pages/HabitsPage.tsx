import styles from "../css/pages/HabitsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import { formatCustomDate } from "../utils/utils_dates";
import HabitsList from "../components/habits/HabitsList";

const Header = ({ date }: { date: string }) => {
	return (
		<div className={styles.Header}>
			<div className={styles.Header_date}>{date}</div>
			<h2 className={styles.Header_title}>Your Habits</h2>
		</div>
	);
};

const HabitsPage = () => {
	const base = new Date();
	const targetDate = formatCustomDate(base, "monthAndDay");
	return (
		<PageContainer padding="2rem 1.5rem">
			<Header date={targetDate} />
			<div className={styles.HabitsPage}>
				<div className={styles.HabitsPage_list}>
					<HabitsList />
				</div>
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</PageContainer>
	);
};

export default HabitsPage;
