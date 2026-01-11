import styles from "../../css/ui/LayeredCircles.module.scss";
import Circle from "./Circle";

type Props = {
	size: CircleSize;
	overlap: number;
	colors: string[];
	opacity?: number;
	ringOpacity?: number;
};

type CircleSize = "XSM" | "SM" | "MD" | "LG" | "XLG" | "CUSTOM" | number;
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

const LayeredCircles = ({
	size = 96,
	overlap = 0.6,
	colors = [],
	opacity = 1,
	ringOpacity = 1,
}: Props) => {
	const circleSize = getSize(size);

	const offset = circleSize * overlap;
	return (
		<div className={styles.LayeredCircles}>
			{colors &&
				colors.map((color, idx) => {
					const left = idx * offset;
					const zIndex = idx + 10;
					return (
						<Circle
							key={color + idx}
							color={color}
							size={size}
							ringOpacity={ringOpacity}
							styles={{ left, opacity, zIndex }}
						/>
					);
				})}
		</div>
	);
};

export default LayeredCircles;
