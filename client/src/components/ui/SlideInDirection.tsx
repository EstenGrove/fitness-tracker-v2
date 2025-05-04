import { ReactNode, useEffect, useState } from "react";
import styles from "../../css/ui/SlideInDirection.module.scss";

type Direction = "left" | "right" | "up" | "down";

type Props = {
	children: ReactNode;
	duration?: number; // in ms
	offset?: number; // how far to slide from
	direction?: Direction;
};

const SlideInDirection = ({
	children,
	duration = 500,
	offset = 20,
	direction = "left",
}: Props) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	// Respect prefers-reduced-motion
	const prefersReducedMotion = window.matchMedia?.(
		"(prefers-reduced-motion: reduce)"
	)?.matches;

	// Get initial transform offset
	const getInitialTransform = () => {
		if (prefersReducedMotion) return "none";

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
		<div
			className={styles.SlideInDirection}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translate(0, 0)" : getInitialTransform(),
				transition: prefersReducedMotion
					? "none"
					: `opacity ${duration}ms ease, transform ${duration}ms ease`,
			}}
		>
			{children}
		</div>
	);
};

export default SlideInDirection;
