import { useMemo } from "react";
import styles from "../../css/metrics/HistoryMetrics.module.scss";
import { HistoryOfType } from "../../features/history/types";
import { useActivityMetricsAfterWorkout } from "../../hooks/useActivityMetricsAfterWorkout";
import { RangeParams } from "../../features/types";
import {
	formatTime,
	formatCustomDate,
	parseAnyDate,
} from "../../utils/utils_dates";
import { isToday } from "date-fns";
import { addEllipsis } from "../../utils/utils_misc";
import type { MappedCarouselCard } from "../../utils/utils_carousel";
import {
	ActivityMetrics,
	ActivityMetricsCardDataMap,
} from "../../features/metrics/types";
import { useHistoryDetails } from "../../hooks/useHistoryDetails";
import { getActivityMetricsCards } from "../../utils/utils_metrics";
import Carousel from "../carousel/Carousel";
import MetricsTitleCard from "../carousel-cards/MetricsTitleCard";

type Props = {
	history: HistoryOfType;
	dateRange: RangeParams;
	onClose: () => void;
};

const getWhen = (history: HistoryOfType) => {
	const { startTime, endTime } = history;
	const start = formatTime(startTime, "short");
	const end = formatTime(endTime, "short");

	return `${start} - ${end}`;
};

const getRecordedDate = (workoutDate: string) => {
	if (isToday(workoutDate)) {
		return "Today";
	}
	const parsed = parseAnyDate(workoutDate);
	const date = formatCustomDate(parsed, "monthAndDay");

	return date;
};

const Header = ({ history }: { history: HistoryOfType }) => {
	const when = getWhen(history);
	const date = getRecordedDate(history.workoutDate);
	const name = addEllipsis(history.workoutName, 20);
	return (
		<div className={styles.Header}>
			<div className={styles.Header_title}>{date}</div>
			<div className={styles.Header_when}>{when}</div>
			<div className={styles.Header_name}>{name}</div>
		</div>
	);
};

const getDatesSubtitle = (dateRange: RangeParams) => {
	const { startDate, endDate } = dateRange;
	const start = formatCustomDate(startDate, "monthAndDay");
	const end = formatCustomDate(endDate, "monthAndDay");
	return `${start} - ${end}`;
};

type DummyCardDataMap = {
	Title: { title: string; desc: string };
	Placeholder: { title: string };
};

const dummyCards: MappedCarouselCard<DummyCardDataMap>[] = [
	{
		id: 0,
		kind: "Title",
		data: {
			title: "How does this session compare to previous sessions?",
			desc: "Your comparison against the last 60 days.",
		},
		render: MetricsTitleCard,
	},
	{
		id: 1,
		kind: "Placeholder",
		data: { title: "Card 1" },
		render: ({ data }) => <div>{data.title}</div>,
	},
	{
		id: 2,
		kind: "Placeholder",
		data: { title: "Card 2" },
		render: ({ data }) => <div>{data.title}</div>,
	},
	{
		id: 3,
		kind: "Placeholder",
		data: { title: "Card 3" },
		render: ({ data }) => <div>{data.title}</div>,
	},
	{
		id: 4,
		kind: "Placeholder",
		data: { title: "Card 4" },
		render: ({ data }) => <div>{data.title}</div>,
	},
	{
		id: 5,
		kind: "Placeholder",
		data: { title: "Card 5" },
		render: ({ data }) => <div>{data.title}</div>,
	},
];

const HistoryMetrics = ({ history, dateRange, onClose }: Props) => {
	const subtitle = getDatesSubtitle(dateRange);
	const { data: historyDetails } = useHistoryDetails({
		userID: history.userID,
		historyID: history.historyID,
		activityType: history.activityType,
	});
	const { data, isLoading, refetch } = useActivityMetricsAfterWorkout({
		userID: history.userID,
		activityType: history.activityType,
		workoutID: history.workoutID,
		historyID: history.historyID,
		range: dateRange,
	});
	const metrics = data as ActivityMetrics;
	const cards = useMemo(() => {
		if (!metrics || !history.activityType) return dummyCards;
		return getActivityMetricsCards(
			history.activityType,
			metrics,
		) as MappedCarouselCard<ActivityMetricsCardDataMap>[];
	}, [history.activityType, metrics]);

	console.log("Metrics & Data:", { metrics, history, historyDetails });
	return (
		<div className={styles.HistoryMetrics}>
			<Carousel
				title="History Metrics"
				subtitle={subtitle}
				cards={cards}
				onClose={onClose}
			/>
		</div>
	);
};

export default HistoryMetrics;
