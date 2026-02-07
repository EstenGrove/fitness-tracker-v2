export type TrendDirection = "up" | "down" | "flat";

export interface TrendMetric {
	delta: number;
	direction: TrendDirection;
}

/**
 * Trends by Activity Type:
 */

export interface StrengthTrends {
	mins: TrendMetric;
	reps: TrendMetric;
	sets: TrendMetric;
	volume: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}
export interface WalkTrends {
	mins: TrendMetric;
	pace: TrendMetric;
	steps: TrendMetric;
	calories: TrendMetric;
	miles: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}
export interface StretchTrends {
	mins: TrendMetric;
	reps: TrendMetric;
	sets: TrendMetric;
	volume: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}
export interface CardioTrends {
	mins: TrendMetric;
	reps: TrendMetric;
	sets: TrendMetric;
	volume: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}
export interface TimedTrends {
	mins: TrendMetric;
	reps: TrendMetric;
	sets: TrendMetric;
	volume: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}
export interface OtherTrends {
	mins: TrendMetric;
	reps: TrendMetric;
	sets: TrendMetric;
	volume: TrendMetric;
	rangeDays: number;
	sampleSize: number;
}

export type ActivityTrends =
	| StrengthTrends
	| WalkTrends
	| StretchTrends
	| CardioTrends
	| TimedTrends
	| OtherTrends;
