// Row-level direction (matches the CHECK on workout_trend_notices.direction)
export type AINoticeDirection = "POSITIVE" | "NEGATIVE" | "MIXED";
// Per-metric direction; STABLE = didn't pass the thresholds
export type AIMetricDirection = "POSITIVE" | "NEGATIVE" | "STABLE";

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

export interface DetectedAITrend {
	direction: AINoticeDirection;
	metrics: AINoticeMetrics;
}

// Minimal info about previously-created notices (for the cooldown check)
export interface AIPriorNotice {
	weekStart: string;
	direction: AINoticeDirection;
}

export type AINoticeGeneratedBy = "AI" | "TEMPLATE";

// Generated content for a detected trend
export interface AINoticeContent {
	title: string;
	message: string;
	generatedBy: AINoticeGeneratedBy;
}

// A row from workout_trend_notices
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

export interface AINewTrendNotice extends DetectedAITrend, AINoticeContent {
	userID: string;
	weekStart: string;
}
