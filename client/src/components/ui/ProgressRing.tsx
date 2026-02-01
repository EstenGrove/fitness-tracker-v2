import { useEffect, useRef } from "react";

interface ProgressRingProps {
	size?: number; // diameter in px
	strokeWidth?: number;
	progress: number; // 0 → 100
	stroke?: string; // single color
	gradientId?: string; // optional gradient ID for SVG
	gradientColors?: string[]; // optional gradient stop colors
}

const ProgressRing = ({
	size = 120,
	strokeWidth = 12,
	progress = 0,
	stroke = "#3b82f6",
	gradientId = "progressGradient",
	gradientColors,
}: ProgressRingProps) => {
	const circleRef = useRef<SVGCircleElement>(null);

	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		if (!circleRef.current) return;

		const offset = circumference * (1 - progress / 100);
		circleRef.current.style.transition = "stroke-dashoffset 400ms ease-out";
		circleRef.current.style.strokeDashoffset = offset.toString();
	}, [progress, circumference]);

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{/* Optional gradient definition */}
			{gradientColors && gradientColors.length > 1 && (
				<defs>
					<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
						{gradientColors.map((color, i) => (
							<stop
								key={i}
								offset={`${(i / (gradientColors.length - 1)) * 100}%`}
								stopColor={color}
							/>
						))}
					</linearGradient>
				</defs>
			)}

			{/* Background circle */}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="var(--bg-foreground)"
				strokeWidth={strokeWidth}
			/>

			{/* Progress circle */}
			<circle
				ref={circleRef}
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke={gradientColors ? `url(#${gradientId})` : stroke}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={circumference}
				transform={`rotate(-90 ${size / 2} ${size / 2})`} // start from top
			/>
		</svg>
	);
};

export default ProgressRing;
