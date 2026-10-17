import { CSSProperties } from "react";
import styles from "../../css/trends-details/TrendChart.module.scss";
import { TrendSeries } from "../../features/trends-hub/types";
import { TrendChartKind } from "../../features/trends-hub/categories";
import { formatSeriesLabel, getSeriesColor } from "../../utils/utils_trendsHub";

type Props = {
	title: string;
	kind: TrendChartKind;
	series: TrendSeries[]; // all share the same x values (eg. the same weeks)
};

interface Segment {
	key: string;
	label: string;
	value: number;
	height: number; // % of the chart's height
	color: string;
}

// The tallest column sets the scale: the summed column for 'stacked', the background for 'overlay'
const getMaxValue = (kind: TrendChartKind, series: TrendSeries[]) => {
	const columns = series[0]?.points.map((_, idx) => {
		const values = series.map((entry) => entry.points[idx]?.y ?? 0);
		return kind === "stacked"
			? values.reduce((sum, y) => sum + y, 0)
			: Math.max(...values);
	});
	return Math.max(...(columns ?? []), 1);
};

const getColumnSegments = (
	series: TrendSeries[],
	idx: number,
	maxValue: number,
): Segment[] => {
	return series.map((entry) => {
		const value = entry.points[idx]?.y ?? 0;
		return {
			key: entry.key,
			label: entry.label,
			value,
			height: (value / maxValue) * 100,
			color: getSeriesColor(entry.key),
		};
	});
};

// eg. "Jul 6: Scheduled 9, Completed 8"
const getColumnTitle = (x: string, segments: Segment[]) => {
	const values = segments.map(
		(segment) => `${segment.label} ${Math.round(segment.value)}`,
	);
	return `${formatSeriesLabel(x)}: ${values.join(", ")}`;
};

const Legend = ({ series }: { series: TrendSeries[] }) => {
	return (
		<div className={styles.Legend}>
			{series.map((entry) => {
				const css = { backgroundColor: getSeriesColor(entry.key) };
				return (
					<span key={entry.key} className={styles.Legend_item}>
						<span className={styles.Legend_swatch} style={css} />
						{entry.label}
					</span>
				);
			})}
		</div>
	);
};

// Simple bar chart for the trends detail pages
// - bars: one series | stacked: series stacked per column | overlay: series[1] drawn over series[0]
const TrendChart = ({ title, kind, series }: Props) => {
	const points = series[0]?.points ?? [];
	if (!points.length) return null;

	const maxValue = getMaxValue(kind, series);
	const showLegend = kind !== "bars";
	const firstLabel = formatSeriesLabel(points[0].x);
	const lastLabel = formatSeriesLabel(points[points.length - 1].x);

	return (
		<section className={styles.TrendChart}>
			<div className={styles.TrendChart_header}>
				<h3 className={styles.TrendChart_title}>{title}</h3>
				{showLegend && <Legend series={series} />}
			</div>
			<div className={styles.TrendChart_columns} role="img" aria-label={title}>
				{points.map((point, idx) => {
					const segments = getColumnSegments(series, idx, maxValue);
					return (
						<div
							key={point.x}
							className={styles.Column}
							data-kind={kind}
							title={getColumnTitle(point.x, segments)}
						>
							{segments.map((segment) => {
								const css = {
									height: `${segment.height}%`,
									backgroundColor: segment.color,
								} as CSSProperties;
								return (
									<span
										key={segment.key}
										className={styles.Column_segment}
										style={css}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
			<div className={styles.TrendChart_axis}>
				<span>{firstLabel}</span>
				<span>{lastLabel}</span>
			</div>
		</section>
	);
};

export default TrendChart;
