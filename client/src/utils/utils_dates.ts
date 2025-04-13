import {
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	parse,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import { RepeatType } from "../features/shared/types";

export type WeekDay =
	| "Sunday"
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday";
export type WeekDayToken = "Su" | "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa";

export type RangePreset =
	| "Today"
	| "Yesterday"
	| "This Week"
	| "This Month"
	| "Last Week"
	| "Last Month"
	| "None";

export type CustomRangeType = Omit<RepeatType, "Never">;

export type CustomRange = {
	type: CustomRangeType;
	startDate: Date | string;
	endDate: Date | string;
};

const WEEK_DAYS: WeekDay[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const MONTHS: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const QUARTERS: string[] = ["Q1", "Q2", "Q3", "Q4"];

const MONTHS_BY_QUARTER: Record<string, number[]> = {
	Q1: [0, 1, 2],
	Q2: [3, 4, 5],
	Q3: [6, 7, 8],
	Q4: [9, 10, 11],
};

export interface DateFormats {
	date: {
		short: string;
		long: string;
		full: string;
		fullMonth: string;
		db: string;
		input: string;
		shortMonth: string;
		month: string;
		url: string;
		clean: string;
	};
	time: {
		noTod: string;
		short: string;
		shortMs: string;
		long: string;
		mil: string;
		longMs: string;
		db: string;
	};
	datetime: {
		short: string;
		long: string;
		full: string;
		db: string;
		longMs: string;
		common: string;
	};
	weekday: {
		full: string; // 'Monday', 'Tuesday' etc
		abbrev: string; // 'Mon', 'Tue', etc
		twoLetter: string; // 'Mo', 'Tu' etc
		letter: string; // 'M', 'T', 'W', 'T' etc
	};
	custom: {
		monthAndDay: string;
		range: string;
	};
}

const FORMAT_TOKENS: DateFormats = {
	date: {
		short: "M/d/yy",
		long: "MM/dd/yyyy",
		full: "MMMM do, yyyy",
		fullMonth: "MMMM do",
		db: "yyyy-MM-dd",
		input: "yyyy-MM-dd",
		shortMonth: "MMM do, yyyy",
		month: "MMM",
		url: "MM-dd-yyyy",
		clean: "M/d/yyyy",
	},
	time: {
		noTod: "hh:mm",
		short: "h:mm a",
		shortMs: "h:mm:ss a",
		long: "h:mm a",
		mil: "HH:mm a",
		db: "HH:mm",
		longMs: "h:mm:ss a",
	},
	datetime: {
		short: "M/d/yy h:mm a",
		long: "MM/dd/yyyy hh:mm a",
		full: "MMMM do, yyyy hh:mm a",
		longMs: "MM/dd/yyyy hh:mm:ss a",
		db: "yyyy-MM-dd HH:mm",
		common: "M/d/yyyy h:mm a",
	},
	weekday: {
		full: "EEEE",
		abbrev: "EEE",
		twoLetter: "EEEEEE",
		letter: "EEEEE",
	},
	custom: {
		monthAndDay: "EEE, MMM do",
		range: "MMM do",
	},
};
const {
	date: DATE_TOKENS,
	time: TIME_TOKENS,
	datetime: DATETIME_TOKENS,
	weekday: WEEKDAY_TOKENS,
	custom: CUSTOM_TOKENS,
} = FORMAT_TOKENS;

const formatDate = (
	date: Date | string,
	formatToken: keyof DateFormats["date"] = "long"
): string => {
	if (!date) return "";
	const base = new Date(date);
	const token = DATE_TOKENS[formatToken];
	const formatted = format(base, token);

	return formatted;
};

const formatTime = (
	date: Date | string,
	formatToken: keyof DateFormats["time"] = "long"
) => {
	if (!date) return "";
	const token = TIME_TOKENS[formatToken];
	const formatted = format(date, token);

	return formatted;
};

const formatDateTime = (
	date: Date | string,
	formatToken: keyof DateFormats["datetime"] = "db"
) => {
	if (!date) return "";
	const token = DATETIME_TOKENS[formatToken];
	const formatted = format(date, token);

	return formatted;
};

const formatCustomDate = (
	date: Date | string,
	formatToken: keyof DateFormats["custom"] = "monthAndDay"
) => {
	if (!date) return "";
	const token = CUSTOM_TOKENS[formatToken];
	const formatted = format(date, token);
	return formatted;
};

const parseDate = (
	dateStr: string,
	formatToken: keyof DateFormats["date"] = "db"
) => {
	const token = DATE_TOKENS[formatToken];
	const parsed = parse(dateStr, token, new Date());

	return parsed;
};

const parseAnyDate = (dateStr: string) => {
	const tokens = Object.keys(DATE_TOKENS);

	for (const token of tokens) {
		const cleanToken = token.replace(",", "");
		const parsed = parse(dateStr, cleanToken, new Date());
		if (!isNaN(parsed.getDate())) {
			return parsed;
		}
	}
	return dateStr;
};

// Parses => '2024-11-22' & converts to a real date w/ a given format
const parseDateTime = (
	dateStr: string,
	formatToken: keyof DateFormats["datetime"] = "db"
) => {
	const token = DATETIME_TOKENS[formatToken];
	const parsedDate = parse(dateStr, token, new Date());

	return parsedDate;
};

const parseTime = (
	timeStr: string,
	formatToken: keyof DateFormats["time"] = "long"
): Date => {
	const baseDate: Date = new Date();
	const token = TIME_TOKENS[formatToken as keyof object] || "hh:mm a";
	const parsed = parse(timeStr, token, baseDate);

	return parsed;
};

const parseAnyTime = (timeStr: string) => {
	const baseDate: Date = new Date();
	const options = [
		"HH:mm", // military
		"hh:mm", // 12 hour
		"hh:mm a", // 12 hour w/ time-of-day
		"hh:mm:ss", // 12 hour w/ secs
		"HH:mm:ss", // military w/ secs
		"HH:mm:ss a", // military w/ secs & time-of-day
		"hh:mm:ss a", // 12 hour w/ secs & time-of-day
	];

	for (const option of options) {
		const parsed = parse(timeStr, option, baseDate);
		if (!isNaN(parsed.getTime())) {
			return parsed;
		}
	}
	return timeStr;
};

const getWeekStartAndEnd = (base: Date | string = new Date()) => {
	const startDate = startOfWeek(base);
	const endDate = endOfWeek(base);

	return { startDate, endDate };
};
const getMonthStartAndEnd = (base: Date | string = new Date()) => {
	const startDate = startOfMonth(base);
	const endDate = endOfMonth(base);

	return { startDate, endDate };
};
const getYearStartAndEnd = (base: Date | string = new Date()) => {
	const startDate = startOfYear(base);
	const endDate = endOfYear(base);

	return { startDate, endDate };
};

export {
	// STATIC VARIABLES
	WEEK_DAYS,
	WEEKDAY_TOKENS,
	MONTHS,
	MONTHS_BY_QUARTER,
	QUARTERS,
	// FORMATTING
	formatDate,
	formatTime,
	formatDateTime,
	formatCustomDate,
	// PARSING STRINGS AS DATE/TIME/DATETIME
	parseDate,
	parseAnyDate,
	parseDateTime,
	parseTime,
	parseAnyTime,
	// CALCULATE DATE RANGES
	getWeekStartAndEnd,
	getMonthStartAndEnd,
	getYearStartAndEnd,
};
