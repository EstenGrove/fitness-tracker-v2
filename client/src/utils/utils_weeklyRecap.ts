import { format, isSameMonth } from "date-fns";
import {
	RecapBar,
	RecapForRange,
	WeeklyRecaps,
} from "../features/recaps/types";
import { AsyncResponse, RangeParams } from "../features/types";
import { currentEnv, recapApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import { Activity } from "../features/shared/types";
import { parseAnyDate } from "./utils_dates";

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

const getRangeDesc = (dateRange: RangeParams) => {
	const startDate = parseAnyDate(dateRange.startDate);
	const endDate = parseAnyDate(dateRange.endDate);

	if (isSameMonth(dateRange.endDate, dateRange.startDate)) {
		const start = format(startDate, "MMMM dd");
		const end = format(endDate, "dd, yyyy");
		return `${start} - ${end}`;
	} else {
		const start = format(startDate, "MMMM dd");
		const end = format(endDate, "MMM dd, yyyy");
		return `${start} - ${end}`;
	}
};

export {
	getWeeklyRecap,
	getWeeklyRecaps,
	getRecapForRange,
	getRecapProgressBars,
	getRangeDesc,
};
