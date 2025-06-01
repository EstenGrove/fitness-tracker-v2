import {
	GradientColors,
	MinMaxRange,
	SummaryItem,
} from "../components/summary/types";

// We use the max value as our true max & we calculate heights based off what percentage of our max a given value is
const getScaledHeight = (value: number, range: MinMaxRange) => {
	const { max } = range;
	if (value === 0) return 0;
	const newVal = value / max;

	return newVal * 100;
};

// max: is the highest number plus our min (since 'min' is our increment/step)
const getHighAndLowRanges = (data: SummaryItem[]) => {
	const nonZeroNums: number[] = data
		.map(({ value }) => value)
		.filter((num) => num > 0);
	// get lowest non-zero value & highest value
	const max: number = Math.max(...nonZeroNums);
	const min: number = Math.min(...nonZeroNums);
	const step: number = min;

	return {
		max: max + step,
		min: min,
		step: step,
	};
};

const defaultColors: GradientColors = [
	"#007cff",
	"#0071f8",
	"#0065f0",
	"#005ae8",
	"#004ee0",
];

export { getScaledHeight, getHighAndLowRanges, defaultColors };
