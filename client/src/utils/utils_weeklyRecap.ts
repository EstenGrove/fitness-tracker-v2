import { format } from "date-fns";
import {
	RecapBar,
	RecapForRange,
	WeeklyRecap,
	WeeklyRecapCompleted,
	WeeklyRecapForActivity,
	WeeklyRecapForWalkActivity,
	WeeklyRecaps,
} from "../features/recaps/types";
import { AsyncResponse, RangeParams } from "../features/types";
import { currentEnv, recapApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import { durationTo } from "./utils_workouts";
import { Activity } from "../features/shared/types";

export type WeeklyRecapResp = AsyncResponse<WeeklyRecaps>;
export type RecapForRangeResp = AsyncResponse<RecapForRange>;

const getWeeklyRecap = async (
	userID: string,
	range: RangeParams
): WeeklyRecapResp => {
	let url = currentEnv.base + recapApis.getWeeklyRecap;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const getRecapForRange = async (
	userID: string,
	range: RangeParams
): RecapForRangeResp => {
	let url = currentEnv.base + recapApis.getRecapForRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const getWeeklyRecaps = async (
	userID: string,
	range: RangeParams
): WeeklyRecapResp => {
	let url = currentEnv.base + recapApis.getWeeklyRecaps;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// WEEKLY RECAP CARD GENERATOR UTILS //

const getRangeDesc = (dateRange: RangeParams) => {
	const start = format(dateRange.startDate, "MMMM dd");
	const end = format(dateRange.endDate, "dd, yyyy");

	return `${start} - ${end}`;
};

const getRecapProgressBars = (
	data: WeeklyRecaps,
	activityType: Activity
): RecapBar[] => {
	if (!data) return [];

	const bars: RecapBar[] = [];

	for (const key in data) {
		const week = data[key as keyof WeeklyRecaps];
		const activity = week.activities[activityType];
		const total = activity.totalWorkouts;
		const barEntry: RecapBar = {
			when: week.dateRange.startDate,
			what: `${total} workouts`,
			value: total,
			mins: activity.totalMins,
		};
		bars.push(barEntry);
	}

	return bars;
};

const getWalkCardDetails = (recapForActivity: WeeklyRecapForWalkActivity) => {
	const {
		totalMins,
		totalWorkouts,
		longestMins,
		longestMiles,
		longestSteps,
		totalMiles,
		totalSteps,
	} = recapForActivity;

	const totalMi = totalMiles + " mi";
	const longestMi = longestMiles + " mi";
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");

	return {
		totalMins: duration,
		longestMins: longest,
		totalWorkouts: totalWorkouts,
		totalSteps: totalSteps,
		longestSteps: longestSteps,
		totalMiles: totalMi,
		longestMiles: longestMi,
	};
};

const getStrengthCardDetails = (recapForActivity: WeeklyRecapForActivity) => {
	const { totalMins, totalWorkouts, longestMins } = recapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");

	return {
		totalWorkouts: totalWorkouts,
		totalMins: duration,
		longestMins: longest,
	};
};

// Used for 'Cardio', 'Stretch', 'Timed' & 'Other' activity types
const getOtherDetails = (recapForActivity: WeeklyRecapForActivity) => {
	const { totalMins, totalWorkouts, longestMins } = recapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");

	return {
		totalWorkouts: totalWorkouts,
		totalMins: duration,
		longestMins: longest,
	};
};

const getWeeklyRecapCards = (
	recapData: WeeklyRecap,
	dateRange: RangeParams
) => {
	const { recap, activities } = recapData;
	const { breakdown, completed, topActivities } = recap;
	const start = format(dateRange.startDate, "MMMM dd");
	const end = format(dateRange.endDate, "dd, yyyy");
};

export {
	getWeeklyRecap,
	getWeeklyRecaps,
	getRecapForRange,
	getRangeDesc,
	getRecapProgressBars,
};
