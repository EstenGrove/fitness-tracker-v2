import { ReactNode } from "react";
import sprite from "../../assets/icons/dashboard.svg";
import styles from "../../css/carousel/CarouselTop.module.scss";

type CarouselTopProps = {
	title: string;
	dates: string;
	children?: ReactNode;
	onClose: () => void;
};

const TitleSection = ({
	title = "Carousel Top",
	dates = "January 1 - 31, 2026",
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
const CarouselTop = ({ title, dates, children, onClose }: CarouselTopProps) => {
	return (
		<div className={styles.CarouselTop}>
			<div className={styles.CarouselTop_indicators}>{children}</div>
			<div className={styles.CarouselTop_other}>
				<div className={styles.CarouselTop_about}>
					<TitleSection title={title} dates={dates} />
				</div>
				<button
					type="button"
					onClick={onClose}
					className={styles.CarouselTop_close}
				>
					<svg className={styles.CarouselTop_close_icon}>
						<use xlinkHref={`${sprite}#icon-clear`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};
export default CarouselTop;
