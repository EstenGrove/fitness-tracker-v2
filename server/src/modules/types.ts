export type Activity =
	| "Walk"
	| "Strength"
	| "Stretch"
	| "Cardio"
	| "Timed"
	| "Other";

export interface DateRange {
	startDate: string;
	endDate: string;
}

export type Effort =
	| "Easy"
	| "Moderate"
	| "Hard"
	| "Strenuous"
	| "All Out"
	| "None";
