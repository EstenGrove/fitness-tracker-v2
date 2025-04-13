import sprite from "../../assets/icons/main.svg";
import styles from "../../css/details/DetailsBlock.module.scss";

type Props = {
	type: BlockType;
	label: string;
	value: string | number;
};

interface BlockSet {
	icon: string;
	color: string;
}

type BlockType =
	| "Cardio"
	| "Effort"
	| "Calories"
	| "Reps"
	| "Sets"
	| "Stretch"
	| "Steps"
	| "Miles"
	| "Pace"
	| "Duration"
	| "WorkoutType"
	| "Weight"
	| "Repeat"
	| "Date"
	| "ByDay"
	| "Every";

type BlockMap = Record<BlockType, BlockSet>;

const blockMap: BlockMap = {
	Every: {
		icon: "delivery-time",
		color: "var(--blueGrey500)",
	},
	ByDay: {
		icon: "timeline-week",
		color: "var(--blueGrey700)",
	},
	Date: {
		icon: "tear-off-calendar",
		color: "var(--blueGrey700)",
	},
	Repeat: {
		icon: "time-machine",
		color: "var(--blueGrey400)",
	},
	Cardio: {
		icon: "pushups",
		color: "var(--accent-green)",
	},
	Effort: {
		icon: "effort",
		color: "var(--blueGrey500)",
	},
	Calories: {
		// icon: "campfire",
		icon: "gas-industry",
		color: "var(--accent-red)",
	},
	Reps: {
		icon: "weight-pound",
		color: "var(--accent-blue)",
	},
	Sets: {
		icon: "goal",
		color: "#ff1a75",
	},
	Stretch: {
		icon: "stretching",
		color: "var(--accent)",
	},
	Steps: {
		icon: "walking-2",
		color: "var(--accent-green)",
	},
	Duration: {
		icon: "time",
		color: "var(--accent-red-alt)",
	},
	Miles: {
		icon: "step-length",
		color: "var(--accent-yellow)",
	},
	Pace: {
		icon: "step-length",
		color: "var(--accent-orange)",
	},
	WorkoutType: {
		icon: "goal",
		color: "var(--accent-alt-red)",
	},
	Weight: {
		icon: "dumbbell-2",
		color: "var(--main-accent)",
	},
};

const DetailsBlock = ({ type, label, value }: Props) => {
	const blockStyles = blockMap[type as keyof object] as BlockSet;
	const iconName = blockStyles.icon;
	return (
		<div className={styles.DetailsBlock}>
			<div className={styles.DetailsBlock_left}>
				<div className={styles.DetailsBlock_left_square}>
					<svg
						className={styles.DetailsBlock_left_square_icon}
						style={{ fill: blockStyles.color }}
					>
						<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
					</svg>
				</div>
			</div>
			<div className={styles.DetailsBlock_main}>
				<div
					className={styles.DetailsBlock_main_value}
					style={{ color: blockStyles.color }}
				>
					{value}
				</div>
				<div className={styles.DetailsBlock_main_title}>{label}</div>
			</div>
		</div>
	);
};

export default DetailsBlock;
