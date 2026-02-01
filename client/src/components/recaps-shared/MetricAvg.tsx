import sprite from "../../assets/icons/main.svg";
import styles from "../../css/recaps-shared/MetricAvg.module.scss";
import { TrendDirection } from "../../features/trends/types";
import { formatThousand } from "../../utils/utils_misc";
import { durationTo } from "../../utils/utils_workouts";
import TrendArrow from "./TrendArrow";

type Props = {
	title?: string;
	type: MetricType;
	value: number | string;
	label?: string;
	direction: TrendDirection;
	delta: number | string;
};

type MetricType =
	| "mins"
	| "miles"
	| "steps"
	| "reps"
	| "sets"
	| "volume"
	| "effort";

const metricTypes = {
	mins: {
		icon: "time",
		color: "var(--accent-blue)",
		fill: "var(--walkFill)",
		label: "avg duration",
		format: (value: number) => durationTo(value, "h&m"),
	},
	miles: {
		icon: "footstep",
		color: "var(--walkAccent)",
		fill: "var(--walkFill)",
		label: "avg miles",
		format: (value: number) => value.toFixed(2),
	},
	steps: {
		icon: "step-length",
		color: "var(--walkAccent)",
		fill: "var(--walkFill)",
		label: "avg steps",
		format: (value: number) => formatThousand(value),
	},
	reps: {
		icon: "weightlift-2",
		color: "var(--strengthAccent)",
		fill: "var(--strengthFill)",
		label: "avg reps",
		format: (value: number) => value,
	},
	sets: {
		icon: "synchronize",
		color: "var(--accent-orange)",
		fill: "var(--orangeBG)",
		label: "avg sets",
		format: (value: number) => value,
	},
	volume: {
		icon: "weight-pound",
		color: "var(--strengthAccent)",
		fill: "var(--strengthFill)",
		label: "avg volume",
		format: (value: number) => formatThousand(value),
	},
	effort: {
		icon: "effort",
		color: "var(--accent-red)",
		fill: "var(--redBG)",
		label: "avg effort",
		format: (value: number) => value,
	},
};

const formatDelta = (delta: number | string, direction: TrendDirection) => {
	const withPercent = delta + "%";

	switch (direction) {
		case "up": {
			return "+" + withPercent;
		}
		case "down": {
			return "-" + withPercent;
		}
		case "flat": {
			return "~" + withPercent;
		}

		default:
			return withPercent;
	}
};

const MetricAvg = ({
	title,
	type,
	value,
	label,
	direction,
	delta = 0,
}: Props) => {
	const typeOptions = metricTypes[type];
	const targetDelta = formatDelta(delta, direction);
	return (
		<div className={styles.MetricTrend}>
			<div className={styles.MetricTrend_top}>
				<div
					className={styles.MetricTrend_top_wrapper}
					style={{ backgroundColor: typeOptions?.fill }}
				>
					<svg
						className={styles.MetricTrend_top_icon}
						style={{ fill: typeOptions.color }}
					>
						<use xlinkHref={`${sprite}#icon-${typeOptions.icon}`}></use>
					</svg>
				</div>
				{!!title && <div className={styles.MetricTrend_top_title}>{title}</div>}
			</div>
			<div className={styles.MetricTrend_main}>
				<div className={styles.MetricTrend_main_value}>
					<div>{typeOptions.format(value as number)}</div>
				</div>
				<div className={styles.MetricTrend_main_label}>
					<div>{label ?? typeOptions.label}</div>
				</div>
				<div className={styles.MetricTrend_main_delta}>
					<TrendArrow direction={direction} />
					<div className={styles.MetricTrend_main_delta_value}>
						{targetDelta}
					</div>
				</div>
				{/* <div className={styles.MetricTrend_main_label}>
					<div>{label ?? typeOptions.label}</div>
				</div> */}
			</div>
		</div>
	);
};

export default MetricAvg;
