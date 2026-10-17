export const TREND_NOTICES_CONFIG = {
	WINDOW_WEEKS: 4, // Number of weeks to compare
	PCT_THRESHOLD: 0.1, // Percentage change threshold (eg. if the change is greater than 20%, it's considered notable)
	MIN_DELTA_MINS: 5, // Minimum delta threshold in minutes (eg. if the change is greater than 5 minutes, it's considered notable)
	MIN_DELTA_WORKOUTS: 0.5, // Minimum delta threshold in workouts (eg. # of workouts per week)
};
