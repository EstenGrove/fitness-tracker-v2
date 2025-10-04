export interface ActiveDaysStreakDB {
	start_date: string;
	end_date: string;
	days_active: number;
}
export interface ActiveDaysStreak {
	startDate: string;
	endDate: string;
	daysActive: number;
}

export interface MinsMonthTotal {
	startDate: string;
	endDate: string;
	month: string; // 'January'
	mins: number;
}

export interface SummaryMonth<T extends object> {
	month: string; // '2025-01'
	summary: T;
}

export interface StrengthSummary {
	startDate: string;
	endDate: string;
	totalReps: number;
	totalVolume: number;
	totalWorkouts: number;
	avgDailyReps: number;
	avgDailyVolume: number;
	maxWeight: number;
}
export interface StretchSummary {
	startDate: string;
	endDate: string;
	totalReps: number;
	totalDuration: number;
	totalWorkouts: number;
	avgDailyReps: number;
	avgDailyDuration: number;
}
export interface WalkSummary {
	startDate: string;
	endDate: string;
	totalMiles: number;
	totalSteps: number;
	avgDailyMiles: number;
	avgDailySteps: number;
}
export interface CardioSummary {
	startDate: string;
	endDate: string;
	totalReps: number;
	totalDuration: number;
	totalWorkouts: number;
	avgDailyReps: number;
	avgDailyDuration: number;
}
export interface TimedSummary {
	startDate: string;
	endDate: string;
	totalReps: number;
	totalDuration: number;
	totalWorkouts: number;
	avgDailyReps: number;
	avgDailyDuration: number;
}
export interface OtherSummary {
	startDate: string;
	endDate: string;
	totalReps: number;
	totalDuration: number;
	totalWorkouts: number;
	avgDailyReps: number;
	avgDailyDuration: number;
}

export type StrengthSummaryMonth = SummaryMonth<StrengthSummary>;
export type StretchSummaryMonth = SummaryMonth<StretchSummary>;
export type WalkSummaryMonth = SummaryMonth<WalkSummary>;
export type CardioSummaryMonth = SummaryMonth<CardioSummary>;
export type TimedSummaryMonth = SummaryMonth<TimedSummary>;
export type OtherSummaryMonth = SummaryMonth<OtherSummary>;
