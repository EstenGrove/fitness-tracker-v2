import { ReactNode } from "react";
import { IconKey, iconsMap } from "../../utils/utils_icons";
import sprite from "../../assets/icons/main.svg";
import sprite2 from "../../assets/icons/habits.svg";
import alt from "../../assets/icons/calendar.svg";
import styles from "../../css/weekly-recap/RecapCardHeader.module.scss";

type Props = {
	icon: IconKey | null;
	color?: string;
	children?: ReactNode;
};

const getSprite = (name: string | null) => {
	if (!name) return "";
	const in1 = name in iconsMap[1];
	const in2 = name in iconsMap[2];

	if (in1) {
		return sprite;
	} else if (in2) {
		return sprite2;
	} else {
		return alt;
	}
};

const getIcon = (name: string | null): string => {
	if (!name) return "";
	if (name in iconsMap[1]) {
		return iconsMap[1][name as keyof object];
	} else if (name in iconsMap[2]) {
		return iconsMap[2][name as keyof object];
	} else {
		return name;
	}
};

const RecapCardHeader = ({ icon = null, color, children }: Props) => {
	const iconName = getIcon(icon);
	const sheet = getSprite(icon);
	const css = { fill: color };
	return (
		<div className={styles.RecapCardHeader}>
			{icon && (
				<svg className={styles.RecapCardHeader_icon} style={css}>
					<use xlinkHref={`${sheet}#icon-${iconName}`}></use>
				</svg>
			)}
			{children}
		</div>
	);
};

export default RecapCardHeader;
