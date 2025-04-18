export type RepeatType =
	| "Daily"
	| "Weekly"
	| "Monthly"
	| "Yearly"
	| "Custom"
	| "Never";

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

const isRecurring = (freq: RepeatType | string) => {
	return freq && freq !== "Never";
};

export { isRecurring, getMonthDaySuffix };
