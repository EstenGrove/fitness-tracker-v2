import styles from "../../css/history/DeleteHistorySession.module.scss";
import { HistoryOfType } from "../../features/history/types";
import { useDeleteWorkoutSession } from "../../hooks/useDeleteWorkoutSession";
import { DeletedSessionData } from "../../utils/utils_history";

// Handles deleting a workout history entry (ie. session)

type Props = {
	historyEntry: HistoryOfType;
	onConfirm?: () => void;
	onCancel: () => void;
};

const DeleteHistorySession = ({ historyEntry, onCancel, onConfirm }: Props) => {
	const { deleteSession, isLoading, error, isSuccess } =
		useDeleteWorkoutSession();

	const confirmDelete = async () => {
		const { userID, historyID, activityType } = historyEntry;
		const resp = (await deleteSession({
			userID,
			historyID,
			activityType,
		}).unwrap()) as DeletedSessionData;
		if (isSuccess || resp.wasDeleted) {
			return onConfirm && onConfirm();
		} else {
			console.error(error);
		}
	};
	console.log("historyEntry", historyEntry);

	return (
		<div className={styles.DeleteHistorySession}>
			<div className={styles.DeleteHistorySession_main}>
				<h2>Delete Workout Session?</h2>
				<p>Deleting this session is permanent and cannot be undone.</p>
			</div>
			<div className={styles.DeleteHistorySession_footer}>
				<button
					type="button"
					onClick={onCancel}
					className={styles.DeleteHistorySession_footer_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={confirmDelete}
					className={styles.DeleteHistorySession_footer_confirm}
					disabled={isLoading}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default DeleteHistorySession;
