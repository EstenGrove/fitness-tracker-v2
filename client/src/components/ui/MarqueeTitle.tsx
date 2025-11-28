import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "../../css/ui/MarqueeTitle.module.scss";

type MarqueeProps = {
	text: string;
	speed?: number; // time in seconds (eg. duration of animation)
};

export const MarqueeTitle = ({ text, speed = 15 }: MarqueeProps) => {
	const textRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [overflowing, setOverflowing] = useState(false);
	const css = { "--speed": speed + "s" } as CSSProperties;

	useEffect(() => {
		const checkOverflow = () => {
			if (!containerRef.current || !textRef.current) return;
			const textEl = textRef.current as HTMLDivElement;
			const containerEl = containerRef.current as HTMLDivElement;

			const isOverflowing = textEl.scrollWidth > containerEl.clientWidth;

			setOverflowing(isOverflowing);
		};

		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [text]);

	return (
		<div
			ref={containerRef}
			className={styles.container}
			data-overflow={overflowing}
		>
			<div
				ref={textRef}
				className={`${styles.text} ${overflowing ? styles.marquee : ""}`}
				style={css}
			>
				{text}
			</div>

			{overflowing && (
				<div
					className={`${styles.text} ${styles.marquee} ${styles.clone}`}
					style={css}
				>
					{text}
				</div>
			)}
		</div>
	);
};

export default MarqueeTitle;
