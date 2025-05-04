import sprite from "../../assets/icons/main.svg";
import styles from "../../css/medications/PillSummary.module.scss";
import { addEllipsis } from "../../utils/utils_misc";
import DetailsCard from "../layout/DetailsCard";

type Props = {
	title: string;
	medID: number;
	totalPills: number;
	pillsTaken: number;
	pillsLeft: number;
	daysLeft: number;
};

interface PillCounts {
	totalPills: number;
	pillsTaken: number;
	pillsLeft: number;
	daysLeft: number;
}

type PillsAndDaysLeft = Pick<PillCounts, "daysLeft" | "pillsLeft">;

type MainItemProps = {
	total: number;
	label: string;
	icon: string;
	color?: string;
};

const getPillsLeftColor = (pillCounts: PillsAndDaysLeft) => {
	const { pillsLeft, daysLeft } = pillCounts;
	const hasExtra = pillsLeft > daysLeft;
	const hasNoSpare = pillsLeft === daysLeft;

	if (hasNoSpare) {
		return {
			color: "orange",
			fill: "orange",
		};
	} else if (!hasExtra) {
		return {
			color: "var(--accent-red)",
			fill: "var(--accent-red)",
		};
	} else {
		return {
			color: "var(--accent-blue)",
			fill: "var(--accent-blue)",
		};
	}
};

const MainItem = ({
	total,
	label,
	icon,
	color = "var(--blueGrey600)",
}: MainItemProps) => {
	return (
		<div className={styles.MainItem}>
			<div className={styles.MainItem_label}>
				<svg className={styles.MainItem_label_icon} style={{ fill: color }}>
					<use xlinkHref={`${sprite}#icon-${icon}`} />
				</svg>
				<span style={{ color }}>{label}</span>
			</div>
			<div className={styles.MainItem_value} style={{ color }}>
				{total}
			</div>
		</div>
	);
};

const getExtraPills = (pillCounts: PillsAndDaysLeft) => {
	const { pillsLeft, daysLeft } = pillCounts;
	const extra = pillsLeft - daysLeft;

	if (extra === 0) {
		return (
			<span>
				You have <b>0</b> extra pills
			</span>
		);
	} else if (extra < 0) {
		return <span>You're short on pills!</span>;
	} else {
		return (
			<span>
				You have <b>{extra}</b> extra pills
			</span>
		);
	}
};

const PillSummary = ({
	title = "Medication",
	medID,
	totalPills = 60,
	pillsTaken = 47,
	pillsLeft = 13,
	daysLeft = 11,
}: Props) => {
	const to = "details/" + medID;
	const newTitle = addEllipsis(title, 15);
	const pillLeftCss = getPillsLeftColor({
		pillsLeft,
		daysLeft,
	});
	return (
		<DetailsCard
			to={to}
			icon="pill"
			title={newTitle}
			color="var(--accent-blue)"
		>
			<div className={styles.PillSummary}>
				<div className={styles.PillSummary_wrapper}>
					<MainItem
						total={pillsLeft}
						label="Pills Left"
						icon="pill"
						color={pillLeftCss.color}
					/>
					<MainItem
						total={daysLeft}
						label="Days Left"
						icon="installment-plan"
						color="orange"
					/>
				</div>
				<div className={styles.PillSummary_bottom}>
					<div className={styles.PillSummary_bottom_taken}>
						<b>
							{pillsTaken} of {totalPills}{" "}
						</b>{" "}
						<span> taken</span>
					</div>
					<div className={styles.PillSummary_bottom_daysLeft}>
						{getExtraPills({ pillsLeft, daysLeft })}
					</div>
				</div>
			</div>
		</DetailsCard>
	);
};

export default PillSummary;
