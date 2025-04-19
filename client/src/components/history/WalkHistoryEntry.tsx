import styles from "../../css/history/WalkHistoryEntry.module.scss";
import { HistoryOfType, WalkHistory } from "../../features/history/types";
import { formatThousand } from "../../utils/utils_misc";
import { MenuAction } from "../shared/MenuDropdown";
import HistoryEntry from "./HistoryEntry";

type Props = {
	entry: WalkHistory;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const WalkHistoryEntry = ({ entry, onMenuAction }: Props) => {
	const miles = entry.miles;
	const steps = formatThousand(entry.steps);
	return (
		<HistoryEntry entry={entry} onMenuAction={onMenuAction}>
			<div className={styles.WalkHistoryEntry}>
				<span className={styles.WalkHistoryEntry_miles}>{miles} mi.</span>
				<span className={styles.WalkHistoryEntry_steps}>{steps} steps</span>
			</div>
		</HistoryEntry>
	);
};

export default WalkHistoryEntry;
