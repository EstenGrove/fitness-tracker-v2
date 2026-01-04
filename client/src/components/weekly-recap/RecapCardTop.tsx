import { ReactNode } from "react";
import sprite from "../../assets/icons/dashboard.svg";
import styles from "../../css/weekly-recap/RecapCardTop.module.scss";

type Props = {
	title: string;
	dates: string;
	children?: ReactNode;
	onClose: () => void;
};

const TitleSection = ({
	title = "Weekly Recap",
	dates = "December 21 - 29, 2025",
}: {
	title: string;
	dates: string;
}) => {
	return (
		<div className={styles.TitleSection}>
			<div className={styles.TitleSection_title}>{title}</div>
			<div className={styles.TitleSection_dates}>{dates}</div>
		</div>
	);
};

const RecapCardTop = ({ title, dates, children, onClose }: Props) => {
	return (
		<div className={styles.RecapCardTop}>
			<div className={styles.RecapCardTop_indicators}>{children}</div>
			<div className={styles.RecapCardTop_other}>
				<div className={styles.RecapCardTop_about}>
					<TitleSection title={title} dates={dates} />
				</div>
				<button
					type="button"
					onClick={onClose}
					className={styles.RecapCardTop_close}
				>
					<svg className={styles.RecapCardTop_close_icon}>
						<use xlinkHref={`${sprite}#icon-clear`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default RecapCardTop;
