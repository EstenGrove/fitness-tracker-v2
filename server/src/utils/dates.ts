import { format, subDays } from "date-fns";

export interface DateFormats {
	date: {
		db: string;
	};
	time: {
		db: string;
	};
	datetime: {
		db: string;
	};
	custom: {
		timestamp: string;
	};
}

const FORMAT_TOKENS: DateFormats = {
	date: {
		db: "yyyy-MM-dd",
	},
	time: {
		db: "HH:mm",
	},
	datetime: {
		db: "yyyy-MM-dd HH:mm",
	},
	custom: {
		timestamp: "MM/dd/yyyy hh:mm:ss.SSS a",
	},
};

const {
	date: DATE_TOKENS,
	time: TIME_TOKENS,
	datetime: DATETIME_TOKENS,
	custom: CUSTOM_TOKENS,
} = FORMAT_TOKENS;

const formatCustomDate = (
	date: Date | string,
	formatToken: keyof DateFormats["custom"] = "timestamp"
) => {
	if (!date) return "";
	const token = CUSTOM_TOKENS[formatToken];
	const formatted = format(date, token);
	return formatted;
};

const formatTimestamp = (date: Date | string = new Date()) => {
	return formatCustomDate(date, "timestamp");
};

export type DateRangeUnit = "days" | "weeks" | "months";

const getDateRangeFromInput = (input: string) => {
	const lastRegex =
		/((?<last>last) (?<count>\d{1,}) (?<unit>days|weeks|months))/gm;
	const thisRegex = /(?<this>this) (?<unit>week|month|quarter|year)/gm;

	const endDate = new Date();

	const getUnit = (unit: DateRangeUnit) => {
		switch (unit) {
			case "days": {
				return 1;
			}
			case "weeks": {
				return 7;
			}
			case "months": {
				return 30;
			}

			default:
				return 1;
		}
	};

	let matches: RegExpMatchArray | null;
	if ((matches = lastRegex.exec(input))) {
		const { groups } = matches;
		const { last, count, unit } = groups as {
			last: string;
			count: string;
			unit: DateRangeUnit;
		};
		const start = subDays(endDate, Number(count) * getUnit(unit));
		return {
			startDate: start,
			endDate: endDate,
		};
	}

	if ((matches = thisRegex.exec(input))) {
		const { groups } = matches;
		const {
			this: main,
			count,
			unit,
		} = groups as {
			this: string;
			count: string;
			unit: DateRangeUnit;
		};
		return {
			endDate: endDate,
		};
	}
};

export {
	// All Tokens' Formats
	FORMAT_TOKENS,
	// Individual Tokens
	DATETIME_TOKENS,
	DATE_TOKENS,
	TIME_TOKENS,
	CUSTOM_TOKENS,
	// Formatters
	formatCustomDate,
	formatTimestamp,
};
