import styles from "../css/pages/RecentActivityPage.module.scss";
import { useState } from "react";
import {
	ActivityRangeType,
	ActivitySummaryFor,
	EActivityRangeType,
} from "../features/recent-activity/types";
import { formatDate } from "../utils/utils_dates";
import { useRecentActivitySummary } from "../hooks/useRecentActivitySummary";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import RangeSelector from "../components/recent-activity/RangeSelector";
import RecentActivityBreakdown from "../components/recent-activity/RecentActivityBreakdown";
import { useQueryParams } from "../hooks/useQueryParams";
import { useNavigate } from "react-router";

const defaultType = EActivityRangeType.WEEK;

const RecentActivityPage = () => {
	const navigate = useNavigate();
	const baseDate = formatDate(new Date(), "db");
	const { params, setParams } = useQueryParams();
	const defaultRange = (params.get("view") || defaultType) as ActivityRangeType;
	const [rangeType, setRangeType] = useState<ActivityRangeType>(defaultRange);
	const { data, isLoading } = useRecentActivitySummary(rangeType, baseDate);
	const activitySummary = data as ActivitySummaryFor;

	const selectType = (type: string) => {
		setRangeType(type as ActivityRangeType);
		setParams({
			view: type,
		});
	};

	return (
		<PageContainer padding="2rem 1rem">
			<div className={styles.RecentActivityPage}>
				<div className={styles.RecentActivityPage_nav}>
					<NavArrows onBack={() => navigate("/")} />
				</div>
				<div className={styles.RecentActivityPage_header}>
					<h2>Recent Activity</h2>
				</div>
				<div className={styles.RecentActivityPage_tabs}>
					<RangeSelector value={rangeType} onSelect={selectType} />
				</div>
				{!isLoading && activitySummary && (
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
