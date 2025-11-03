import { format } from "date-fns";

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
