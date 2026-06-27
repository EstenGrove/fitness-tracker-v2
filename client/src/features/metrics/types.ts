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
	deltaSets: number;
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

// CHART DATA FOR METRICS //
export interface ActivityMetricsDataEntry {
	date: string;
	sets?: number;
	reps?: number;
	duration?: number;
	volume?: number;
	pace?: number;
	miles?: number;
	steps?: number;
}

export interface StrengthMetricsData {
	sets: ActivityMetricsDataEntry[];
	reps: ActivityMetricsDataEntry[];
	volume: ActivityMetricsDataEntry[];
	duration: ActivityMetricsDataEntry[];
}

export interface StrengthMetricsAndData {
	data: StrengthMetricsData;
	compare: StrengthMetrics;
}

export interface ExerciseMetricsData {
	sets: ActivityMetricsDataEntry[];
	reps: ActivityMetricsDataEntry[];
	volume: ActivityMetricsDataEntry[];
	duration: ActivityMetricsDataEntry[];
}

export interface ExerciseMetricsAndData {
	data: ExerciseMetricsData;
	compare: ExerciseMetrics;
}

export interface WalkMetricsData {
	pace: ActivityMetricsDataEntry[];
	miles: ActivityMetricsDataEntry[];
	steps: ActivityMetricsDataEntry[];
	duration: ActivityMetricsDataEntry[];
}

export interface WalkMetricsAndData {
	data: WalkMetricsData;
	compare: WalkMetrics;
}

export type ActivityMetricsData =
	| StrengthMetricsData
	| ExerciseMetricsData
	| WalkMetricsData;

export type StrengthMetricsCardDataMap = {
	Summary: StrengthMetrics;
	Sets: StrengthMetrics; // chart cards, if needed
	Reps: StrengthMetrics;
	Volume: StrengthMetrics;
	Duration: StrengthMetrics;
};

export type WalkMetricsCardDataMap = {
	Summary: WalkMetrics;
	Pace: WalkMetrics;
	Miles: WalkMetrics;
	Steps: WalkMetrics;
	Duration: WalkMetrics;
};

export type CardioMetricsCardDataMap = {
	Summary: ExerciseMetrics;
	Duration: ExerciseMetrics;
	Distance: ExerciseMetrics;
	Calories: ExerciseMetrics;
};

export type StretchMetricsCardDataMap = {
	Summary: ExerciseMetrics;
	Duration: ExerciseMetrics;
	Distance: ExerciseMetrics;
	Calories: ExerciseMetrics;
};

export type TimedMetricsCardDataMap = {
	Summary: ExerciseMetrics;
	Duration: ExerciseMetrics;
	Distance: ExerciseMetrics;
	Calories: ExerciseMetrics;
};

export type OtherMetricsCardDataMap = {
	Summary: ExerciseMetrics;
	Duration: ExerciseMetrics;
	Distance: ExerciseMetrics;
	Calories: ExerciseMetrics;
};

export type ActivityMetricsCardDataMap = {
	Summary: ActivityMetrics;
	Sets: ActivityMetrics;
	Reps: ActivityMetrics;
	Volume: ActivityMetrics;
	Pace: ActivityMetrics;
	Miles: ActivityMetrics;
	Steps: ActivityMetrics;
	Duration: ActivityMetrics;
};
