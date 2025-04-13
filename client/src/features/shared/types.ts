export type Activity =
	| "Walk"
	| "Strength"
	| "Stretch"
	| "Cardio"
	| "Timed"
	| "Other";

export interface ActivityStyle {
	icon: string;
	color: string;
	bg?: string;
}

export interface ActivityType {
	activityID: number;
	activityType: Activity;
	activityDesc: string;
	activityKey: Uppercase<Activity>;
	isActive: boolean;
	createdDate: string;
}

export type ActivityStyles = Record<Activity, ActivityStyle>;
// RECURRING/SCHEDULE TYPES
export type RepeatType = "Daily" | "Weekly" | "Monthly" | "Yearly" | "None";

export type Effort =
	| "Easy"
	| "Moderate"
	| "Hard"
	| "Strenuous"
	| "All Out"
	| "None";
