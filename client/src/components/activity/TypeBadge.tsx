import sprite from "../../assets/icons/main.svg";
import styles from "../../css/activity/TypeBadge.module.scss";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";

type Props = {
	activityType: Activity;
	size?: keyof typeof sizes;
};

const sizes = {
	XSM: "2rem",
	SM: "3rem",
	MD: "4rem",
	LG: "5rem",
	XLG: "6rem",
};

const getSizeStyles = (size: keyof typeof sizes) => {
	const value = sizes[size];
	const main = {
		minWidth: value,
		maxWidth: value,
		minHeight: value,
		maxHeight: value,
		width: value,
		height: value,
	};
	const icon = {
		width: `calc(${value} - 30%)`,
		height: `calc(${value} - 30%)`,
	};
	return {
		main,
		icon,
	};
};

const TypeBadge = ({ activityType, size = "MD" }: Props) => {
	const { icon, color, bg } = getActivityStyles(activityType);
	const css = getSizeStyles(size);
	const iconCSS = { ...css.icon, fill: color };
	const bgCSS = { ...css.main, backgroundColor: bg };
	return (
		<div className={styles.TypeBadge} style={bgCSS}>
			<svg className={styles.TypeBadge_icon} style={iconCSS}>
				<use xlinkHref={`${sprite}#icon-${icon}`} />
			</svg>
		</div>
	);
};

export default TypeBadge;
