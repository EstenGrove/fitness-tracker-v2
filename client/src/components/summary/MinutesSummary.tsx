import styles from "../../css/summary/MinutesSummary.module.scss";
import { DailyMins, DailyMinsSummary } from "../../features/dashboard/types";
import { isSunday } from "date-fns";
import NoData from "../ui/NoData";
import DetailsCard from "../layout/DetailsCard";
import DailyMinsForWeek from "../dashboard/DailyMinsForWeek";

type Props = {
	minsSummary: DailyMinsSummary;
};

const isNewWeek = (data: DailyMins[]) => {
	const now = new Date();
	const hasNoData = data.filter((x) => x?.mins !== 0);
	const isTodaySunday = isSunday(now);

	return isTodaySunday && hasNoData?.length <= 0;
};

const MinutesSummary = ({ minsSummary }: Props) => {
	const isWeekStart: boolean = isNewWeek(minsSummary);
	return (
		<div className={styles.MinutesSummary}>
			<div className={styles.MinutesSummary_card}>
				<DetailsCard
					to="stats/mins"
					title="Daily Mins."
					icon="time"
					color="var(--accent-blue)"
				>
					{isWeekStart && <NoData icon="noData" />}
					{!isWeekStart && <DailyMinsForWeek recentMins={minsSummary} />}
				</DetailsCard>
			</div>
			{/*  */}
		</div>
	);
};

export default MinutesSummary;
