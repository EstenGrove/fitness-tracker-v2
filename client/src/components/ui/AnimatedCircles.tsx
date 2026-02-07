import AnimatedCircle from "./AnimatedCircle";
import styles from "../../css/ui/AnimatedCircles.module.scss";

type AnimatedCirclesProps = {
	size?: number;
	overlap?: number;
	colors: string[];
};

const AnimatedCircles = ({
	size = 96,
	overlap = 0.6,
	colors,
}: AnimatedCirclesProps) => {
	const offset = size * overlap;
	const width = size + offset * (colors.length - 1);

	return (
		<div className={styles.container} style={{ width, height: size }}>
			{colors.map((color, index) => (
				<div
					key={index}
					className={styles.circle}
					style={{
						width: size,
						height: size,
						left: index * offset,
						background: color,
						animationDelay: `${index * 1.6}s`,
					}}
				/>
			))}
		</div>
	);
};

export default AnimatedCircles;
