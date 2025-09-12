import { statsService } from "../../services/index.js";

export type RangeBy = "day" | "week" | "month" | "year";

interface DayMinsDB {
	date: string;
	week_day: number;
	total_mins: number;
}
interface WeekMinsDB {
	date: string;
	week_number: number;
	total_mins: number;
}
interface MonthMinsDB {
	date: string;
	day: number;
	total_mins: number;
}
interface YearMinsDB {
	startDate: string;
	endDate: string;
	month: string;
	mins: number;
}
export interface MinsTotals {
	date: string;
	label: string | number;
	value: number;
}
export type MinsTotalsDB = WeekMinsDB[] | MonthMinsDB[] | YearMinsDB[];

const getTotalMinsBy = async (
	userID: string,
	targetDate: string,
	by: RangeBy
): Promise<MinsTotals[]> => {
	switch (by) {
		case "day": {
			const response = (await statsService.getDailyMins(
				userID,
				targetDate
			)) as DayMinsDB[];
			const data = normalizeDailyMins(response);
			return data;
		}
		case "week": {
			const response = (await statsService.getWeeklyMins(
				userID,
				targetDate
			)) as WeekMinsDB[];
			const data = normalizeWeeklyMins(response);
			return data;
		}
		case "month": {
			const response = (await statsService.getMonthlyMins(
				userID,
				targetDate
			)) as MonthMinsDB[];
			const data = normalizeMonthlyMins(response);
			return data;
		}
		case "year": {
			const response = (await statsService.getYearlyMins(
				userID,
				targetDate
			)) as YearMinsDB[];
			console.log("response", response);
			const data = normalizeYearlyMins(response);
			return data;
		}

		default:
			throw new Error('Invalid "by" value:' + by);
	}
};

// NORMALIZERS
const normalizeDailyMins = (rows: DayMinsDB[]): MinsTotals[] => {
	if (!rows) return [];
	const records = rows.map((row) => ({
		date: row.date,
		label: row.week_day,
		value: row.total_mins,
	}));
	return records;
};
const normalizeWeeklyMins = (rows: WeekMinsDB[]): MinsTotals[] => {
	if (!rows) return [];
	const records = rows.map((row) => ({
		date: row.date,
		label: row.week_number,
		value: row.total_mins,
	}));
	return records;
};

const normalizeMonthlyMins = (rows: MonthMinsDB[]): MinsTotals[] => {
	if (!rows) return [];
	const records = rows.map((row) => ({
		date: row.date,
		label: row.day,
		value: row.total_mins,
	}));
	return records;
};
const normalizeYearlyMins = (rows: YearMinsDB[]): MinsTotals[] => {
	if (!rows) return [];
	const records = rows.map((row) => ({
		date: row.startDate,
		label: row.month.trim(),
		value: row.mins,
	}));
	return records;
};

export {
	getTotalMinsBy,
	normalizeDailyMins,
	normalizeWeeklyMins,
	normalizeMonthlyMins,
	normalizeYearlyMins,
};
