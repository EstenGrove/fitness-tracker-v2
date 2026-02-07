import styles from "../../css/ui/AnimatedCircle.module.scss";

type AnimatedCircleProps = {
	size: number;
	fill: string;
	baseX: number;
	phase: number;
};

const AnimatedCircle = ({ size, fill, baseX, phase }: AnimatedCircleProps) => {
	return (
		<div
			className={styles.AnimatedCircle}
			style={{
				position: "absolute",
				left: baseX,
				width: size,
				height: size,
				borderRadius: "50%",
				background: fill,
				mixBlendMode: "multiply",
				filter: "saturate(1.2)",
				animation: `
          driftX 18s ease-in-out ${phase * 1.5}s infinite alternate,
          driftY 22s ease-in-out ${phase * 2}s infinite alternate
        `,
			}}
		/>
	);
};

export default AnimatedCircle;
