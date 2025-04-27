import { ReactNode, useEffect, useState } from "react";

type Props = {
	children: ReactNode;
	duration?: number; // fade-in animation duration in ms
};

const FadeIn = ({ children, duration = 500 }: Props) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setVisible(true);
		}, 10);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			style={{
				opacity: visible ? 1 : 0,
				transition: `opacity ${duration}ms ease-in-out`,
			}}
		>
			{children}
		</div>
	);
};

export default FadeIn;
