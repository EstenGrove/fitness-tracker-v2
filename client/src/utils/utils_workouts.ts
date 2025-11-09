import {
	addMinutes,
	differenceInMinutes,
	differenceInSeconds,
	intervalToDuration,
	parse,
	secondsToMinutes,
} from "date-fns";
import { Activity, Effort, RepeatType } from "../features/shared/types";
import { AsyncResponse, RangeParams } from "../features/types";
import {
	CreatedWorkoutData,
	CreateWorkoutParams,
	CreateWorkoutValues,
	ExerciseSet,
	ScheduledWorkout,
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

export interface DeleteWorkoutDateParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
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

export interface DeletedWorkoutDateData {
	workoutID: number;
	activityType: Activity;
	targetDate: string;
	scheduleID: string | null;
	wasDeleted: boolean;
}

export interface ScheduledWorkoutsData {
	workouts: ScheduledWorkout[];
}

export type ScheduledWorkoutsGrouped = Record<string, ScheduledWorkout[]>;
export interface GroupedScheduledWorkouts {
	workouts: ScheduledWorkoutsGrouped;
}

export type TodaysWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type AllUserWorkoutsResp = AsyncResponse<{ workouts: TodaysWorkout[] }>;
export type SkippedWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type WorkoutDetailsResp = AsyncResponse<WorkoutDetails>;
export type AllWorkoutsResp = AsyncResponse<{ workouts: Workout[] }>;
export type LoggedWorkoutResp = AsyncResponse<{ newLog: HistoryOfType }>;
export type SkippedWorkoutResp = AsyncResponse<{ wasSkipped: boolean }>;
export type CreatedWorkoutResp = AsyncResponse<CreatedWorkoutData>;
export type DeletedWorkoutDateResp = AsyncResponse<DeletedWorkoutDateData>;
export type ScheduledWorkoutsResp = AsyncResponse<ScheduledWorkoutsData>;
export type ScheduledWorkoutsByDateResp =
	AsyncResponse<GroupedScheduledWorkouts>;

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

const fetchScheduledWorkouts = async (
	userID: string,
	dateRange: RangeParams
): ScheduledWorkoutsResp => {
	const { startDate, endDate } = dateRange;

	let url = currentEnv.base + workoutApis.getScheduledWorkoutsForRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ startDate, endDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchScheduledWorkoutsByDate = async (
	userID: string,
	dateRange: RangeParams
): ScheduledWorkoutsByDateResp => {
	const { startDate, endDate } = dateRange;

	let url = currentEnv.base + workoutApis.getScheduledWorkoutsByDate;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ startDate, endDate });

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

const deleteWorkoutDate = async (
	params: DeleteWorkoutDateParams
): DeletedWorkoutDateResp => {
	let url = currentEnv.base + workoutApis.deleteWorkoutDate;
	url += "?" + new URLSearchParams({ userID: params.userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify(params),
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

const createNewWorkout = async (
	userID: string,
	params: CreateWorkoutParams
): CreatedWorkoutResp => {
	let url = currentEnv.base + workoutApis.createNewWorkout;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				userID: userID,
				newWorkout: params,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Utils

const getRepsFromValues = (workoutSets: WorkoutSet[] | ExerciseSet[]) => {
	if (!workoutSets || !workoutSets.length) return 0;
	const sets = workoutSets.length;
	const reps = Math.round(
		workoutSets.reduce((perSet, entry) => (perSet += entry.reps), 0) / sets
	);

	return reps || 0;
};

const getWeightFromValues = (workoutSets: StrengthSet[]) => {
	if (!workoutSets || !workoutSets.length) return 0;
	const weight = workoutSets[0]?.weight ?? 0;
	return weight;
};

export interface CreateWorkoutPrepareValues {
	workoutSets: WorkoutSet[];
	workoutInfo: CreateWorkoutValues;
}

const prepareNewWorkout = (
	userID: string,
	values: CreateWorkoutPrepareValues
) => {
	const { workoutSets, workoutInfo } = values;
	const prepared = prepareNewWorkoutValues(workoutInfo, workoutSets);
	const { workout: baseWorkout, schedule: baseSchedule } = prepared;

	const workout: CreateWorkoutParams["workout"] = {
		userID,
		workoutName: baseWorkout.workoutName,
		workoutDesc: baseWorkout.workoutDesc,
		activityType: baseWorkout.activityType,
		date: baseWorkout.startDate as string,
		duration: baseWorkout.duration,
		effort: baseWorkout.effort || "Easy",
		reps: baseWorkout.reps,
		sets: baseWorkout.sets,
		weight: baseWorkout.weight,
		steps: baseWorkout.steps,
		miles: baseWorkout.miles,
		pace: baseWorkout.pace,
		equipment: baseWorkout.equipment,
		tagColor: baseWorkout.tagColor,
		isRecurring: workoutInfo.isRecurring,
	};
	const schedule: CreateWorkoutParams["schedule"] = {
		userID,
		activityType: baseWorkout.activityType,
		startDate: baseSchedule.startDate as string,
		endDate: baseSchedule.endDate as string,
		startTime: baseSchedule.startTime,
		endTime: baseSchedule.endTime,
		interval: baseSchedule.interval,
		frequency: baseSchedule.frequency,
		byDay: baseSchedule.byDay,
		byMonth: baseSchedule.byMonth,
		byMonthDay: baseSchedule.byMonthDay,
	};

	return {
		workout,
		schedule,
	};
};

const prepareNewWorkoutSchedule = (values: CreateWorkoutValues) => {
	const {
		isRecurring,
		frequency,
		startDate,
		endDate,
		startTime,
		endTime,
		duration,
	} = values;
	const repeatType = frequency as RepeatType;
	const timeRanges = calculateStartAndEndTimes({
		startTime,
		endTime,
		duration,
	});

	if (!isRecurring) {
		return {
			interval: 0,
			frequency: "None",
			startDate: startDate,
			endDate: startDate,
			startTime: timeRanges.startTime,
			endTime: timeRanges.endTime,
			byDay: [],
			byMonth: null,
			byMonthDay: null,
			isRecurring: false,
		};
	}

	switch (repeatType) {
		case "Daily": {
			return {
				frequency: "Daily",
				interval: values.interval,
				isRecurring: true,
				startDate: values.startDate,
				endDate: endDate,
				startTime: timeRanges.startTime,
				endTime: timeRanges.endTime,
				byDay: [],
				byMonth: null,
				byMonthDay: null,
			};
		}
		case "Weekly": {
			return {
				frequency: "Weekly",
				interval: values.interval,
				isRecurring: true,
				startDate: values.startDate,
				endDate: endDate,
				startTime: timeRanges.startTime,
				endTime: timeRanges.endTime,
				byDay: values.byDay,
				byMonth: null,
				byMonthDay: null,
			};
		}
		case "Monthly": {
			return {
				frequency: "Monthly",
				interval: values.interval,
				isRecurring: true,
				startDate: values.startDate,
				endDate: endDate,
				startTime: timeRanges.startTime,
				endTime: timeRanges.endTime,
				byDay: [],
				byMonth: values.byMonth,
				byMonthDay: values.byMonthDay,
			};
		}
		case "Yearly": {
			return {
				frequency: "Yearly",
				interval: values.interval,
				isRecurring: true,
				startDate: values.startDate,
				endDate: endDate,
				startTime: timeRanges.startTime,
				endTime: timeRanges.endTime,
				byDay: [],
				byMonth: values.byMonth,
				byMonthDay: values.byMonthDay,
			};
		}
		case "None": {
			return {
				interval: 0,
				frequency: "None",
				startDate: startDate,
				endDate: startDate,
				startTime: timeRanges.startTime,
				endTime: timeRanges.endTime,
				byDay: [],
				byMonth: null,
				byMonthDay: null,
			};
		}

		default:
			throw new Error(`Invalid repeat type: ${repeatType}`);
	}
};

const prepareNewWorkoutValues = (
	values: CreateWorkoutValues,
	workoutSets: WorkoutSet[]
) => {
	const { activityType } = values;
	const type = activityType as Activity;
	const schedule = prepareNewWorkoutSchedule(values);
	const newValues = {
		...values,
		effort: "Easy",
		workoutName: values.name,
		workoutDesc: values.desc,
		tagColor: values?.tagColor ?? "var(--blueGrey600)",
	};

	switch (type) {
		case "Strength": {
			const details = prepareNewStrengthSets(
				workoutSets as unknown as PrepareSets<StrengthSet>
			);
			const workout = {
				...newValues,
				sets: details.sets,
				reps: details.reps,
				weight: details.weight,
				equipment: details.equipment,
			};
			return {
				workout: workout,
				schedule,
			};
		}
		case "Walk": {
			const { steps = 0, miles = 0, pace, duration } = values;
			const details = prepareNewWalk({
				steps: steps as number,
				miles: miles as number,
				pace: pace as number,
				duration: duration as number,
			});

			const workout = {
				...newValues,
				sets: null,
				reps: null,
				weight: null,
				equipment: "None",
				steps: details.steps,
				miles: details.miles,
				pace: details.pace,
			};
			return {
				workout: workout,
				schedule,
			};
		}
		case "Cardio":
		case "Timed":
		case "Other":
		case "Stretch": {
			const preparedData: PrepareSets<ExerciseSet> = {
				workoutSets: workoutSets as ExerciseSet[],
				equipment: values.equipment ?? "None",
			};
			const details = prepareNewExerciseSets(type, preparedData);
			const workout = {
				...newValues,
				weight: null,
				sets: details.sets,
				reps: details.reps,
				equipment: details.equipment,
				exercise: details.exercise,
			};
			return {
				workout: workout,
				schedule,
			};
		}
		default:
			throw new Error(`Invalid activity ${type}`);
	}
};

interface PrepareSets<T extends object> {
	workoutSets: T[];
	equipment: string | null;
}

const prepareNewStrengthSets = (values: PrepareSets<StrengthSet>) => {
	const { workoutSets, equipment } = values;
	const reps = getRepsFromValues(workoutSets);
	const weight = getWeightFromValues(workoutSets);

	const data = {
		sets: workoutSets.length ?? 0,
		reps: Math.round(reps),
		weight: weight,
		exercise: "Strength",
		equipment: !!equipment && equipment !== "" ? equipment : "None",
	};

	return data;
};
const prepareNewExerciseSets = (
	activityType: Activity,
	values: PrepareSets<ExerciseSet>
) => {
	const { workoutSets, equipment } = values;
	const reps = getRepsFromValues(workoutSets);

	const data = {
		sets: workoutSets?.length ?? 0,
		reps: Math.round(reps),
		exercise: activityType,
		equipment: !!equipment && equipment !== "" ? equipment : "None",
	};

	return data;
};

const prepareNewWalk = (values: {
	steps: number;
	miles: number;
	pace: number | null;
	duration: number;
}) => {
	const { miles, duration } = values;
	const metrics = calculateWalkMetrics({ miles, duration });

	return {
		steps: metrics.steps,
		miles: miles,
		pace: metrics.pace,
	};
};

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

const sortByCompleted = (workouts: TodaysWorkout[]): TodaysWorkout[] => {
	if (!workouts || !workouts.length) return [];

	const isDone = (workout: TodaysWorkout) => {
		const status = workout.workoutStatus;

		switch (status) {
			case "COMPLETE":
				return 1;
			case "IN-PROGRESS":
				return 1.5;
			case "NOT-COMPLETE":
				return 0;
			case "SKIPPED":
				return 2;

			default:
				return 0;
		}
	};

	return [...workouts]?.sort((a, b) => {
		return isDone(a) - isDone(b);
	});
};

export {
	logWorkout,
	skipWorkout,
	deleteWorkoutDate,
	fetchAllUserWorkouts,
	fetchSkippedWorkouts,
	fetchTodaysWorkouts,
	fetchWorkoutDetails,
	fetchAllWorkouts,
	fetchScheduledWorkouts,
	fetchScheduledWorkoutsByDate,
	getLastWorkout,
	markWorkoutAsDone,
	createNewWorkout,
	// utils
	prepareLogWorkout,
	prepareMarkAsDoneBody,
	prepareNewWalk,
	prepareNewWorkoutValues, // handles the specific values
	prepareNewWorkout, // formats the 'handled' values into a specific shape for the payload
	prepareNewExerciseSets,
	prepareNewStrengthSets,
	calculateStartAndEndTimes,
	calculateWalkMetrics,
	getWorkoutsByStatus,
	prepareEndedWorkout,
	calculateDurationFromTimestamps,
	calculateDurationFromEndedTimes,
	formatElapsedTime,
	getElapsedWorkoutTime,
	sortByCompleted,
};
