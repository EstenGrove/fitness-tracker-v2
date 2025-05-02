import styles from "../../css/workouts/UnskipWorkout.module.scss";

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
};

const UnskipWorkout = ({ onCancel, onConfirm }: Props) => {
	return (
		<div className={styles.UnskipWorkout}>
			<div className={styles.UnskipWorkout_main}>
				<h2>Undo skipping this workout?</h2>
				<p>You've already skipped this workout. Would you like to undo?</p>
			</div>
			<div className={styles.UnskipWorkout_footer}>
				<button
					type="button"
					onClick={onCancel}
					className={styles.UnskipWorkout_footer_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className={styles.UnskipWorkout_footer_confirm}
				>
					Un-Skip
				</button>
			</div>
		</div>
	);
};

export default UnskipWorkout;
