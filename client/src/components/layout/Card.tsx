import { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { NavLink } from "react-router";
import { iconsMap } from "../../utils/utils_icons";
import sprite from "../../assets/icons/main.svg";
import sprite2 from "../../assets/icons/main.svg";
import alt from "../../assets/icons/calendar.svg";
import styles from "../../css/layout/Card.module.scss";

interface CardProps {
	cardRef?: Ref<HTMLDivElement>;
	children?: ReactNode;
}
interface Props extends CardProps, ComponentPropsWithoutRef<"div"> {}
type CardHeaderProps = {
	to?: string;
	children?: ReactNode;
};
type GoToProps = {
	to: string;
	onClick?: () => void;
};
type CardTitlesProps = {
	title: string;
};
interface IconPropsInterface {
	icon: keyof (typeof iconsMap)[1] | keyof (typeof iconsMap)[2];
	background?: string;
	color?: string;
}

interface IconProps
	extends IconPropsInterface,
		ComponentPropsWithoutRef<"svg"> {}

const GoTo = ({ to, onClick }: GoToProps) => {
	const handleClick = () => {
		return onClick && onClick();
	};

	return (
		<div className={styles.GoTo} onClick={handleClick}>
			<NavLink to={to}>
				<svg className={styles.GoTo_icon}>
					<use xlinkHref={`${alt}#icon-keyboard_arrow_right`}></use>
				</svg>
			</NavLink>
		</div>
	);
};

const getSprite = (name: string) => {
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

const getIcon = (name: string): string => {
	if (name in iconsMap[1]) {
		return iconsMap[1][name as keyof object];
	} else if (name in iconsMap[2]) {
		return iconsMap[2][name as keyof object];
	} else {
		return name;
	}
};

const CardIcon = ({
	icon,
	background = "transparent",
	color = "var(--blueGrey800)",
	...rest
}: IconProps) => {
	const sheet = getSprite(icon);
	const iconName = getIcon(icon);
	const bg = { backgroundColor: background };
	const fill = { fill: color };
	return (
		<div className={styles.CardIcon} style={bg}>
			<svg className={styles.CardIcon_icon} style={fill} {...rest}>
				<use xlinkHref={`${sheet}#icon-${iconName}`}></use>
			</svg>
		</div>
	);
};
const CardTitles = ({ title }: CardTitlesProps) => {
	return (
		<div className={styles.CardTitles}>
			<h6 className={styles.CardTitles_title}>{title}</h6>
		</div>
	);
};
const CardHeader = ({ to = "", children }: CardHeaderProps) => {
	return (
		<div className={styles.CardHeader}>
			<div className={styles.CardHeader_titles}>{children}</div>
			<GoTo to={to} />
		</div>
	);
};

const Card = ({ children, ...rest }: Props) => {
	return (
		<div className={styles.Card} {...rest}>
			<div className={styles.Card_main}>{children}</div>
		</div>
	);
};

export { Card, GoTo, CardHeader, CardIcon, CardTitles };
