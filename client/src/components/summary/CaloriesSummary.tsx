import styles from "../../css/summary/CaloriesSummary.module.scss";
import {
	DailyCalories,
	DailyCaloriesSummary,
} from "../../features/dashboard/types";
import { isSunday } from "date-fns";
import NoData from "../ui/NoData";
import DetailsCard from "../layout/DetailsCard";
import DailyCaloriesForWeek from "../dashboard/DailyCaloriesForWeek";

type Props = {
	caloriesSummary: DailyCaloriesSummary;
};

const isNewWeek = (data: DailyCalories[]) => {
	const now = new Date();
	const hasNoData = data.filter((x) => x?.calories !== 0);
	const isTodaySunday = isSunday(now);

	return isTodaySunday && hasNoData?.length <= 0;
};

const CaloriesSummary = ({ caloriesSummary }: Props) => {
	const isWeekStart: boolean = isNewWeek(caloriesSummary);
	return (
		<div className={styles.CaloriesSummary}>
			<div className={styles.CaloriesSummary_card}>
				<DetailsCard
					to="details"
					title="Daily Calories"
					icon="fire"
					color="var(--accent-red3)"
				>
					{isWeekStart && <NoData icon="noData" />}
					{!isWeekStart && (
						<DailyCaloriesForWeek recentCalories={caloriesSummary} />
					)}
				</DetailsCard>
			</div>
			{/*  */}
		</div>
	);
};

export default CaloriesSummary;
