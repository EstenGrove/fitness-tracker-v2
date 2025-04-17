import styles from "../../css/summary/MinutesSummary.module.scss";
import { DailyMins, DailyMinsSummary } from "../../features/dashboard/types";
import { NavLink } from "react-router";
import { isSunday } from "date-fns";
import NoData from "../ui/NoData";
import DetailsCard from "../layout/DetailsCard";
import DailyMinsForWeek from "../dashboard/DailyMinsForWeek";

type Props = {
	minsSummary: DailyMinsSummary;
};

const getDetailsUrl = (type: string, date: string) => {
	const basePath =
		"/recent?" +
		new URLSearchParams({
			type: type,
			date: date,
		});

	return basePath;
};

const isNewWeek = (data: DailyMins[]) => {
	const now = new Date();
	const hasNoData = data.filter((x) => x?.mins !== 0);
	const isTodaySunday = isSunday(now);

	return isTodaySunday && hasNoData?.length <= 0;
};

const MinutesSummary = ({ minsSummary }: Props) => {
	const base = new Date().toString();
	const isWeekStart: boolean = isNewWeek(minsSummary);
	const detailsUrl: string = getDetailsUrl("minutes", base);
	return (
		<div className={styles.MinutesSummary}>
			<header className={styles.MinutesSummary_header}>
				<h4>Recent Activity</h4>
				<NavLink to={detailsUrl} className={styles.MinutesSummary_header_btn}>
					Show All
				</NavLink>
			</header>
			<div className={styles.MinutesSummary_card}>
				<DetailsCard
					to="details"
					title="Weekly Mins."
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
