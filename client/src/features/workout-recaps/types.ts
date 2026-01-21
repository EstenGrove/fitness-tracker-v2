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
}
// 'history' array entry
export interface CardioWorkoutRecap {
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
}
// 'history' array entry
export interface StretchWorkoutRecap {
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
}
// 'history' array entry
export interface TimedWorkoutRecap {
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
}
// 'history' array entry
export interface OtherWorkoutRecap {
	historyID: number;
	workoutDate: string;
	totalMins: number;
	totalReps: number;
	totalSets: number;
	totalCalories: number;
}

/* STRENGTH */
export interface StrengthRecap {
	maxReps: number;
	maxVolume: number;
	totalMins: number;
	totalReps: number;
	totalVolume: number;
}
// 'history' array entry
export interface StrengthWorkoutRecap {
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
	totalMins: number;
	totalSteps: number;
	totalCalories: number;
}
// 'history' array entry
export interface WalkWorkoutRecap {
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
		| StrengthWorkoutRecap
		| WalkWorkoutRecap
		| TimedWorkoutRecap
		| StretchWorkoutRecap
		| OtherWorkoutRecap
		| CardioWorkoutRecap;
};

export interface StrengthRecapDetails {
	recap: StrengthRecap;
	trends: StrengthTrends;
	insights: StrengthInsights;
}
export interface StretchRecapDetails {
	recap: StretchRecap;
	trends: StretchTrends;
	insights: StretchInsights;
}
export interface WalkRecapDetails {
	recap: WalkRecap;
	trends: WalkTrends;
	insights: WalkInsights;
}
export interface CardioRecapDetails {
	recap: CardioRecap;
	trends: CardioTrends;
	insights: CardioInsights;
}
export interface TimedRecapDetails {
	recap: TimedRecap;
	trends: TimedTrends;
	insights: TimedInsights;
}
export interface OtherRecapDetails {
	recap: OtherRecap;
	trends: OtherTrends;
	insights: OtherInsights;
}

export type ActivityRecapDetails =
	| WalkRecapDetails
	| StrengthRecapDetails
	| CardioRecapDetails
	| StretchRecapDetails
	| TimedRecapDetails
	| OtherRecapDetails;
