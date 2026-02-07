import sprite from "../assets/icons/main.svg";
import sprite2 from "../assets/icons/main.svg";
import alt from "../assets/icons/calendar.svg";

export type IconSize = "XSM" | "SM" | "MD" | "LG" | "XLG" | "XXLG";

const iconsMap = {
	// main.svg
	1: {
		effort: "effort",
		exercise: "running",
		strength: "strength",
		dumbbell: "dumbbell",
		dumbbell2: "dumbbell-2",
		lift: "weightlift-2",
		schedule: "schedule",
		schedule2: "schedule-2",
		run: "running",
		pushups: "pushups",
		curls: "curls-with-dumbbells",
		curls2: "curls-with-dumbbells-2",
		weight: "weight-pound-2",
		weight2: "weight-pound",
		weight3: "weight-pound-3",
		location: "location",
		heart: "heart-health",
		heart2: "heart-health-2",
		timer: "time",
		calories: "caloric-energy-2",
		calories2: "caloric-energy",
		time: "session-timeout",
		history: "session-timeout",
		history2: "time-machine",
		calendarHistory: "installment-plan",
		calendarHistory2: "installment-plan-2",
		calendarHistory3: "installment-plan-3",
		medal: "medal",
		speedometer: "speedometer",
		done: "done",
		checkmark: "checkmark",
		checkmark2: "checkmark-2",
		checkmark3: "checkmark-3",
		cardio: "heart-health",
		cardio2: "heart-health-2",
		cardio3: "heart-health-3",
		badge: "guarantee",
		badge2: "guarantee-2",
		badge3: "guarantee-3",
		strategy: "strategy-board",
		inProgress: "in-progress",
		info: "info",
		info2: "info-2",
		pulse: "pulse",
		plus: "plus",
		minus: "minus",
		fire: "gas-industry",
		footstep: "footstep",
		steps: "step-length",
		// steps: "footstep",
		sole: "sole",
		recentActivity: "session-timeout",
		noData: "no-data-availible-2",
		noData2: "no-data-availible",
		noData3: "no-data-availible-3",
		empty: "fridge-with-open-door",
		empty2: "fridge-with-open-door-2",
		empty3: "fridge-with-open-door-3",
		pill: "pill",
		pillBottle: "pillBottle",
		weightLift: "weightlift-2",
	},
	2: {
		// HABITS - sprite2
		medal: "medal-first-place",
		smoke: "no-smoking",
		smoke2: "no-smoking-2",
		smoke3: "no-smoking-3",
		smoke4: "no-smoking-4",
		water: "water",
		water2: "water-2",
		water3: "water-3",
		water4: "water-4",
		water5: "water-5",
		drinkWater: "bottle-of-water",
		drinkWater2: "bottle-of-water-2",
		coffee: "coffee",
		coffee2: "espresso-cup",
		mario: "super-mario",
		games: "controller",
		gameController: "controller-2",
		challenge: "person-growth",
		paint: "paint-palette",
		draw: "paint-brush",
		write: "pen",
		journal: "saving-book",
		goal: "goal",
		stretching: "stretching",
		coffeeCup: "cup",
		cycle: "circular-arrows",
		read: "reading",
		read2: "read-in-bed",
		travel: "travel-card",
		travel2: "marker-sun",
		bungalow: "bungalow",
		repeat: "synchronize",
	},
} as const;

export type IconKey = keyof (typeof iconsMap)[1] | keyof (typeof iconsMap)[2];

const getSprite = (name: string) => {
	const in1 = name in iconsMap[1];
	const in2 = name in iconsMap[2];

	if (in1) {
		return sprite;
	} else if (in2) {
		return sprite2;
	} else {
		return alt;
	}
};

const getIcon = (name: string): string => {
	if (name in iconsMap[1]) {
		return iconsMap[1][name as keyof object];
	} else if (name in iconsMap[2]) {
		return iconsMap[2][name as keyof object];
	} else {
		return name;
	}
};

export { iconsMap, getSprite, getIcon };
