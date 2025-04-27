import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../css/ui/ProgressCircle.module.scss";

type ColorType = "blue" | "purple" | "green" | "primary" | "blank";

type Props = {
	percentage: number;
	size?: number;
	color?: ColorType;
	trackColor?: string;
	showText?: boolean;
	showBlank?: boolean;
};

const accents = {
	blue: {
		main: "var(--accent-blue)",
		start: "var(--blueTint200)",
		stop: "var(--accent-blue)",
	},
	purple: {
		main: "var(--accent-purple)",
		start: "var(--purple200)",
		stop: "var(--accent-purple)",
	},
	green: {
		main: "var(--accent-green)",
		start: "var(--green200)",
		stop: "var(--accent-green)",
	},
	primary: {
		main: "var(--accent)",
		start: "var(--accentTint200)",
		stop: "var(--accent)",
	},
	blank: {
		main: "var(--blueGrey800)",
		start: "var(--blueGrey800)",
		stop: "var(--blueGrey800)",
	},
};

const getGradients = (color: ColorType) => {
	const group = accents[color];

	return group;
};

const range = {
	min: 0,
	max: 565,
};

const getProgressFromPercent = (percent: number) => {
	if (percent > 100) {
		return 0;
	}

	const rangeMax = range.max; // The value corresponding to 0%
	const progress = rangeMax - percent * (rangeMax / 100);
	return progress;
};

const initial = 565.48;

const ProgressCircle = ({
	percentage = 0,
	size = 200,
	color = "purple",
	trackColor = "var(--blueGrey800)",
	showText = false,
	showBlank = false,
}: Props) => {
	const gradientId = "progress-bar";
	const gradients = getGradients(color);
	const circum = 2 * Math.PI * 90;
	const circleRef = useRef<SVGCircleElement>(null);
	const [offset, setOffset] = useState(initial);
	const ringColor = showBlank ? gradients.main : `url(#${gradientId})`;

	const updateOffset = useCallback((value: number) => {
		const newOffset = getProgressFromPercent(value);
		setOffset(newOffset);
	}, []);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		updateOffset(percentage);

		return () => {
			isMounted = false;
		};
	}, [percentage, updateOffset]);

	return (
		<div className={styles.ProgressCircle}>
			<svg
				width={size}
				height={size}
				viewBox="-25 -25 250 250"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				style={{ transform: "rotate(-90deg)" }}
			>
				<defs>
					<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="100%" stopColor={gradients.main} />
						<stop offset="0%" stopColor={gradients.main} />
					</linearGradient>

					<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
						<feDropShadow
							dx="0"
							dy="0"
							stdDeviation="6"
							floodColor="rgba(0, 0, 0, 0.9)"
						/>
					</filter>

					{/* Mask to show shadow only at the leading edge */}
					<mask id="leading-edge-mask">
						<rect width="100%" height="100%" fill="white" />
						<circle
							r={90}
							cx="100"
							cy="100"
							fill="none"
							stroke="black"
							strokeWidth="16px"
							strokeLinecap="round"
							strokeDasharray={`${circum} ${circum}`}
							style={{
								strokeDashoffset: offset,
							}}
						/>
					</mask>
				</defs>

				<circle
					id="track"
					r="90"
					cx="100"
					cy="100"
					fill="transparent"
					stroke={trackColor}
					strokeWidth="16px"
					className={styles.ProgressCircle_track}
				/>
				<circle
					ref={circleRef}
					id="progress"
					r="90"
					cx="100"
					cy="100"
					// stroke={`url(#${gradientId})`}
					stroke={ringColor}
					strokeWidth="16px"
					strokeLinecap="round"
					fill="transparent"
					className={styles.ProgressCircle_progress}
					// strokeDasharray="565.48px"
					strokeDasharray={`${circum} ${circum}`}
					style={{
						strokeDashoffset: offset + "px",
						transition: "stroke-dashoffset 0.5s ease-in-out",
					}}
				/>

				{percentage > 100 && (
					<circle
						r={90}
						cx="100"
						cy="100"
						fill="transparent"
						stroke={ringColor}
						// stroke={`url(#${gradientId})`} // Second progress ring color
						strokeWidth="16px"
						strokeLinecap="round"
						strokeDasharray={`${circum} ${circum}`}
						style={{
							strokeDashoffset: circum - ((percentage % 100) / 100) * circum,
							transition: "stroke-dashoffset 0.7s ease-in-out",
							filter: "url(#shadow)",
							// mask: "url(#leading-edge-mask)",
						}}
						mask="url(#leading-edge-mask)"
					/>
				)}

				{showText && (
					<text
						x="72px"
						y="115px"
						fill={gradients.main}
						fontWeight="bold"
						style={{
							transform: "rotate(90deg) translate(30px, -196px)",
						}}
						textAnchor="middle"
						className={styles.ProgressCircle_text}
					>
						{percentage}%
					</text>
				)}
			</svg>
		</div>
	);
};

export default ProgressCircle;
