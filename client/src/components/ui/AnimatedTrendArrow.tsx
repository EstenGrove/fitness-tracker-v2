import React from "react";
import TrendArrowUpIcon, { TrendArrowGradient } from "./TrendArrowUpIcon";
import TrendArrowDownIcon from "./TrendArrowDownIcon";

type Props = {
	direction: "up" | "down";
	gradient?: TrendArrowGradient;
	size?: number;
};

const getContainerStyles = (size: number) => {
	const width = size * 1.5;
	const height = size * 1.5;
	const borderRadius = size * 0.5;
	const backgroundColor = "var(--bg-foreground-dark)";
	const dimensions = {
		width,
		height,
		borderRadius,
	};
	const display = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};
	return {
		...dimensions,
		...display,
		backgroundColor,
	};
};

const AnimatedTrendArrow = ({ direction, gradient, size = 20 }: Props) => {
	return (
		<div style={getContainerStyles(size)} data-direction={direction}>
			{direction === "up" ? (
				<TrendArrowUpIcon gradient={gradient} size={size} />
			) : (
				<TrendArrowDownIcon gradient={gradient} size={size} />
			)}
		</div>
	);
};

export default AnimatedTrendArrow;
