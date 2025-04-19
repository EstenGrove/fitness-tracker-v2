import styles from "../../css/history/CardioHistoryEntry.module.scss";
import HistoryEntry from "./HistoryEntry";
import { CardioHistory, HistoryOfType } from "../../features/history/types";
import { MenuAction } from "../shared/MenuDropdown";

type Props = {
	entry: CardioHistory;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const CardioHistoryEntry = ({ entry, onMenuAction }: Props) => {
	const reps: number = entry.reps;

	return (
		<HistoryEntry entry={entry} onMenuAction={onMenuAction}>
			<div className={styles.CardioHistoryEntry}>{reps} reps</div>
		</HistoryEntry>
	);
};

export default CardioHistoryEntry;
