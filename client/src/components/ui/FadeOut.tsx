import { ReactNode, useEffect, useState } from "react";

type Props = {
	children: ReactNode;
	delay?: number;
	duration?: number; // how long the fade out animation lasts (in ms)
	trigger: boolean; // when true, start fading out
	onComplete?: () => void; // optional callback when fully unmounted
};

const FadeOut = ({
	children,
	duration = 500,
	delay = 0,
	trigger,
	onComplete,
}: Props) => {
	const [visible, setVisible] = useState<boolean>(true);
	const [shouldRender, setShouldRender] = useState<boolean>(true);

	useEffect(() => {
		if (trigger) {
			setVisible(false);
			const unmountTimer = setTimeout(() => {
				setShouldRender(false);

				return onComplete && onComplete();
			}, duration);

			return () => clearTimeout(unmountTimer);
		}
	}, [trigger, duration, onComplete]);

	if (!shouldRender) return null;

	return (
		<div
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

export default FadeOut;
