import { Activity, ActivityStyles } from "../features/shared/types";

const ACTIVITIES: Activity[] = [
	"Walk",
	"Strength",
	"Stretch",
	"Timed",
	"Cardio",
	"Other",
];

const ACTIVITY_STYLES: ActivityStyles = {
	Walk: {
		icon: "directions_walk",
		color: "var(--accent-blue)",
		bg: "rgba(0, 124, 255, 0.3)",
	},
	Strength: {
		// icon: "dumbbell",
		icon: "fitness_center",
		color: "var(--accent-purple)",
		bg: "rgba(124, 58, 237, 0.2)",
	},
	Stretch: {
		icon: "stretching-2",
		color: "var(--accent-green)",
		bg: "rgba(0, 226, 189, .3)",
	},
	Cardio: {
		icon: "heart-with-pulse",
		color: "var(--accent-red)",
		bg: "rgba(185, 0, 52, 0.3)",
	},
	Timed: {
		icon: "timer",
		color: "var(--accent)",
		bg: "rgba(255, 0, 102, .3)",
	},
	Other: {
		icon: "dots-three-horizontal",
		color: "var(--blueGrey900)",
		bg: "",
	},
} as const;

const getActivityStyles = (activityType: Activity) => {
	if (activityType in ACTIVITY_STYLES) {
		const item = ACTIVITY_STYLES[activityType];
		return item;
	} else {
		const item = ACTIVITY_STYLES.Other;
		return item;
	}
};

const isWalkType = (type: Activity | string) => {
	return type === "Walk";
};

const isStrengthType = (type: Activity | string) => {
	return type === "Strength";
};
const isExerciseType = (type: Activity | string) => {
	return (
		type === "Stretch" ||
		type === "Cardio" ||
		type === "Timed" ||
		type === "Other"
	);
};

export {
	ACTIVITIES,
	ACTIVITY_STYLES,
	getActivityStyles,
	isWalkType,
	isStrengthType,
	isExerciseType,
};
