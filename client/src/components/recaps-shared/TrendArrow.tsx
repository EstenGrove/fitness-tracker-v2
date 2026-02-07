import { CSSProperties } from "react";
import sprite from "../../assets/icons/trends.svg";
import css from "../../css/recaps-shared/TrendArrow.module.scss";

type TrendDir = "up" | "down" | "flat";

type Props = {
	direction: TrendDir;
	styles?: CSSProperties;
};

const getIcon = (direction: TrendDir, styles: CSSProperties = {}) => {
	const icons = {
		up: (
			<svg className={css.TrendUpArrow} style={styles}>
				<use xlinkHref={`${sprite}#icon-trending-up`}></use>
			</svg>
		),
		down: (
			<svg className={css.TrendDownArrow} style={styles}>
				<use xlinkHref={`${sprite}#icon-trending-down`}></use>
			</svg>
		),
		flat: (
			<svg className={css.TrendFlatArrow} style={styles}>
				<use xlinkHref={`${sprite}#icon-graphic_eq`}></use>
			</svg>
		),
	};

	return icons[direction];
};

const TrendArrow = ({ direction, styles = {} }: Props) => {
	const icon = getIcon(direction, styles);

	return <>{icon}</>;
};

export default TrendArrow;
