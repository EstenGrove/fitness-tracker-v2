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

type Props = {
	isActive: boolean;
	data: WeeklyRecaps;
};

const getRecapProgressBars = (data: WeeklyRecaps): RecapBar[] => {
	if (!data) return [];
	const recapBars: RecapBar[] = [];
	const thisWeek: WeeklyRecap = data.currentWeek;
	const activities: WeeklyRecapActivities = thisWeek.activities;

	for (const activity in activities) {
		const dataForActivity = activities[activity as keyof WeeklyRecapActivities];
		const { activityType, totalWorkouts, totalMins } = dataForActivity;
		const newBar: RecapBar = {
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

const getTopTwoActivities = (recapBars: RecapBar[]): RecapBar[] => {
	// We read from the 'when' since that's being used for 'activity type'
	const two = recapBars.slice(0, 2);

	return two;
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
	const [one, two] = getTopTwoActivities(recapBars);

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
