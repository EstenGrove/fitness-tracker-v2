import { ReactNode, useEffect, useState } from "react";
import styles from "../../css/ui/FadeSlideIn.module.scss";

type Direction = "left" | "right" | "up" | "down";

type Props = {
	children: ReactNode[]; // multiple children
	direction?: Direction;
	duration?: number; // per-item duration
	offset?: number; // slide distance
	delayBetween?: number; // ms between each item
};

const SlideInStaggeredList = ({
	children,
	direction = "left",
	duration = 500,
	offset = 20,
	delayBetween = 100,
}: Props) => {
	const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

	const prefersReducedMotion = window.matchMedia?.(
		"(prefers-reduced-motion: reduce)"
	)?.matches;

	useEffect(() => {
		if (prefersReducedMotion) {
			setVisibleIndexes(children.map((_, i) => i));
			return;
		}

		children.forEach((_, i) => {
			setTimeout(() => {
				setVisibleIndexes((prev) => [...prev, i]);
			}, i * delayBetween);
		});
	}, [children, delayBetween, prefersReducedMotion]);

	const getInitialTransform = () => {
		switch (direction) {
			case "left":
				return `translateX(-${offset}px)`;
			case "right":
				return `translateX(${offset}px)`;
			case "up":
				return `translateY(-${offset}px)`;
			case "down":
				return `translateY(${offset}px)`;
			default:
				return "none";
		}
	};

	return (
		<div className={styles.SlideInStaggeredList}>
			{children.map((child, i) => (
				<div
					key={i}
					className={styles.FadeSlideIn}
					style={{
						opacity: visibleIndexes.includes(i) ? 1 : 0,
						transform: visibleIndexes.includes(i)
							? "translate(0, 0)"
							: getInitialTransform(),
						transition: prefersReducedMotion
							? "none"
							: `opacity ${duration}ms ease, transform ${duration}ms ease`,
					}}
				>
					{child}
				</div>
			))}
		</div>
	);
};

export default SlideInStaggeredList;
