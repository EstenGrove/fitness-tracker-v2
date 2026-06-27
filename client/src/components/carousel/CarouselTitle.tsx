import styles from "../../css/carousel/CarouselTitle.module.scss";

type Props = {
	title: string;
	desc: string;
};

const CarouselTitle = ({ title, desc }: Props) => {
	return (
		<div className={styles.CarouselTitle}>
			<div className={styles.Title}>{title}</div>

			<h6 className={styles.Desc}>{desc}</h6>
		</div>
	);
};

export default CarouselTitle;
