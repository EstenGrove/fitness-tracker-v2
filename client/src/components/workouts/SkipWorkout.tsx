import styles from "../../css/workouts/SkipWorkout.module.scss";

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
};

const SkipWorkout = ({ onCancel, onConfirm }: Props) => {
	return (
		<div className={styles.SkipWorkout}>
			<div className={styles.SkipWorkout_main}>
				<h2>Skip this workout?</h2>
				<p>
					You can skip this workout and it will still occur on the next
					recurrence.
				</p>
			</div>
			<div className={styles.SkipWorkout_footer}>
				<button
					type="button"
					onClick={onCancel}
					className={styles.SkipWorkout_footer_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className={styles.SkipWorkout_footer_confirm}
				>
					Skip
				</button>
			</div>
		</div>
	);
};

export default SkipWorkout;
