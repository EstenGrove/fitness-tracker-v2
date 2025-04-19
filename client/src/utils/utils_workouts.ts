import { addMinutes, differenceInMinutes } from "date-fns";
import { Activity, Effort } from "../features/shared/types";
import { AsyncResponse } from "../features/types";
import {
	ExerciseSet,
	StrengthSet,
	TodaysWorkout,
	Workout,
	WorkoutDetails,
} from "../features/workouts/types";
import { currentEnv, workoutApis } from "./utils_env";
import { formatDateTime, parseAnyTime } from "./utils_dates";

export type WorkoutSet = StrengthSet | ExerciseSet;
export interface MarkAsDoneBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	effort: Effort;
	startTime: string;
	endTime: string;
	workoutLength: number;
	steps?: number;
	miles?: number;
	pace?: number;
	exercise?: string;
	sets?: WorkoutSet[];
}

export interface LogWorkoutBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	startTime: string;
	endTime: string;
	workoutLength: number;
	effort?: Effort;
	steps?: number;
	miles?: number;
	pace?: number;
	exercise?: string;
	sets?: WorkoutSet[];
}

export type TodaysWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type WorkoutDetailsResp = AsyncResponse<WorkoutDetails>;
export type AllWorkoutsResp = AsyncResponse<{ workouts: Workout[] }>;

const logWorkout = async (userID: string, details: LogWorkoutBody) => {
	let url = currentEnv.base + workoutApis.logWorkout;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				userID,
				details,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchTodaysWorkouts = async (
	userID: string,
	targetDate: string
): TodaysWorkoutsResp => {
	let url = currentEnv.base + workoutApis.getTodaysWorkouts;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchWorkoutDetails = async (
	userID: string,
	workoutID: number,
	activityType: Activity
): WorkoutDetailsResp => {
	let url = currentEnv.base + workoutApis.getWorkoutDetails;
	url +=
		"?" +
		new URLSearchParams({ userID, workoutID: String(workoutID), activityType });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const markWorkoutAsDone = async (userID: string, details: MarkAsDoneBody) => {
	let url = currentEnv.base + workoutApis.markAsDone;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userID,
				details,
			}),
		});
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchAllWorkouts = async (userID: string): AllWorkoutsResp => {
	let url = currentEnv.base + workoutApis.getAll;
	url += "?" + new URLSearchParams({ userID });
	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

// Utils

const calculateStartAndEndTimes = (values: {
	startTime: string;
	endTime: string;
	duration: number;
}) => {
	const { startTime, endTime, duration } = values;
	const start = parseAnyTime(startTime) as Date;
	const end = parseAnyTime(endTime) as Date;
	const diff = differenceInMinutes(end, start);

	if (diff !== duration) {
		const newEnd = addMinutes(start, duration);
		return {
			startTime: formatDateTime(start, "db"),
			endTime: formatDateTime(newEnd, "db"),
		};
	} else {
		return {
			startTime: formatDateTime(start, "db"),
			endTime: formatDateTime(end, "db"),
		};
	}
};

const prepareMarkAsDoneBody = (userID: string, details: MarkAsDoneBody) => {
	const type: Activity = details.activityType;
	const { startTime, endTime, workoutLength, workoutDate } = details;
	const { startTime: newStart, endTime: newEnd } = calculateStartAndEndTimes({
		startTime: startTime,
		endTime: endTime,
		duration: workoutLength,
	});

	const newBody: MarkAsDoneBody = {
		userID,
		workoutID: details.workoutID,
		activityType: type,
		workoutDate,
		effort: details.effort || "None",
		startTime: newStart,
		endTime: newEnd,
		workoutLength: workoutLength,
		steps: details.steps || 0,
		miles: details.miles || 0,
		pace: details.pace || 0,
		exercise: details.exercise || "",
		sets: details.sets || [],
	};

	return newBody;
};

export {
	logWorkout,
	fetchTodaysWorkouts,
	fetchWorkoutDetails,
	fetchAllWorkouts,
	markWorkoutAsDone,
	prepareMarkAsDoneBody,
	calculateStartAndEndTimes,
};
