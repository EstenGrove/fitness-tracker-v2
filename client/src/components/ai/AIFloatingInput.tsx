import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/ai/AIFloatingInput.module.scss";

type Props = {};

const AddInputButton = () => {
	return (
		<button className={styles.AddInputButton}>
			<svg className={styles.AddInputButton_icon}>
				<use xlinkHref={`${sprite}#icon-plus`}></use>
			</svg>
		</button>
	);
};

const AIFloatingInput = ({}: Props) => {
	return (
		<div className={styles.AIFloatingInput}>
			<AddInputButton />
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default AIFloatingInput;
