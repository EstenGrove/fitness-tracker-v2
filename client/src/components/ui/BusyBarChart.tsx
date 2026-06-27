import styles from "../../css/ui/BusyBarChart.module.scss";

// This should be a densely packed bar chart, that supports highlight one or more data points.
// Since we're passing the data as is, we can customize what items get highlighted, how they're sorted and displayed etc.

type AxisLabel = {
	min: string;
	max: string;
};

type Props = {
	data: DataPointEntry[];
	xAxisLabel?: AxisLabel;
	yAxisLabel?: AxisLabel;
};

type DataPointEntry = {
	id: number;
	date: string;
	value: number;
	height: number;
	label?: string;
	color?: string; // Maybe a highlight color
};

type DataPointProps = {
	dataPoint: DataPointEntry;
	height: number;
};

const DataPoint = ({ dataPoint, height }: DataPointProps) => {
	const { id, date, value, label, color } = dataPoint;
	const css = {
		height: `${height}%`,
		backgroundColor: color,
	};
	return (
		<div
			className={styles.DataPoint}
			style={css}
			data-id={id}
			data-date={date}
			data-value={value}
			data-label={label}
			data-color={color}
		></div>
	);
};

const getMinMaxValues = (data: DataPointEntry[]) => {
	const rawValues = data.map((x) => x.value);
	const max = Math.max(...rawValues);
	const min = Math.min(...rawValues);

	return {
		max: max + min,
		min: min,
	};
};

const getScaledHeight = (
	value: number,
	range: { max: number; min: number },
) => {
	const { max } = range;
	if (value === 0) return 0;
	const newVal = value / max;

	return newVal * 100;
};

const hasLabel = (axisLabel: AxisLabel) => {
	return axisLabel.min !== "" || axisLabel.max !== "";
};

const XAxisLabels = ({ xAxisLabel }: { xAxisLabel: AxisLabel }) => {
	const { min, max } = xAxisLabel;

	if (!hasLabel(xAxisLabel)) {
		return null;
	}
	return (
		<div className={styles.XAxisLabels}>
			<div className={styles.XAxisLabels_min}>{min}</div>
			<div className={styles.XAxisLabels_max}>{max}</div>
		</div>
	);
};
const YAxisLabels = ({ yAxisLabel }: { yAxisLabel: AxisLabel }) => {
	const { min, max } = yAxisLabel;

	if (!hasLabel(yAxisLabel)) {
		return null;
	}
	return (
		<div className={styles.YAxisLabels}>
			<div className={styles.YAxisLabels_max}>{max}</div>
			<div className={styles.YAxisLabels_min}>{min}</div>
		</div>
	);
};

const BusyBarChart = ({
	data = [],
	xAxisLabel = { min: "", max: "" },
	yAxisLabel = { min: "", max: "" },
}: Props) => {
	const { min, max } = getMinMaxValues(data);

	return (
		<div className={styles.BusyBarChart}>
			<div className={styles.BusyBarChart_yAxisLabel}>
				<YAxisLabels yAxisLabel={yAxisLabel} />
			</div>
			<div className={styles.BusyBarChart_container}>
				<div className={styles.BusyBarChart_container_graph}>
					{data.map((item) => {
						const scaledHeight = getScaledHeight(item.value, { max, min });
						return (
							<DataPoint key={item.id} dataPoint={item} height={scaledHeight} />
						);
					})}
				</div>
				<XAxisLabels xAxisLabel={xAxisLabel} />
			</div>
		</div>
	);
};

export default BusyBarChart;
