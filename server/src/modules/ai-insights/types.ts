import type { Activity } from "../types.js";

export interface AIWalkInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	totalDays: number;
	totalMins: number;
	totalMiles: number;
	totalSteps: number;
	totalWorkouts: number;
	activeDays: number;
	avgDailyMiles: number;
	avgDailySteps: number;
	activeDayPercentage: number;
}
export interface AIStrengthInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	maxWeight: number;
	totalDays: number;
	totalMins: number;
	totalReps: number;
	activeDays: number;
	totalVolume: number;
	avgDailyReps: number;
	totalWorkouts: number;
	avgDailyVolume: number;
	activeDayPercent: number;
}
export interface AICardioInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	totalDays: number;
	totalMins: number;
	totalReps: number;
	activeDays: number;
	avgDailyReps: number;
	totalWorkouts: number;
	activeDayPercent: number;
}
export interface AIStretchInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	totalDays: number;
	totalMins: number;
	totalReps: number;
	activeDays: number;
	avgDailyReps: number;
	totalWorkouts: number;
	activeDayPercent: number;
}
export interface AITimedInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	totalDays: number;
	totalMins: number;
	totalReps: number;
	activeDays: number;
	avgDailyReps: number;
	totalWorkouts: number;
	activeDayPercent: number;
}
export interface AIOtherInsightsForRange {
	range: {
		startDate: string;
		endDate: string;
	};
	totalDays: number;
	totalMins: number;
	totalReps: number;
	activeDays: number;
	avgDailyReps: number;
	totalWorkouts: number;
	activeDayPercent: number;
}

export type AIInsightsDataOfType =
	| AIWalkInsightsForRange
	| AIStrengthInsightsForRange
	| AICardioInsightsForRange
	| AIStretchInsightsForRange
	| AITimedInsightsForRange
	| AIOtherInsightsForRange;

export interface AIInsightsByActivity {
	Walk: AIWalkInsightsForRange;
	Strength: AIStrengthInsightsForRange;
	Cardio: AICardioInsightsForRange;
	Stretch: AIStretchInsightsForRange;
	Timed: AITimedInsightsForRange;
	Other: AIOtherInsightsForRange;
}

export interface AIInsightsData<T extends Activity = Activity> {
	current: AIInsightsByActivity[T];
	previous: AIInsightsByActivity[T];
}

export interface AIInsightsForAllActivities {
	walk: AIWalkInsightsForRange;
	strength: AIStrengthInsightsForRange;
	cardio: AICardioInsightsForRange;
	stretch: AIStretchInsightsForRange;
	timed: AITimedInsightsForRange;
	other: AIOtherInsightsForRange;
}

export interface AIInsights {
	insightsData: AIInsightsForAllActivities;
	insightsMessage: string;
}
