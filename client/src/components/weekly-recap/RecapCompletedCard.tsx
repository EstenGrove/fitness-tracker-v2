import styles from "../../css/weekly-recap/RecapCompletedCard.module.scss";
import { WeeklyRecapCompleted } from "../../features/recaps/types";
import RecapCardLayout from "./RecapCardLayout";

type Props = {
	data: WeeklyRecapCompleted;
	isActive: boolean;
};

const Header = ({ completed, total }: { completed: number; total: number }) => {
	return (
		<div className={styles.Header}>
			<h2 className={styles.Header_title}>
				You completed <b>{completed}</b> out of{" "}
				<b>{total} scheduled workouts</b>.
			</h2>
			<h2 className={styles.Header_desc}>
				You finished a total of <b>41</b> workouts.
			</h2>
		</div>
	);
};

const RecapCompletedCard = ({ data, isActive = false }: Props) => {
	const { totalCount, completedCount } = data;

	const header = <Header completed={completedCount} total={totalCount} />;
	const body = (
		<>
			{/*  */}
			{/*  */}
		</>
	);
	if (!isActive) return null;
	return (
		<RecapCardLayout
			icon="exercise"
			color="var(--accent-blue)"
			header={header}
			body={body}
		/>
	);
};

export default RecapCompletedCard;
