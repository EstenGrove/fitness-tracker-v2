import { useState } from "react";
import styles from "../../css/trends-details/TrendHeatMap.module.scss";
import { TrendSeries } from "../../features/trends-hub/types";
import {
	formatHeatMapCell,
	formatHeatMapPeak,
	formatHour,
	getAccentShade,
	HEATMAP_CONFIG,
	HeatMapCell,
	toHeatMapGrid,
} from "../../utils/utils_trendsHub";

type Props = {
	title: string;
	series: TrendSeries[]; // one sparse series with "dayOfWeek:hour" x values
};

const getCellColor = (level: number): string | undefined => {
	return level ? getAccentShade(level, HEATMAP_CONFIG.LEVELS) : undefined;
};

const isSameCell = (a: HeatMapCell | null, b: HeatMapCell) => {
	return a?.dayOfWeek === b.dayOfWeek && a?.hour === b.hour;
};

const Legend = () => {
	const levels = Array.from(
		{ length: HEATMAP_CONFIG.LEVELS },
		(_, idx) => idx + 1,
	);
	return (
		<span className={styles.Legend} aria-hidden="true">
			Less
			<span className={styles.Legend_swatch} />
			{levels.map((level) => (
				<span
					key={level}
					className={styles.Legend_swatch}
					style={{ backgroundColor: getCellColor(level) }}
				/>
			))}
			More
		</span>
	);
};

// Workouts by day of week & hour; tap a cell to see its count (no hover on phones)
const TrendHeatMap = ({ title, series }: Props) => {
	const grid = toHeatMapGrid(series[0]?.points ?? []);
	const [selected, setSelected] = useState<HeatMapCell | null>(grid.peak);
	const hasEnoughData = grid.total >= HEATMAP_CONFIG.MIN_WORKOUTS;
	const columns = {
		gridTemplateColumns: `3rem repeat(${grid.hours.length}, 1fr)`,
	};

	return (
		<section className={styles.TrendHeatMap}>
			<h3 className={styles.TrendHeatMap_title}>{title}</h3>

			{!hasEnoughData && (
				<p className={styles.TrendHeatMap_empty}>
					Not enough timed workouts in this period yet.
				</p>
			)}

			{hasEnoughData && (
				<>
					{grid.peak && (
						<p className={styles.TrendHeatMap_summary}>
							Your busiest slot: <b>{formatHeatMapPeak(grid.peak)}</b>
						</p>
					)}

					<div
						className={styles.Grid}
						style={columns}
						role="group"
						aria-label={title}
					>
						<span />
						{grid.hours.map((hour) => (
							<span key={hour} className={styles.Grid_hour}>
								{hour % 3 === 0 ? formatHour(hour, true) : ""}
							</span>
						))}

						{grid.rows.map((row) => (
							<div key={row.dayOfWeek} className={styles.Grid_row}>
								<span className={styles.Grid_day}>{row.label}</span>
								{row.cells.map((cell) => (
									<button
										key={cell.hour}
										type="button"
										className={styles.Cell}
										data-selected={isSameCell(selected, cell)}
										style={{ backgroundColor: getCellColor(cell.level) }}
										title={formatHeatMapCell(cell)}
										aria-label={formatHeatMapCell(cell)}
										onClick={() => setSelected(cell)}
									/>
								))}
							</div>
						))}
					</div>

					<div className={styles.TrendHeatMap_footer}>
						<span className={styles.TrendHeatMap_selected}>
							{selected ? formatHeatMapCell(selected) : ""}
						</span>
						<Legend />
					</div>
				</>
			)}
		</section>
	);
};

export default TrendHeatMap;
