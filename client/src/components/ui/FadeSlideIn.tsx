import { ReactNode, useEffect, useState } from "react";
import styles from "../../css/ui/FadeSlideIn.module.scss";

type Props = {
	children: ReactNode;
	duration?: number; // in ms
	offset?: number; // how far to slide in from (px)
};

const FadeSlideIn = ({ children, duration = 500, offset = -20 }: Props) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className={styles.FadeSlideIn}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateX(0)" : `translateX(${offset}px)`,
				transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
			}}
		>
			{children}
		</div>
	);
};

export default FadeSlideIn;
