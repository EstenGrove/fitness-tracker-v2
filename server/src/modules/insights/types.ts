/**
 * 'WorkoutInsight':
 * - 'total': total # of times some metric was exceeded
 * - 'message': 'You have exceed the target reps 34 times'
 */
export interface WorkoutInsight {
	total: number;
	message: string;
}

export interface CardioInsights {
	exceededMins: WorkoutInsight;
	exceededReps: WorkoutInsight;
	exceededSets: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}
export interface StretchInsights {
	exceededMins: WorkoutInsight;
	exceededReps: WorkoutInsight;
	exceededSets: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}
export interface TimedInsights {
	exceededMins: WorkoutInsight;
	exceededReps: WorkoutInsight;
	exceededSets: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}
export interface OtherInsights {
	exceededMins: WorkoutInsight;
	exceededReps: WorkoutInsight;
	exceededSets: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}
export interface StrengthInsights {
	exceededMins: WorkoutInsight;
	exceededReps: WorkoutInsight;
	exceededSets: WorkoutInsight;
	exceededVolume: WorkoutInsight;
	exceededWeight: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}
export interface WalkInsights {
	exceededMins: WorkoutInsight;
	exceededMiles: WorkoutInsight;
	exceededSteps: WorkoutInsight;
	timesPerformed: WorkoutInsight;
}

export type ActivityInsights =
	| CardioInsights
	| StretchInsights
	| TimedInsights
	| OtherInsights
	| StrengthInsights
	| WalkInsights;

export interface InsightParams {
	startDate?: string;
	endDate?: string;
	workoutID?: number;
}
