import styles from "../../css/alerts/ActiveWorkoutIndicator.module.scss";
import sprite from "../../assets/icons/main.svg";
import { getSprite, IconKey } from "../../utils/utils_icons";

type Props = {
	onResume: () => void;
	onDismiss: () => void;
};

const PlayIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<svg className={styles.PlayIcon} onClick={onClick}>
			<use xlinkHref={`${sprite}#icon-play`}></use>
		</svg>
	);
};
const CancelIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<svg className={styles.CancelIcon} onClick={onClick}>
			<use xlinkHref={`${sprite}#icon-clearclose`}></use>
		</svg>
	);
};

const ActiveWorkoutIndicator = ({ onResume, onDismiss }: Props) => {
	const iconName: IconKey = "exercise";
	const sheet = getSprite(iconName);
	return (
		<div className={styles.ActiveWorkoutIndicator}>
			<div className={styles.ActiveWorkoutIndicator_left}>
				<svg className={styles.ActiveWorkoutIndicator_left_icon}>
					<use xlinkHref={`${sheet}#icon-${iconName}`}></use>
				</svg>
				<div className={styles.ActiveWorkoutIndicator_left_text}>
					<div className={styles.ActiveWorkoutIndicator_left_text_title}>
						Resume Workout
					</div>
				</div>
			</div>
			<div className={styles.ActiveWorkoutIndicator_right}>
				<PlayIcon onClick={onResume} />
				<CancelIcon onClick={onDismiss} />
			</div>
		</div>
	);
};

export default ActiveWorkoutIndicator;
