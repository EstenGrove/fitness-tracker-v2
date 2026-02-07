import styles from "../../css/ui/DottedBarChart.module.scss";

type Props = {
	data: number[];
	maxValue: number;

	dotColor?: string;
	labelColor?: string;
	axisColor?: string;
};

const DottedBarChart = ({
	data,
	maxValue = 20,
	dotColor = "currentColor",
	labelColor = "currentColor",
	axisColor = "currentColor",
}: Props) => {
	const chartHeight = 160;
	const barWidth = 40;
	const dotSpacing = 10;
	const dotRadius = 3;

	return (
		<svg width={data.length * barWidth} height={220}>
			{data.map((reps, i) => {
				const dots = Math.round((reps / maxValue) * (chartHeight / dotSpacing));

				return (
					<g key={i} transform={`translate(${i * barWidth + 20}, 0)`}>
						{Array.from({ length: dots }).map((_, d) => (
							<circle
								key={d}
								className={styles.dot}
								cx={0}
								cy={chartHeight - d * dotSpacing}
								r={dotRadius}
								style={{
									animationDelay: `${d * 60 + i * 120}ms`,
									fill: dotColor,
								}}
							/>
						))}

						{/* Rep count */}
						<text
							x={0}
							y={chartHeight - dots * dotSpacing - 8}
							textAnchor="middle"
							fontSize="10"
							fill={labelColor}
						>
							{reps}
						</text>

						{/* X axis label circle */}
						<g transform={`translate(0, ${chartHeight + 20})`}>
							<circle r="12" fill="none" stroke={axisColor} opacity="0.6" />
							<text textAnchor="middle" dy="4" fontSize="10" fill={labelColor}>
								{i + 1}
							</text>
						</g>
					</g>
				);
			})}
		</svg>
	);
};

export default DottedBarChart;
