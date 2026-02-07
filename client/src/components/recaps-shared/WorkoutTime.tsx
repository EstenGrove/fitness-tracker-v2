import styles from "../../css/recaps-shared/WorkoutTime.module.scss";
import { TrendMetric } from "../../features/trends/types";
import NumberCounter from "../ui/NumberCounter";

const getDeltaStyles = (workoutTime: {
	delta: number | string;
	direction: "flat" | "up" | "down";
}) => {
	const { direction } = workoutTime;

	switch (direction) {
		case "up": {
			return {
				color: "var(--accent-green)",
			};
		}
		case "down": {
			return {
				color: "var(--accent-red)",
			};
		}
		case "flat": {
			return {
				color: "var(--blueGrey400)",
			};
		}
		default:
			return { color: "initial" };
	}
};

const getDeltaSymbol = (direction: "up" | "down" | "flat") => {
	const symbols = {
		up: "↑ ",
		down: "↓ ",
		flat: "‒ ",
	};
	return symbols[direction];
};

type Props = {
	delta: number | string;
	direction: TrendMetric["direction"];
};

const WorkoutTime = ({ delta, direction }: Props) => {
	const symbol = getDeltaSymbol(direction);
	const deltaCss = getDeltaStyles({ delta, direction });

	return (
		<div className={styles.WorkoutTime}>
			Your workout time is {direction} by{" "}
			<b style={deltaCss}>
				{symbol}
				<NumberCounter number={Number(delta)} styles={{ fontSize: "1.7rem" }} />
				%
			</b>
		</div>
	);
};

export default WorkoutTime;
