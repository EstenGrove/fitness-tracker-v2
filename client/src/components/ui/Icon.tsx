import main from "../../assets/icons/main.svg";
import habits from "../../assets/icons/habits.svg";
import css from "../../css/ui/Icon.module.scss";
import { IconKey, iconsMap } from "../../utils/utils_icons";
import { ComponentPropsWithoutRef, CSSProperties } from "react";

interface IconProps {
	icon: IconKey;
	color?: string;
	styles?: CSSProperties | undefined;
}
interface Props extends IconProps, ComponentPropsWithoutRef<"svg"> {}

const getSprite = (icon: IconKey): string => {
	if (icon in iconsMap[1]) {
		return main;
	} else if (icon in iconsMap[2]) {
		return habits;
	} else {
		// fallback case
		return main;
	}
};

const getIconKey = (icon: IconKey) => {
	if (icon in iconsMap[1]) {
		const set = iconsMap[1];
		return set[icon as keyof (typeof iconsMap)[1]];
	} else {
		const set = iconsMap[2];
		return set[icon as keyof (typeof iconsMap)[2]];
	}
};

const Icon = ({ icon, color = "var(--blueGrey700)", styles = {} }: Props) => {
	const sprite = getSprite(icon);
	const iconName = getIconKey(icon);
	const customStyles = { fill: color, ...styles };
	return (
		<svg className={css.Icon} style={customStyles}>
			<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
		</svg>
	);
};

export default Icon;
