import {
	addMinutes,
	differenceInMinutes,
	differenceInSeconds,
	intervalToDuration,
	parse,
	secondsToMinutes,
} from "date-fns";
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
import { LocalStorage } from "./utils_storage";

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
export type AllUserWorkoutsResp = AsyncResponse<{ workouts: TodaysWorkout[] }>;
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

const fetchAllUserWorkouts = async (userID: string): AllUserWorkoutsResp => {
	let url = currentEnv.base + workoutApis.getAllUserWorkouts;
	url += "?" + new URLSearchParams({ userID });

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
const prepareStartAndEndDuration = (values: {
	startTime: string;
	workoutDate: string;
	duration: number;
}): StartAndEnd => {
	const { startTime, workoutDate, duration } = values;
	console.log("startTime", startTime);
	console.log("workoutDate", workoutDate);
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
export interface FinalWorkoutVals extends LogWorkoutValues {
	userID: string;
}

const calculateDurationFromTimestamps = (
	startTime: string,
	endTime: string
) => {
	const diffInSecs = differenceInSeconds(endTime, startTime);
	const mins = secondsToMinutes(diffInSecs);
	return mins.toFixed(2);
};

const calculateDurationFromEndedTimes = (start: string, end: string) => {
	const parseKey = "MM/dd/yyyy h:mm:ss a";
	const startP = parse(start, parseKey, new Date());
	const endP = parse(end, parseKey, new Date());

	const total = differenceInSeconds(endP, startP);

	const mins = total / 60;
	return mins;
	// return mins.toFixed(2);
};

const prepareEndedWorkout = (
	userID: string,
	values: EndedWorkoutValues
): LogWorkoutBody => {
	const type = values.activityType as Activity;
	// Returns mins as a numeric decimal (eg 0.25 => 15seconds) 1.25 => 1m 15s
	const length = calculateDurationFromEndedTimes(
		values.startTime,
		values.endTime
	);
	console.log("length", length);

	const withTime = {
		...values,
		effort: values.effort as Effort,
		activityType: type,
		userID: userID,
		startTime: values.startTime,
		endTime: values.endTime,
		workoutLength: values.duration,
	};

	switch (type) {
		case "Strength": {
			return {
				...withTime,
				sets: values.sets,
				userID: userID,
			};
		}
		case "Walk": {
			const { steps, pace } = calculateWalkMetrics({
				miles: values.miles,
				duration: values.duration,
			});
			return {
				...withTime,
				userID: userID,
				steps: steps,
				miles: values.miles,
				pace: pace,
			};
		}
		case "Stretch": {
			return {
				...withTime,
				userID: userID,
				sets: values.sets,
				exercise: "Stretch",
			};
		}
		case "Cardio": {
			return {
				...withTime,
				userID: userID,
				exercise: "Cardio",
			};
		}
		case "Timed": {
			return {
				...withTime,
				userID: userID,
				sets: values.sets,
				exercise: "Timed",
			};
		}
		case "Other": {
			return {
				...withTime,
				userID: userID,
				sets: values.sets,
				exercise: "Other",
			};
		}
		default:
			return {
				...withTime,
				userID: userID,
			};
	}
};

const getElapsedWorkoutTime = (cacheKey: string = "TIMER_KEY") => {
	const cache = new LocalStorage();
	const timer = cache.get(cacheKey);

	if (!timer) {
		return { mins: 0, secs: 0 };
	} else {
		const elapsed = intervalToDuration({
			start: timer.startedAt as number,
			end: Date.now() as number,
		});
		const { minutes: mins, seconds: secs } = elapsed;
		return {
			mins: mins as number,
			secs: secs as number,
		};
	}
};

const formatElapsedTime = (mins: number, secs: number) => {
	const newMins = mins < 10 ? `0${mins}` : mins;
	const newSecs = secs < 10 ? `0${secs}` : secs;
	const newTime = `${newMins}m ${newSecs}s`;

	return newTime;
};

export {
	logWorkout,
	skipWorkout,
	fetchAllUserWorkouts,
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
	calculateDurationFromTimestamps,
	calculateDurationFromEndedTimes,
	formatElapsedTime,
	getElapsedWorkoutTime,
};
