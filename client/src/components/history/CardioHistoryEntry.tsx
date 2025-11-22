import styles from "../../css/history/CardioHistoryEntry.module.scss";
import sprite from "../../assets/icons/main.svg";
import HistoryEntry from "./HistoryEntry";
import { CardioHistory, HistoryOfType } from "../../features/history/types";
import { MenuAction } from "../shared/MenuDropdown";
import { getTotalReps } from "../../utils/utils_details";

type Props = {
	entry: CardioHistory;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const CardioHistoryEntry = ({ entry, onMenuAction }: Props) => {
	const sets = entry.sets.length || 0;
	const reps: number = getTotalReps(entry.sets);

	return (
		<HistoryEntry entry={entry} onMenuAction={onMenuAction}>
			<div className={styles.CardioHistoryEntry}>↑ {reps} reps</div>
			<div className={styles.SetBadge}>
				<svg className={styles.SetBadge_icon}>
					<use xlinkHref={`${sprite}#icon-synchronize`}></use>
				</svg>
				<span>{sets} sets</span>
			</div>
		</HistoryEntry>
	);
};

export default CardioHistoryEntry;
