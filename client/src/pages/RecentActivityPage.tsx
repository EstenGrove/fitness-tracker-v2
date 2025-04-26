import styles from "../css/pages/RecentActivityPage.module.scss";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import RecentActivityBreakdown from "../components/recent-activity/RecentActivityBreakdown";
import { useState } from "react";
import {
	ActivityRangeType,
	ActivitySummaryFor,
	EActivityRangeType,
} from "../features/recent-activity/types";
import { useGetActivitySummaryQuery } from "../features/recent-activity/recentActivityApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import RangeSelector from "../components/recent-activity/RangeSelector";
import { extractHrsAndMins } from "../utils/utils_formatter";

const defaultType = EActivityRangeType.WEEK;

const total = extractHrsAndMins(737);
console.log("total", total);

const RecentActivityPage = () => {
	const baseDate = formatDate(new Date(), "db");
	const currentUser = useSelector(selectCurrentUser);
	const [rangeType, setRangeType] = useState<ActivityRangeType>(defaultType);
	const { data, isLoading } = useGetActivitySummaryQuery({
		userID: currentUser.userID,
		targetDate: baseDate,
		rangeType: rangeType,
	});
	const activitySummary = data as ActivitySummaryFor;

	const selectType = (type: string) => {
		setRangeType(type as ActivityRangeType);
	};

	return (
		<PageContainer padding="2rem 1rem">
			<div className={styles.RecentActivityPage}>
				<div className={styles.RecentActivityPage_nav}>
					<NavArrows />
				</div>
				<div className={styles.RecentActivityPage_header}>
					<h2>Recent Activity</h2>
				</div>
				<div className={styles.RecentActivityPage_tabs}>
					<RangeSelector value={rangeType} onSelect={selectType} />
				</div>
				{!isLoading && (
					<div className={styles.RecentActivityPage_main}>
						<RecentActivityBreakdown
							dateRange={activitySummary.dateRange}
							totalTime={activitySummary.totalMins}
							segments={activitySummary.segments}
						/>
					</div>
				)}
			</div>
		</PageContainer>
	);
};

export default RecentActivityPage;
