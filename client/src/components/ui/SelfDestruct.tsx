import { ReactNode, useEffect, useState } from "react";

type Props = {
	children: ReactNode;
	duration?: number; // fade-out animation duration in ms
	expiry: number; // how long to stay visible (before starting fade out), in ms
};

const SelfDestruct = ({ children, expiry, duration = 500 }: Props) => {
	const [visible, setVisible] = useState(true);
	const [shouldRender, setShouldRender] = useState(true);

	useEffect(() => {
		const startFadeOutTimeout = setTimeout(() => {
			setVisible(false); // start fading out
			setTimeout(() => {
				setShouldRender(false); // unmount after fade-out finishes (resets the timer for another instance)
			}, duration);
		}, expiry);

		return () => {
			clearTimeout(startFadeOutTimeout);
		};
	}, [expiry, duration]);

	if (!shouldRender) return null;

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

export default SelfDestruct;
