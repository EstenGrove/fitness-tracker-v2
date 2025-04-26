import { DateRange } from "../types";

export interface ActivitySummaryParams {
	userID: string;
	targetDate: string;
	rangeType: ActivityRangeType;
}

export interface Segment {
	label: string;
	percent: number;
	color: string;
	mins: number;
}

export interface RecentTotalTime {
	hrs: number;
	mins: number;
}

export interface TotalTime {
	startDate: string;
	endDate: string;
	totalMins: number;
}

export interface RecentActivitySummary {
	segments: Segment[];
	totalTime: TotalTime;
	summaries: ActivitySummaryFor;
}

export type ActivityRangeType = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
export enum EActivityRangeType {
	DAY = "DAY",
	WEEK = "WEEK",
	MONTH = "MONTH",
	QUARTER = "QUARTER",
	YEAR = "YEAR",
}

// Summary for a given range
export interface ActivitySteps {
	avgDailySteps: number;
	avgDailyMiles: number;
	totalWorkouts: number;
	totalSteps: number;
	totalMiles: number;
	startDate: string;
	endDate: string;
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
export interface ActivityCardio {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
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
export interface ActivityTimed {
	avgDailyDuration: number;
	avgDailyReps: number;
	totalReps: number;
	totalWorkouts: number;
	totalDuration: number;
	startDate: string;
	endDate: string;
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

export interface ActivityStepsSummary {
	prev: ActivitySteps;
	current: ActivitySteps;
}
export interface ActivityStrengthSummary {
	prev: ActivityStrength;
	current: ActivityStrength;
}
export interface ActivityCardioSummary {
	prev: ActivityCardio;
	current: ActivityCardio;
}
export interface ActivityStretchSummary {
	prev: ActivityStretch;
	current: ActivityStretch;
}
export interface ActivityTimedSummary {
	prev: ActivityTimed;
	current: ActivityTimed;
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

export interface ActivitySummaryFor {
	dateRange: DateRange;
	summaries: AllActivitySummaries;
	totalMins: TotalTime;
	segments: Segment[];
}
