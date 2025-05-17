import { addMinutes, differenceInMinutes } from "date-fns";
import { Activity, Effort } from "../features/shared/types";
import { AsyncResponse } from "../features/types";
import {
	ExerciseSet,
	StrengthSet,
	TodaysWorkout,
	Workout,
	WorkoutDetails,
	WorkoutStatus,
} from "../features/workouts/types";
import { currentEnv, historyApis, workoutApis } from "./utils_env";
import {
	applyTimeStrToDate,
	formatDate,
	formatDateTime,
	parseAnyTime,
	toBackendFormat,
} from "./utils_dates";
import { HistoryOfType } from "../features/history/types";
import { fetchWithAuth } from "./utils_requests";
import { milesToPace, milesToSteps } from "./utils_steps";

export type WorkoutSet = StrengthSet | ExerciseSet;

export interface LastSessionParams {
	userID: string;
	workoutID: number;
	activityType: string;
	targetDate: string;
}
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

export interface SkipWorkoutParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	reason?: string;
}
export interface SkipWorkoutBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	reason?: string;
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

export interface LogWorkoutParams {
	userID: string;
	newLog: LogWorkoutBody;
}

export interface LogWorkoutValues {
	workoutID: number;
	activityType: Activity | string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	effort: string;
	steps: number;
	miles: number;
	pace: number;
	exercise: string;
	sets: WorkoutSet[];
}

export type TodaysWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type SkippedWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type WorkoutDetailsResp = AsyncResponse<WorkoutDetails>;
export type AllWorkoutsResp = AsyncResponse<{ workouts: Workout[] }>;
export type LoggedWorkoutResp = AsyncResponse<{ newLog: HistoryOfType }>;
export type SkippedWorkoutResp = AsyncResponse<{ wasSkipped: boolean }>;

const logWorkout = async (
	userID: string,
	details: LogWorkoutBody
): LoggedWorkoutResp => {
	let url = currentEnv.base + workoutApis.logWorkout;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify(details),
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
		const request = await fetchWithAuth(url);
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
		const request = await fetchWithAuth(url);
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
		const request = await fetchWithAuth(url, {
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
		const request = await fetchWithAuth(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchSkippedWorkouts = async (
	userID: string,
	targetDate: string
): SkippedWorkoutsResp => {
	let url = currentEnv.base + workoutApis.getSkippedWorkouts;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const skipWorkout = async (
	userID: string,
	details: SkipWorkoutBody
): SkippedWorkoutResp => {
	let url = currentEnv.base + workoutApis.skipWorkout;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify(details),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const getLastWorkout = async (params: LastSessionParams) => {
	const { userID, workoutID, activityType, targetDate } = params;
	let url = currentEnv.base + historyApis.getLastWorkout;
	url += "?" + new URLSearchParams({ activityType });
	url += "&" + new URLSearchParams({ userID, targetDate });
	url += "&" + new URLSearchParams({ workoutID: String(workoutID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Utils

const getWorkoutsByStatus = (
	status: WorkoutStatus,
	workouts: TodaysWorkout[]
) => {
	if (!workouts || !workouts.length) return [];

	return workouts.filter((workout) => workout.workoutStatus == status);
};

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
	const { steps, pace } = calculateWalkMetrics({
		miles: details?.miles ?? 0,
		duration: details.workoutLength,
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
		steps: steps || 0,
		miles: details.miles || 0,
		pace: pace || 0,
		exercise: details.exercise || "",
		sets: details.sets || [],
	};

	return newBody;
};

interface StartAndEnd {
	startTime: string;
	endTime: string;
}

const calculateEndTimeFromDuration = (values: {
	startTime: string;
	date: Date | string;
	mins: number;
}) => {
	const { startTime, date, mins } = values;
	const start = applyTimeStrToDate(startTime, date);
	const endByMins = addMinutes(start, mins);

	return endByMins;
};

const calculateWalkMetrics = (values: { miles: number; duration: number }) => {
	const { miles, duration } = values;
	const steps = milesToSteps(miles);
	const pace = milesToPace(miles, duration);

	return {
		steps,
		pace,
	};
};

// Checks if the start/end times line up with the workout mins & fixes it, if needed
const prepareStartAndEndDuration = (values: LogWorkoutValues): StartAndEnd => {
	const { startTime, workoutDate, duration } = values;
	const startStr = startTime as string;
	const start = applyTimeStrToDate(startStr, workoutDate);
	const endTime = calculateEndTimeFromDuration({
		startTime: startStr,
		date: workoutDate,
		mins: duration,
	});

	return {
		startTime: toBackendFormat(new Date(start)),
		endTime: toBackendFormat(new Date(endTime)),
	};
};

const prepareLogWorkout = (userID: string, values: LogWorkoutValues) => {
	const newTimes = prepareStartAndEndDuration(values);

	// Fallback to 'Other (Open)', if matching workout is not found or otherwise selected
	const workoutID = values?.workoutID ?? 1;
	const activityType = (values?.activityType ?? "Other") as Activity;
	const date = formatDate(values.workoutDate, "db");
	const { steps, pace } = calculateWalkMetrics({
		miles: values?.miles ?? 0,
		duration: values.duration,
	});

	const newValues: LogWorkoutBody = {
		userID: userID,
		workoutID: workoutID,
		activityType: activityType,
		workoutDate: date,
		startTime: newTimes.startTime,
		endTime: newTimes.endTime,
		workoutLength: values.duration,
		effort: values.effort as Effort,
		steps: steps ?? null,
		miles: values?.miles ?? null,
		pace: pace ?? null,
		exercise: values?.exercise ?? activityType + " Exercise",
		sets: values?.sets ?? [],
	};

	return newValues;
};

export interface EndedWorkoutValues {
	workoutID: number;
	activityType: Activity | string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	effort: string;
	steps: number;
	miles: number;
	pace: number;
	exercise: string;
	sets: WorkoutSet[];
}

const prepareEndedWorkout = (userID: string, values: EndedWorkoutValues) => {};

export {
	logWorkout,
	skipWorkout,
	fetchSkippedWorkouts,
	fetchTodaysWorkouts,
	fetchWorkoutDetails,
	fetchAllWorkouts,
	getLastWorkout,
	markWorkoutAsDone,
	prepareLogWorkout,
	prepareMarkAsDoneBody,
	calculateStartAndEndTimes,
	calculateWalkMetrics,
	getWorkoutsByStatus,
	prepareEndedWorkout,
};
