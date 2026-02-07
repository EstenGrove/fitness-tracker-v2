import sprite from "../../assets/icons/trends.svg";
import styles from "../../css/recaps-shared/TrendItem.module.scss";

type TrendDir = "up" | "down" | "flat";

type Props = {
	value: number | string;
	label: string;
	direction: TrendDir;
};

const getTrendIcon = (direction: TrendDir) => {
	const names = {
		up: "trending-up",
		down: "trending-down",
		flat: "graphic_eq",
	};
	return names[direction];
};

const getIcon = (direction: TrendDir) => {
	const icons = {
		up: (
			<svg className={styles.TrendUpArrow}>
				<use xlinkHref={`${sprite}#icon-trending-up`}></use>
			</svg>
		),
		down: (
			<svg className={styles.TrendDownArrow}>
				<use xlinkHref={`${sprite}#icon-trending-down`}></use>
			</svg>
		),
		flat: (
			<svg className={styles.TrendFlatArrow}>
				<use xlinkHref={`${sprite}#icon-graphic_eq`}></use>
			</svg>
		),
	};

	return icons[direction];
};

const TrendArrow = ({ direction }: { direction: TrendDir }) => {
	const icon = getIcon(direction);

	return <>{icon}</>;
};

const TrendItem = ({ value = 22, label, direction = "up" }: Props) => {
	return (
		<div className={styles.TrendItem}>
			<div className={styles.TrendItem_top}>
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
			<div className={styles.TrendItem_icon}>
				<div>+{value}%</div>
				<TrendArrow direction={direction} />
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default TrendItem;
