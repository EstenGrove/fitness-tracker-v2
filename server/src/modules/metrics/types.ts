import type { DateRange } from "../types.js";

// STRENGTH //
export interface StrengthHistoryMetrics {
	range: DateRange;
	totalWorkouts: number;
	// AVG
	avgDuration: number;
	avgCalories: number;
	avgReps: number;
	avgSets: number;
	avgVolume: number;
	avgWeight: number;
	// MAX
	maxReps: number;
	maxSets: number;
	maxVolume: number;
	maxWeight: number;
	maxDuration: number;
	maxCalories: number;
}

export interface StrengthSessionMetrics {
	historyID: number;
	workoutID: number;
	avgReps: number;
	avgSets: number;
	maxReps: number;
	maxSets: number;
	calories: number;
	duration: number;
	avgVolume: number;
	avgWeight: number;
	maxVolume: number;
	maxWeight: number;
}

export interface StrengthMetricsComparison {
	deltaReps: number;
	deltaSets: number;
	deltaVolume: number;
	deltaWeight: number;
	deltaDuration: number;
	deltaCalories: number;
}

// WALK //
export interface WalkHistoryMetrics {
	range: DateRange;
	avgPace: number;
	maxPace: number;
	avgMiles: number;
	avgSteps: number;
	maxMiles: number;
	maxSteps: number;
	avgCalories: number;
	avgDuration: number;
	maxCalories: number;
	maxDuration: number;
	totalWorkouts: number;
}

export interface WalkSessionMetrics {
	historyID: number;
	workoutID: number;
	pace: number;
	miles: number;
	steps: number;
	calories: number;
	duration: number;
}

export interface WalkMetricsComparison {
	deltaPace: number;
	deltaMiles: number;
	deltaSteps: number;
	deltaCalories: number;
	deltaDuration: number;
}

// EXERCISE: Cardio, Stretch, Timed, Other //
export interface ExerciseHistoryMetrics {
	range: DateRange;
	totalWorkouts: number;
	// AVG
	avgDuration: number;
	avgCalories: number;
	avgReps: number;
	avgSets: number;
	avgVolume: number;
	avgWeight: number;
	// MAX
	maxReps: number;
	maxSets: number;
	maxVolume: number;
	maxWeight: number;
	maxDuration: number;
	maxCalories: number;
}

export interface ExerciseSessionMetrics {
	historyID: number;
	workoutID: number;
	avgReps: number;
	avgSets: number;
	maxReps: number;
	maxSets: number;
	calories: number;
	duration: number;
	avgVolume: number;
	avgWeight: number;
	maxVolume: number;
	maxWeight: number;
}

export interface ExerciseMetricsComparison {
	deltaReps: number;
	deltaSets: number;
	deltaVolume: number;
	deltaWeight: number;
	deltaDuration: number;
	deltaCalories: number;
}
