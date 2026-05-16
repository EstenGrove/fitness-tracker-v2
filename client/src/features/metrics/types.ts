import { RangeParams } from "../types";
// HISTORY METRICS COMPARISON
// - The following includes various metrics for a given range, compared against a specific workout session. This is used to display the comparison in the HistoryDetails component.

export interface StrengthHistoryMetrics {
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
	avgReps: number;
	avgSets: number;
	avgVolume: number;
	avgWeight: number;
	maxReps: number;
	maxSets: number;
	maxVolume: number;
	maxWeight: number;
}

export interface StrengthMetricsComparison {
	deltaReps: number;
	deltaWeight: number;
	deltaDuration: number;
	deltaCalories: number;
	deltaEffort: number;
}

export interface StrengthSessionComparison {
	history: StrengthHistoryMetrics;
	session: StrengthSessionMetrics;
	comparison: StrengthMetricsComparison;
	range?: {
		startDate: string;
		endDate: string;
	};
}

export interface ExerciseHistoryMetrics {
	totalWorkouts: number;
	avgDuration: number;
	avgCalories: number;
	avgReps: number;
	avgSets: number;
	avgVolume: number;
	avgWeight: number;
	maxReps: number;
	maxSets: number;
	maxVolume: number;
	maxWeight: number;
	maxDuration: number;
	maxCalories: number;
}

export interface ExerciseSessionMetrics {
	avgReps: number;
	avgSets: number;
	avgVolume: number;
	avgWeight: number;
	maxReps: number;
	maxSets: number;
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

export interface WalkHistoryMetrics {
	totalWorkouts: number;
	avgDuration: number;
	avgCalories: number;
	avgPace: number;
	avgMiles: number;
	avgSteps: number;
	maxPace: number;
	maxMiles: number;
	maxSteps: number;
	maxDuration: number;
	maxCalories: number;
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

export interface WalkMetrics {
	range: RangeParams;
	history: WalkHistoryMetrics;
	session: WalkSessionMetrics;
	comparison: WalkMetricsComparison;
}
export interface ExerciseMetrics {
	range: RangeParams;
	history: ExerciseHistoryMetrics;
	session: ExerciseSessionMetrics;
	comparison: ExerciseMetricsComparison;
}
export interface StrengthMetrics {
	range: RangeParams;
	history: StrengthHistoryMetrics;
	session: StrengthSessionMetrics;
	comparison: StrengthMetricsComparison;
}

export type ActivityMetrics = ExerciseMetrics | StrengthMetrics | WalkMetrics;
