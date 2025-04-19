export type RepeatType =
	| "Daily"
	| "Weekly"
	| "Monthly"
	| "Yearly"
	| "Custom"
	| "Never";

export type RepeatLabel =
	| "day"
	| "week"
	| "month"
	| "year"
	| "Never"
	| "Custom";

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

const REPEAT_TYPES: RepeatType[] = [
	"Daily",
	"Weekly",
	"Monthly",
	"Yearly",
	"Never",
	"Custom",
];
const REPEAT_LABELS: RepeatLabel[] = [
	"day",
	"week",
	"month",
	"year",
	"Never",
	"Custom",
];

export interface RecurringValues {
	interval: number | string;
	frequency: RepeatType;
	byDay: string[];
	byMonth: number | string;
	byMonthDay: number | string;
	[key: string]: string | number | Date | string[];
}

const REPEAT_TYPE_OPTIONS = [
	{ label: "Daily", value: "Daily" },
	{ label: "Weekly", value: "Weekly" },
	{ label: "Monthly", value: "Monthly" },
	{ label: "Yearly", value: "Yearly" },
	{ label: "Custom", value: "Custom" },
	{ label: "Never", value: "Never" },
];
const REPEAT_LABEL_OPTIONS = [
	{ label: "day", value: "Daily" },
	{ label: "week", value: "Weekly" },
	{ label: "month", value: "Monthly" },
	{ label: "year", value: "Yearly" },
	{ label: "Custom", value: "Custom" },
	{ label: "Never", value: "Never" },
];

const getMonthDaySuffix = (day: number) => {
	const dayMap = {
		1: "st",
		2: "nd",
		3: "rd",
		21: "st",
		22: "nd",
		23: "rd",
	};
	if (String(day).split("").length < 2) {
		return dayMap[day as keyof object];
	} else {
		const last = String(day).slice(-1);
		const suffix = dayMap[Number(last) as keyof object] || "th";
		return suffix;
	}
};

const getFrequencyLabel = (frequency: RepeatType, interval: number) => {
	const suffix = interval > 1 ? "s" : "";
	const opts = {
		Daily: "day",
		Weekly: "week",
		Monthly: "month",
		Yearly: "year",
		Custom: "",
	} as const;
	const prefix = opts[frequency as keyof object];

	return prefix + suffix;
};

const isRecurring = (freq: RepeatType | string) => {
	return freq && freq !== "Never";
};

export {
	isRecurring,
	getMonthDaySuffix,
	getFrequencyLabel,
	MONTHS,
	REPEAT_LABELS,
	REPEAT_LABEL_OPTIONS,
	REPEAT_TYPES,
	REPEAT_TYPE_OPTIONS,
};
