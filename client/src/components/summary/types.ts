export interface SummaryItem {
	label: string;
	value: number;
}

export type GradientColors = [string, string, string, string, string];

export interface MinMaxRange {
	min: number;
	max: number;
}

export interface MinMaxStep extends MinMaxRange {
	step: number;
}
