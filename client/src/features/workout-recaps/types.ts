import type {
	CardioInsights,
	OtherInsights,
	StrengthInsights,
	StretchInsights,
	TimedInsights,
	WalkInsights,
} from "../insights/types.js";
import type {
	CardioTrends,
	OtherTrends,
	StrengthTrends,
	StretchTrends,
	TimedTrends,
	WalkTrends,
} from "../trends/types.js";

// RECAPS //
/* CARDIO */
export interface CardioRecap {
	maxReps: number;
	totalMins: number;
	totalReps: number;
	totalWorkouts: number;
}
// 'history' array entry
export interface CardioRecapHistory {
	historyID: number;
	workoutDate: string;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalCalories: number;
}

/* STRETCH */
export interface StretchRecap {
	maxReps: number;
	totalMins: number;
	totalReps: number;
	totalWorkouts: number;
}
// 'history' array entry
export interface StretchRecapHistory {
	historyID: number;
	workoutDate: string;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalCalories: number;
}

/* TIMED */
export interface TimedRecap {
	maxReps: number;
	totalMins: number;
	totalReps: number;
	totalWorkouts: number;
}
// 'history' array entry
export interface TimedRecapHistory {
	historyID: number;
	workoutDate: string;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalCalories: number;
}

/* TIMED */
export interface OtherRecap {
	maxReps: number;
	totalMins: number;
	totalReps: number;
	totalWorkouts: number;
}
// 'history' array entry
export interface OtherRecapHistory {
	historyID: number;
	workoutDate: string;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalCalories: number;
	totalWorkouts: number;
}

/* STRENGTH */
export interface StrengthRecap {
	maxReps: number;
	maxVolume: number;
	totalMins: number;
	totalReps: number;
	totalVolume: number;
	totalWorkouts: number;
}

// 'history' array entry
export interface StrengthRecapHistory {
	historyID: number;
	workoutDate: string;
	maxReps: number;
	maxVolume: number;
	est1RM: number;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalVolume: number;
	totalCalories: number;
}

/* WALK */
export interface WalkRecap {
	maxMiles: number;
	maxSteps: number;
	maxCalories: number;
	avgMiles: number;
	avgMins: number;
	avgSteps: number;
	totalMins: number;
	totalSteps: number;
	totalMiles: number;
	totalCalories: number;
	totalWorkouts: number;
}
// 'history' array entry
export interface WalkRecapHistory {
	historyID: number;
	workoutDate: string;
	maxMiles: number;
	maxSteps: number;
	maxPace: number;
	maxCalories: number;
	totalMins: number;
	totalMiles: number;
	totalSteps: number;
	totalCalories: number;
}

export type ActivityRecap = {
	recap:
		| StrengthRecap
		| WalkRecap
		| TimedRecap
		| StretchRecap
		| OtherRecap
		| CardioRecap;
	history:
		| StrengthRecapHistory[]
		| WalkRecapHistory[]
		| TimedRecapHistory[]
		| StretchRecapHistory[]
		| OtherRecapHistory[]
		| CardioRecapHistory[];
};

export interface StrengthRecapDetails {
	recap: StrengthRecap;
	trends: StrengthTrends;
	insights: StrengthInsights;
	history: StrengthRecapHistory[];
}
export interface StretchRecapDetails {
	recap: StretchRecap;
	trends: StretchTrends;
	insights: StretchInsights;
	history: StretchRecapHistory[];
}
export interface WalkRecapDetails {
	recap: WalkRecap;
	trends: WalkTrends;
	insights: WalkInsights;
	history: WalkRecapHistory[];
}
export interface CardioRecapDetails {
	recap: CardioRecap;
	trends: CardioTrends;
	insights: CardioInsights;
	history: CardioRecapHistory[];
}
export interface TimedRecapDetails {
	recap: TimedRecap;
	trends: TimedTrends;
	insights: TimedInsights;
	history: TimedRecapHistory[];
}
export interface OtherRecapDetails {
	recap: OtherRecap;
	trends: OtherTrends;
	insights: OtherInsights;
	history: OtherRecapHistory[];
}

export type ActivityRecapDetails =
	| WalkRecapDetails
	| StrengthRecapDetails
	| CardioRecapDetails
	| StretchRecapDetails
	| TimedRecapDetails
	| OtherRecapDetails;

export type ActivityRecapDataMap = {
	Strength: StrengthRecapDetails;
	Stretch: StretchRecapDetails;
	Cardio: CardioRecapDetails;
	Walk: WalkRecapDetails;
	Timed: TimedRecapDetails;
	Other: OtherRecapDetails;
};
