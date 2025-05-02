import { ReactNode, useEffect, useState } from "react";
import styles from "../../css/ui/FadeIn.module.scss";

type Props = {
	children: ReactNode;
	delay?: number;
	duration?: number; // fade-in animation duration in ms
};

const FadeIn = ({ children, duration = 500, delay = 0 }: Props) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setVisible(true);
		}, 10);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className={styles.FadeIn}
			style={{
				opacity: visible ? 1 : 0,
				transition: `opacity ${duration}ms ease-in-out`,
				transitionDelay: delay + "ms",
			}}
		>
			{children}
		</div>
	);
};

export default FadeIn;
