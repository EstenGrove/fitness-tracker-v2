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
import Carousel, { CarouselCard } from "../carousel/Carousel";

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

const dummyCards: CarouselCard[] = [
	{
		id: 1,
		data: { title: "Card 1" },
		render: () => <div>Card 1</div>,
	},
	{
		id: 2,
		data: { title: "Card 2" },
		render: () => <div>Card 2</div>,
	},
	{
		id: 3,
		data: { title: "Card 3" },
		render: () => <div>Card 3</div>,
	},
	{
		id: 4,
		data: { title: "Card 4" },
		render: () => <div>Card 4</div>,
	},
	{
		id: 5,
		data: { title: "Card 5" },
		render: () => <div>Card 5</div>,
	},
];

const HistoryMetrics = ({ history, dateRange, onClose }: Props) => {
	const cards = useMemo(() => {
		return dummyCards;
	}, []);
	const subtitle = getDatesSubtitle(dateRange);
	const { data, isLoading, refetch } = useActivityMetricsAfterWorkout({
		userID: history.userID,
		activityType: history.activityType,
		workoutID: history.workoutID,
		historyID: history.historyID,
		range: dateRange,
	});

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
