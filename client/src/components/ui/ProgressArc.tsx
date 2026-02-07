import { useEffect, useRef } from "react";

interface Props {
	size?: number;
	strokeWidth?: number;
	progress: number; // 0–100
	stroke?: string;
	bgStroke?: string;
	arcDegrees?: number; // ex: 270
}

const ProgressArc = ({
	size = 160,
	strokeWidth = 14,
	progress = 0,
	stroke = "#3b82f6",
	bgStroke = "var(--blueGrey800)",
	arcDegrees = 270,
}: Props) => {
	const pathRef = useRef<SVGPathElement>(null);

	const radius = (size - strokeWidth) / 2;
	const cx = size / 2;
	const cy = size / 2;

	const toRad = (deg: number) => (deg * Math.PI) / 180;

	// Start bottom-left, end bottom-right
	const startAngle = 135; // bottom-left-ish
	const endAngle = startAngle + arcDegrees;

	const polar = (angle: number) => ({
		x: cx + radius * Math.cos(toRad(angle)),
		y: cy + radius * Math.sin(toRad(angle)),
	});

	const start = polar(startAngle);
	const end = polar(endAngle);

	// Force large arc if > 180deg
	const largeArcFlag = arcDegrees > 180 ? 1 : 0;

	const arcPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;

	const arcLength = toRad(arcDegrees) * radius;
	const offset = arcLength * (1 - progress / 100);

	useEffect(() => {
		if (!pathRef.current) return;

		pathRef.current.style.transition = "stroke-dashoffset 800ms ease-out";
		pathRef.current.style.strokeDashoffset = offset.toString();
	}, [offset]);

	return (
		<svg width={size} height={size}>
			{/* Background arc */}
			<path
				d={arcPath}
				fill="none"
				stroke={bgStroke}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
			/>

			{/* Progress arc */}
			<path
				ref={pathRef}
				d={arcPath}
				fill="none"
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={arcLength}
				strokeDashoffset={arcLength}
			/>
		</svg>
	);
};

export default ProgressArc;
