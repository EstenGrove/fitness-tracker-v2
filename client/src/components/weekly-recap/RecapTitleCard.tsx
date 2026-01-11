import styles from "../../css/weekly-recap/RecapTitleCard.module.scss";
import RecapCardLayout from "./RecapCardLayout";
import { RangeParams } from "../../features/types";
import { format, isSameMonth } from "date-fns";

type Props = {
	isActive: boolean;
	dateRange: RangeParams;
};

const getRangeDesc = (dateRange: RangeParams) => {
	if (isSameMonth(dateRange.endDate, dateRange.startDate)) {
		const start = format(dateRange.startDate, "MMMM dd");
		const end = format(dateRange.endDate, "dd, yyyy");
		return `${start} - ${end}`;
	} else {
		const start = format(dateRange.startDate, "MMMM dd");
		const end = format(dateRange.endDate, "MMM dd, yyyy");
		return `${start} - ${end}`;
	}
};

const colors = [
	"var(--accent)",
	"var(--accent-blue)",
	"var(--accent-purple)",
	"var(--accent-yellow)",
	"var(--accent-red)",
	"var(--blueGrey700)",
	"var(--blueGrey800)",
];

const RecapTitleCard = ({ dateRange, isActive = false }: Props) => {
	const particles = Array.from({ length: 1300 });
	const range = getRangeDesc(dateRange);
	const header = (
		<>
			<h2 className={styles.Title}>Steven's Weekly Recap</h2>
			<h6 className={styles.Desc}>{range}</h6>
		</>
	);
	// ##TODO:
	// - Add a nice animation here...
	const body = (
		<div className={styles.body}>
			{particles.map((_, i) => {
				const size = Math.random() * 4 + 2; // 2px–6px
				const left = Math.random() * 100; // percentage
				const delay = Math.random() * 1; // 0–1s
				const duration = 1 + Math.random() * 1; // 1–2s
				const color = colors[5];

				return (
					<span
						key={i}
						className={styles.particle}
						style={{
							width: size,
							height: size,
							left: `${left}%`,
							backgroundColor: color,
							animationDelay: `${delay}s`,
							animationDuration: `${duration}s`,
						}}
					/>
				);
			})}
		</div>
	);
	if (!isActive) return null;
	return <RecapCardLayout header={header} body={body} />;
};

export default RecapTitleCard;
