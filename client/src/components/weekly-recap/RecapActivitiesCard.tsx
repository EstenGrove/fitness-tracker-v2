import styles from "../../css/weekly-recap/RecapActivitiesCard.module.scss";
import {
	RecapBar,
	WeeklyRecap,
	WeeklyRecapActivities,
	WeeklyRecaps,
} from "../../features/recaps/types";
import RecapCard from "./RecapCard";
import { Activity } from "../../features/shared/types";
import RecapProgressBars from "./RecapProgressBars";
import { differenceInWeeks } from "date-fns";

type Props = {
	isActive: boolean;
	data: WeeklyRecaps;
};

const getRecapProgressBar = (
	activityType: Activity,
	data: WeeklyRecaps,
): RecapBar => {
	if (!data) return { when: "", what: "", value: 0, mins: 0 };
	const thisWeek: WeeklyRecap = data?.currentWeek;
	const activities: WeeklyRecapActivities = thisWeek?.activities;
	const dataForActivity =
		activities[activityType as keyof WeeklyRecapActivities];
	const { totalWorkouts, totalMins } = dataForActivity;
	const newBar: RecapBar = {
		what: totalWorkouts.toString(),
		when: activityType,
		value: totalWorkouts,
		mins: totalMins,
	};
	return newBar;
};

const getWhenLabel = (data: WeeklyRecaps): string => {
	const thisWeek: WeeklyRecap = data?.currentWeek;
	const whenLabel = thisWeek?.dateRange.startDate;
	const dist = differenceInWeeks(new Date(), whenLabel);
	if (dist === 1) {
		return "one week ago";
	}
	const label = " weeks ago";
	return dist + label;
};

const getRecapProgressBars = (data: WeeklyRecaps): RecapBar[] => {
	if (!data) return [];
	const recapBars: RecapBar[] = [];
	const thisWeek: WeeklyRecap = data?.currentWeek;
	const activities: WeeklyRecapActivities = thisWeek?.activities;
	const whenLabel = getWhenLabel(data);

	for (const activity in activities) {
		const dataForActivity = activities[activity as keyof WeeklyRecapActivities];
		const { activityType, totalWorkouts, totalMins } = dataForActivity;
		const newBar: RecapBar = {
			whenLabel: whenLabel,
			what: `${totalWorkouts} workouts`,
			when: activityType,
			value: totalWorkouts,
			mins: totalMins,
		};
		recapBars.push(newBar);
	}

	return recapBars;
};

const getSortedRecapProgressBars = (data: WeeklyRecaps): RecapBar[] => {
	const bars = getRecapProgressBars(data);
	const sorted = [...bars].sort((a, b) => {
		return b.mins - a.mins;
	});

	return sorted;
};

const getTopTwoActivities = (data: WeeklyRecaps): RecapBar[] => {
	// We grab the 'topActivities' list, then convert each to 'RecapBar' type
	const topActivities = data.currentWeek.recap.topActivities;
	const recapBars: RecapBar[] = topActivities.map((activity) =>
		getRecapProgressBar(activity.activityType, data),
	);

	return recapBars;
};

const getActivityName = (type: Activity) => {
	switch (type) {
		case "Walk": {
			return "Walks";
		}
		case "Strength": {
			return "Strength Training";
		}
		case "Cardio": {
			return "Cardio";
		}
		case "Stretch": {
			return "Stretching";
		}
		case "Timed": {
			return "Timed exercise";
		}
		case "Other": {
			return "Other exercise";
		}

		default:
			return type;
	}
};

const RecapActivitiesCard = ({ isActive = false, data }: Props) => {
	const recapBars: RecapBar[] = getSortedRecapProgressBars(data);
	const [one, two] = getTopTwoActivities(data);

	const header = (
		<>
			<h2 className={styles.Title}>
				Your top two activities were{" "}
				<b>{getActivityName(one.when as Activity)}</b> and{" "}
				<b>{getActivityName(two.when as Activity)}</b>.
			</h2>
			<h6 className={styles.Desc}>
				Looks like a nice variety of exercise this week.
			</h6>
		</>
	);
	const body = (
		<>
			<RecapProgressBars data={recapBars} color="var(--accent-yellow)" />
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="recentActivity"
			color="var(--accent-red)"
		/>
	);
};

export default RecapActivitiesCard;
