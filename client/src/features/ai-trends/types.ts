// Row-level direction (matches the CHECK on workout_trend_notices.direction)
export type AINoticeDirection = "POSITIVE" | "NEGATIVE" | "MIXED";
// Per-metric direction; STABLE = didn't pass the thresholds
export type AIMetricDirection = "POSITIVE" | "NEGATIVE" | "STABLE";

export type AITrendArrowDirection = "up" | "down";

// Output of get_weekly_workout_totals()
export interface AIWeeklyTotal {
	weekStart: string; // YYYY-MM-DD (Sunday)
	weekEnd: string; // YYYY-MM-DD (Saturday)
	totalMins: number;
	totalWorkouts: number;
}
export interface AIWeeklyTotalsData {
	lastWeekStart: string;
	firstWorkoutDate: string | null;
	weeks: AIWeeklyTotal[];
}

// Shape of workout_trend_notices.metrics (JSONB)
export interface AINoticeMetric {
	recent: number;
	prior: number;
	pctChange: number;
	direction: AIMetricDirection;
}
export interface AINoticeMetrics {
	avgWeeklyMins: AINoticeMetric;
	avgWeeklyWorkouts: AINoticeMetric;
}

export type AINoticeGeneratedBy = "AI" | "TEMPLATE";

export interface AITrendNotice {
	noticeID: string;
	userID: string;
	weekStart: string;
	direction: AINoticeDirection;
	metrics: AINoticeMetrics;
	title: string;
	message: string;
	generatedBy: AINoticeGeneratedBy;
	createdAt: Date;
	dismissedAt: Date | null;
}

// Returned by 'getLatestTrendNotice': the notice + the weekly totals it was based on (for charts)
export interface AILatestTrendNotice extends AITrendNotice {
	weeks: AIWeeklyTotal[];
}

export interface DismissedTrendNotice {
	noticeID: string;
	userID: string;
	dismissedAt: string;
}
