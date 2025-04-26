import { useEffect, useState } from "react";
import styles from "../../css/ui/TimeCounter.module.scss";

type Props = {
	hrs: number;
	mins: number;
	duration: number;
};

const TimeCounter = ({ hrs = 16, mins = 32, duration = 1000 }: Props) => {
	const totalTargetMins = hrs * 60 + mins;
	const [currentMins, setCurrentMins] = useState<number>(0);
	const newHrs = Math.floor(currentMins / 60);
	const mainMins = currentMins % 60;

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;
		let start: number | null = null;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			const newMins = Math.round(progress * totalTargetMins);
			setCurrentMins(newMins);

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => {
			isMounted = false;
			cancelAnimationFrame(animationFrame);
		};
	}, [duration, totalTargetMins]);

	return (
		<h1 className={styles.TimeCounter}>
			<b>{newHrs}</b> hr <b>{mainMins}</b> min
		</h1>
	);
};

export default TimeCounter;
