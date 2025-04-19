import styles from "../../css/history/StrengthHistoryEntry.module.scss";
import sprite from "../../assets/icons/main.svg";
import HistoryEntry from "./HistoryEntry";
import { HistoryOfType, StrengthHistory } from "../../features/history/types";
import { MenuAction } from "../shared/MenuDropdown";
import { StrengthSet } from "../../features/workouts/types";

type Props = {
	entry: StrengthHistory;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const getWeight = (sets: StrengthSet[]) => {
	const weight = sets.map((item) => item.weight)?.[0];

	return weight;
};

const getSetCount = (sets: StrengthSet[]) => {
	if (!sets || !sets.length) return 0;

	return sets.length;
};

const StrengthHistoryEntry = ({ entry, onMenuAction }: Props) => {
	const weight = getWeight(entry.sets);
	const setCount = getSetCount(entry.sets);
	return (
		<HistoryEntry entry={entry} onMenuAction={onMenuAction}>
			<div className={styles.WeightBadge}>
				<svg className={styles.WeightBadge_icon}>
					<use xlinkHref={`${sprite}#icon-weight-pound-2`}></use>
				</svg>
				<span>{weight} lbs.</span>
			</div>
			<div className={styles.SetBadge}>
				<svg className={styles.SetBadge_icon}>
					<use xlinkHref={`${sprite}#icon-synchronize`}></use>
				</svg>
				<span>{setCount} sets</span>
			</div>
		</HistoryEntry>
	);
};

export default StrengthHistoryEntry;
