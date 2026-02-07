import { CSSProperties } from "react";
import cssModule from "../../css/ui/DriftingCircle.module.scss";
import { CircleSize } from "../../utils/utils_animations";
import Circle from "./Circle";

type Props = {
	color: string;
	size: CircleSize;
	y?: number;
	duration?: number;
	delay?: number;
	styles?: CSSProperties;
};

const DriftingCircle = ({
	y = 0,
	duration = 20,
	delay = 0.2,
	size = "MD",
	color = "var(--blueGrey700)",
	styles = {},
}: Props) => {
	const css = {
		"--y": y,
		"--duration": `${duration}s`,
		"--delay": `${delay}s`,
		...styles,
	} as CSSProperties;
	return (
		<Circle
			size={size}
			color={color}
			styles={css}
			classes={[cssModule.driftAcross]}
		/>
	);
};

export default DriftingCircle;
