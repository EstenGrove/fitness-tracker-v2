import { CSSProperties } from "react";
import css from "../../css/ui/Circle.module.scss";
import { CircleSize } from "../../utils/utils_animations";

const sizes = {
	XSM: 30,
	SM: 50,
	MD: 100,
	LG: 200,
	XLG: 350,
};

const getSize = (size: CircleSize) => {
	if (typeof size === "string") {
		const num = sizes[size as keyof object];
		return num;
	} else {
		return size;
	}
};

const withOpacity = (color: string, alpha: number) => {
	if (color.startsWith("rgba")) {
		return color.replace(/rgba\(([^)]+),[^)]+\)/, `rgba($1, ${alpha})`);
	}

	if (color.startsWith("rgb")) {
		return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
	}

	return color;
};

type Props = {
	size?: CircleSize;
	color: string;
	styles?: CSSProperties;
	ringOpacity?: number;
	classes?: string[];
};

const Circle = ({
	color,
	size = "MD",
	ringOpacity = 1,
	styles = {},
	classes = [],
}: Props) => {
	const circleSize = getSize(size);
	const custom = {
		position: "absolute",
		width: circleSize,
		height: circleSize,
		borderRadius: "50%",
		backgroundColor: color,
		boxShadow: `0 0 0 2px ${withOpacity(color, ringOpacity)}`,
		...styles,
	} as CSSProperties;
	const allClasses = [css.Circle, ...classes].join(" ");
	return <div className={allClasses} style={custom}></div>;
};

export default Circle;
