import type { WorkoutSchedule, WorkoutScheduleDB } from "./types.ts";

const normalizeWorkoutSchedule = (
	schedule: WorkoutScheduleDB
): WorkoutSchedule => {
	return {
		userID: schedule.user_id,
		scheduleID: schedule.schedule_id,
		activityType: schedule.activity_type,
		workoutID: schedule.workout_id,
		startDate: schedule.start_date,
		endDate: schedule.end_date,
		startTime: schedule.start_time,
		endTime: schedule.end_time,
		interval: schedule.interval,
		frequency: schedule.frequency,
		byDay: schedule.by_day,
		byMonth: schedule.by_month,
		byMonthDay: schedule.by_month_day,
		isActive: schedule.is_active,
		createdDate: schedule.created_date,
	};
};

export { normalizeWorkoutSchedule };
