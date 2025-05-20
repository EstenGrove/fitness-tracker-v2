import { useEffect, useState } from "react";
import styles from "../../css/ui/NumberCounter.module.scss";

type Props = {
	number: number;
	duration?: number;
};

const NumberCounter = ({ number, duration = 1000 }: Props) => {
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;
		let start: number | null = null;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			const newNum = Math.round(progress * number);
			setCurrent(newNum);

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => {
			isMounted = false;
			cancelAnimationFrame(animationFrame);
		};
	}, [duration, number]);

	return <span className={styles.NumberCounter}>{current}</span>;
};

export default NumberCounter;
