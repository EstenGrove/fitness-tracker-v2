import styles from "../../css/weekly-recap/RecapCompletedCard.module.scss";
import { RecapBar, WeeklyRecaps } from "../../features/recaps/types";
import RecapCardLayout from "./RecapCardLayout";
import RecapProgressBars from "./RecapProgressBars";

type Props = {
	data: WeeklyRecaps;
	isActive: boolean;
};

const COMPLETED_COLOR = "var(--accent-blue)";

const Header = ({
	completed,
	total,
	allCompleted,
}: {
	completed: number;
	total: number;
	allCompleted: number;
}) => {
	return (
		<div className={styles.Header}>
			<h2 className={styles.Header_title}>
				You completed <b>{completed}</b> out of{" "}
				<b>{total} scheduled workouts</b>.
			</h2>
			<h2 className={styles.Header_desc}>
				You finished a total of <b>{allCompleted}</b> workouts.
			</h2>
		</div>
	);
};

const getRecapProgressBars = (data: WeeklyRecaps): RecapBar[] => {
	if (!data) return [];

	const bars: RecapBar[] = [];

	for (const key in data) {
		const week = data[key as keyof WeeklyRecaps];
		const total = week.recap.breakdown.totalWorkouts;
		const barEntry: RecapBar = {
			when: week.dateRange.startDate,
			what: `${total} workouts`,
			value: total,
			mins: week.recap.breakdown.totalMins,
		};
		bars.push(barEntry);
	}

	return bars;
};

const RecapCompletedCard = ({ data, isActive = false }: Props) => {
	const { recap } = data.currentWeek;
	const { totalCount, completedCount } = recap.completed;
	const progressBars: RecapBar[] = getRecapProgressBars(data);

	const header = (
		<Header
			completed={completedCount}
			total={totalCount}
			allCompleted={recap.breakdown.totalWorkouts}
		/>
	);
	const body = (
		<>
			<RecapProgressBars data={progressBars} color={COMPLETED_COLOR} />
		</>
	);
	if (!isActive) return null;
	return (
		<RecapCardLayout
			icon="exercise"
			color={COMPLETED_COLOR}
			header={header}
			body={body}
		/>
	);
};

export default RecapCompletedCard;
