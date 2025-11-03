import styles from "../../css/workouts/DeleteWorkout.module.scss";

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
};

const DeleteWorkout = ({ onCancel, onConfirm }: Props) => {
	return (
		<div className={styles.DeleteWorkout}>
			<div className={styles.DeleteWorkout_main}>
				<h2>Delete this workout?</h2>
				<p>
					You can delete this workout and it will still occur on the next
					recurrence.
				</p>
			</div>
			<div className={styles.DeleteWorkout_footer}>
				<button
					type="button"
					onClick={onCancel}
					className={styles.DeleteWorkout_footer_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className={styles.DeleteWorkout_footer_confirm}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default DeleteWorkout;
