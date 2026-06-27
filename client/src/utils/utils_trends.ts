import { TrendDirection } from "../features/trends/types";

export type TrendSummary = {
	direction: TrendDirection;
	delta: string; // '-23%' or '+23%' or '~23%'
	percent: string; // '23%' or '23%' or '23%'
};

const getTrendSymbol = (direction: TrendDirection | number): string => {
	if (typeof direction === "number") {
		if (direction < 0) return "-";
		if (direction === 0) return "~";
		return "+";
	} else {
		if (direction === "up") return "+";
		if (direction === "down") return "-";
		return "~";
	}
};

const getTrendDirection = (value: number): TrendDirection => {
	if (value > 0) return "up";
	if (value < 0) return "down";
	return "flat";
};

const formatTrendDelta = (value: number): string => {
	const percent = value;
	if (value < 0) {
		return "-" + percent + "%";
	} else if (value === 0) {
		return "~" + percent + "%";
	} else {
		return "+" + percent + "%";
	}
};
const getTrendPercent = (value: number): string => {
	const percent = value;
	if (value < 0) {
		return percent + "%";
	}
	return percent + "%";
};

const getTrendSummary = (value: number) => {
	const direction = getTrendDirection(value);
	const percent = getTrendPercent(value);
	return { direction, delta: value, percent };
};

export {
	getTrendSymbol,
	getTrendDirection,
	formatTrendDelta,
	getTrendPercent,
	getTrendSummary,
};
