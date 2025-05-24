import styles from "../../css/habits/DeleteHabit.module.scss";

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
};

const DeleteHabit = ({ onCancel, onConfirm }: Props) => {
	return (
		<div className={styles.DeleteHabit}>
			<div className={styles.DeleteHabit_main}>
				<h2>Delete this habit?</h2>
				<p>Deleting this habit is permanent and cannot be undone.</p>
			</div>
			<div className={styles.DeleteHabit_footer}>
				<button
					type="button"
					onClick={onCancel}
					className={styles.DeleteHabit_footer_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className={styles.DeleteHabit_footer_confirm}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default DeleteHabit;
