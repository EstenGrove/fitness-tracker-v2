import type { DateRange, DateRangeDB } from "../types.ts";

export type ActivityRangeType = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";

export interface Segment {
	label: string;
	percent: number;
	color: string;
	mins: number;
}

export interface TotalTime {
	startDate: string;
	endDate: string;
	totalMins: number;
}
export interface TotalTimeDB {
	start_date: string;
	end_date: string;
	total_mins: number;
}

export interface ActivityStepsDB {
	avg_daily_steps: number;
	avg_daily_miles: number;
	total_workouts: number;
	total_steps: number;
	total_miles: number;
	start_date: string;
	end_date: string;
}

export interface ActivitySteps {
	avgDailySteps: number;
	avgDailyMiles: number;
	totalWorkouts: number;
	totalSteps: number;
	totalMiles: number;
	startDate: string;
	endDate: string;
}
export interface ActivityStrengthDB {
	avg_daily_reps: number;
	avg_daily_volume: number;
	total_workouts: number;
	total_volume: number;
	total_reps: number;
	start_date: string;
	end_date: string;
}
export interface ActivityStrength {
	avgDailyReps: number;
	avgDailyVolume: number;
	totalWorkouts: number;
	totalVolume: number;
	totalReps: number;
	startDate: string;
	endDate: string;
}
export interface ActivityCardioDB {
	avg_daily_duration: number;
	avg_daily_reps: number;
	total_reps: number;
	total_workouts: number;
	total_duration: number;
	start_date: string;
	end_date: string;
}
export interface ActivityCardio {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
}
export interface ActivityStretchDB {
	avg_daily_duration: number;
	avg_daily_reps: number;
	total_reps: number;
	total_workouts: number;
	total_duration: number;
	start_date: string;
	end_date: string;
}
export interface ActivityStretch {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
}

export interface ActivityTimedDB {
	avg_daily_duration: number;
	avg_daily_reps: number;
	total_reps: number;
	total_workouts: number;
	total_duration: number;
	start_date: string;
	end_date: string;
}
export interface ActivityTimed {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
}

export interface ActivityOtherDB {
	avg_daily_duration: number;
	avg_daily_reps: number;
	total_reps: number;
	total_workouts: number;
	total_duration: number;
	start_date: string;
	end_date: string;
}
export interface ActivityOther {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
}

export interface ActivityStepsSummaryDB {
	prev: ActivityStepsDB;
	current: ActivityStepsDB;
}
export interface ActivityStepsSummary {
	prev: ActivitySteps;
	current: ActivitySteps;
}
export interface ActivityStrengthSummaryDB {
	prev: ActivityStrengthDB;
	current: ActivityStrengthDB;
}
export interface ActivityStrengthSummary {
	prev: ActivityStrength;
	current: ActivityStrength;
}
export interface ActivityCardioSummaryDB {
	prev: ActivityCardioDB;
	current: ActivityCardioDB;
}
export interface ActivityCardioSummary {
	prev: ActivityCardio;
	current: ActivityCardio;
}
export interface ActivityStretchSummaryDB {
	prev: ActivityStretchDB;
	current: ActivityStretchDB;
}
export interface ActivityStretchSummary {
	prev: ActivityStretch;
	current: ActivityStretch;
}
export interface ActivityTimedSummaryDB {
	prev: ActivityTimedDB;
	current: ActivityTimedDB;
}
export interface ActivityTimedSummary {
	prev: ActivityTimed;
	current: ActivityTimed;
}
export interface ActivityOtherSummaryDB {
	prev: ActivityOtherDB;
	current: ActivityOtherDB;
}
export interface ActivityOtherSummary {
	prev: ActivityOther;
	current: ActivityOther;
}

// Includes the current (day|week|month|quarter|year) & the previous one
export interface AllActivitySummaries {
	walkSummary: ActivityStepsSummary;
	strengthSummary: ActivityStrengthSummary;
	cardioSummary: ActivityCardioSummary;
	stretchSummary: ActivityStretchSummary;
	timedSummary: ActivityTimedSummary;
	otherSummary: ActivityOtherSummary;
}
export interface AllActivitySummariesDB {
	walkSummary: ActivityStepsSummaryDB;
	strengthSummary: ActivityStrengthSummaryDB;
	cardioSummary: ActivityCardioSummaryDB;
	stretchSummary: ActivityStretchSummaryDB;
	timedSummary: ActivityTimedSummaryDB;
	otherSummary: ActivityOtherSummaryDB;
}

export interface ActivitySummaryForDB {
	dateRange: DateRange;
	summaries: AllActivitySummariesDB;
	totalMins: TotalTimeDB;
	segments: Segment[];
}
export interface ActivitySummaryFor {
	dateRange: DateRange;
	summaries: AllActivitySummaries;
	totalMins: TotalTime;
	segments: Segment[];
}
