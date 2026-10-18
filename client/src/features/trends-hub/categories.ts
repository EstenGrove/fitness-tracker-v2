import { TrendCategoryKey, TrendSeries } from "./types";

/**
 * TRENDS CATEGORY CONFIG (UI)
 * - The one place to edit per category: title, icon, charts & where "View history" goes
 * - Typed as a Record, so adding a category to 'TrendCategoryKey' requires an entry here
 * - Data (KPIs, series, insights) comes from the server; this only decides how it's shown
 */

// bars: one series | stacked: several series stacked per week | overlay: [background, foreground]
// heatmap: one sparse series with "dayOfWeek:hour" x values (rendered by 'TrendHeatMap')
export type TrendChartKind = "bars" | "stacked" | "overlay" | "heatmap";

export interface TrendChartConfig {
	key: string;
	title: string;
	kind: TrendChartKind;
	select: (series: TrendSeries[]) => TrendSeries[]; // picks this chart's series from the response
}

export interface TrendCategoryConfig {
	title: string;
	icon: string; // id in 'assets/icons/calendar.svg'
	headlineCaption: string; // shown next to the card's big number, eg. "98 min per week"
	charts: TrendChartConfig[];
	history: { path: string; label: string };
}

// Picks series by key, in the given order
const pickSeries = (...keys: string[]) => {
	return (series: TrendSeries[]) => {
		return keys
			.map((key) => series.find((entry) => entry.key === key))
			.filter((entry): entry is TrendSeries => Boolean(entry));
	};
};

const TREND_CATEGORIES: Record<TrendCategoryKey, TrendCategoryConfig> = {
	consistency: {
		title: "Consistency",
		icon: "calendar_today",
		headlineCaption: "active days",
		charts: [
			{
				key: "active-days",
				title: "Active days per week",
				kind: "bars",
				select: pickSeries("active-days-by-week"),
			},
			{
				key: "weekday",
				title: "Workouts by weekday",
				kind: "bars",
				select: pickSeries("workouts-by-weekday"),
			},
			{
				key: "day-hour",
				title: "When you work out",
				kind: "heatmap",
				select: pickSeries("workouts-by-day-hour"),
			},
		],
		history: { path: "/history", label: "View workout history" },
	},
	volume: {
		title: "Volume",
		icon: "access_time",
		headlineCaption: "per week",
		charts: [
			{
				key: "mins-by-activity",
				title: "Minutes per week",
				kind: "stacked",
				// One series per activity (the server sends them after the total)
				select: (series) =>
					series.filter((entry) => entry.key.startsWith("mins-by-week-")),
			},
		],
		history: { path: "/history", label: "View workout history" },
	},
	adherence: {
		title: "Plan adherence",
		icon: "event_available",
		headlineCaption: "completed",
		charts: [
			{
				key: "completed-vs-scheduled",
				title: "Completed vs scheduled",
				kind: "overlay",
				select: pickSeries("scheduled-by-week", "completed-by-week"),
			},
		],
		history: { path: "/workouts", label: "View your workouts" },
	},
	strength: {
		title: "Strength",
		icon: "fitness_center",
		headlineCaption: "per week",
		charts: [
			{
				key: "volume",
				title: "Volume per week",
				kind: "bars",
				select: pickSeries("volume-by-week"),
			},
		],
		history: { path: "/history/strength", label: "View strength history" },
	},
	cardio: {
		title: "Cardio",
		icon: "heart-with-pulse",
		headlineCaption: "per week",
		charts: [
			{
				key: "reps",
				title: "Reps per week",
				kind: "bars",
				select: pickSeries("reps-by-week"),
			},
		],
		history: { path: "/history/cardio", label: "View cardio history" },
	},
	walking: {
		title: "Walking",
		icon: "directions_walk",
		headlineCaption: "per week",
		charts: [
			{
				key: "miles",
				title: "Miles per week",
				kind: "bars",
				select: pickSeries("miles-by-week"),
			},
			{
				key: "steps",
				title: "Steps per week",
				kind: "bars",
				select: pickSeries("steps-by-week"),
			},
		],
		history: { path: "/history/walk", label: "View walk history" },
	},
	effort: {
		title: "Effort",
		icon: "bolt",
		headlineCaption: "hard or harder",
		charts: [
			{
				key: "effort-mix",
				title: "Effort per week",
				kind: "stacked",
				// Easy -> All Out, colored as shades of the trends accent
				select: (series) =>
					series.filter((entry) => entry.key.startsWith("effort-")),
			},
			{
				key: "calories",
				title: "Est. calories per week",
				kind: "bars",
				select: pickSeries("calories-by-week"),
			},
		],
		history: { path: "/history", label: "View workout history" },
	},
};

export { TREND_CATEGORIES };
