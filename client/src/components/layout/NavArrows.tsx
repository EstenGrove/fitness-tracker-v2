import sprite from "../../assets/icons/calendar2.svg";
import styles from "../../css/layout/NavArrows.module.scss";
import { useNavigate } from "react-router";

type Props = {
	showBack?: boolean;
	showForward?: boolean;
	onBack?: () => void;
	onForward?: () => void;
};

const NavArrows = ({
	showBack = true,
	showForward,
	onBack,
	onForward,
}: Props) => {
	const navigate = useNavigate();

	const goBack = () => {
		if (!onBack) return navigate(-1);

		return onBack && onBack();
	};
	const goForward = () => {
		if (!onForward) return navigate(1);

		return onForward && onForward();
	};

	return (
		<div className={styles.NavArrows}>
			{showBack && (
				<button
					type="button"
					onClick={goBack}
					className={styles.NavArrows_back}
				>
					<svg className={styles.NavArrows_back_icon}>
						<use xlinkHref={`${sprite}#icon-arrow_left`}></use>
					</svg>
					<span>Back</span>
				</button>
			)}
			{showForward && (
				<button
					type="button"
					onClick={goForward}
					className={styles.NavArrows_forward}
				>
					<svg className={styles.NavArrows_forward_icon}>
						<use xlinkHref={`${sprite}#icon-arrow_rights`}></use>
					</svg>
					<span>Forward</span>
				</button>
			)}
		</div>
	);
};

export default NavArrows;
