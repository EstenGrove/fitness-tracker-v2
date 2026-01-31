import { useEffect, useRef, useState } from "react";

interface Props {
	data: number[];
	fill?: string;
	stroke?: string;
	width?: number;
	height?: number;
	heightRatio?: number;
	smoothStroke?: boolean;
}

const buildSmoothPath = (pts: { x: number; y: number }[]) => {
	if (pts.length < 2) return "";

	let d = `M ${pts[0].x} ${pts[0].y}`;

	for (let i = 1; i < pts.length; i++) {
		const prev = pts[i - 1];
		const curr = pts[i];

		const midX = (prev.x + curr.x) / 2;

		d += ` Q ${prev.x} ${prev.y} ${midX} ${(prev.y + curr.y) / 2}`;
	}

	d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;

	return d;
};

type Point = {
	x: number;
	y: number;
};

const getLinePath = (points: Point[], smoothStroke: boolean = true) => {
	if (smoothStroke) {
		return buildSmoothPath(points);
	} else {
		return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
	}
};

type AreaDeps = {
	width: number;
	height: number;
	smoothStroke: boolean;
};

const getAreaPath = (points: Point[], deps: AreaDeps) => {
	const { width, height, smoothStroke } = deps;
	if (smoothStroke) {
		const linePath = buildSmoothPath(points);
		const areaPath = `
			${linePath}
			L ${points[points.length - 1].x} ${height}
			L ${points[0].x} ${height}
			Z
		`;
		return areaPath;
	} else {
		const areaPath = `
    	M 0 ${height}
    	L ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}
    	L ${width} ${height}
    	Z
  	`;
		return areaPath;
	}
};

const AreaChart = ({
	data,
	fill = "rgba(59,130,246,0.25)",
	stroke = "rgb(59,130,246)",
	width = 300,
	height = 120,
	heightRatio = 0.4,
	smoothStroke = true,
}: Props) => {
	const [showArea, setShowArea] = useState(false);
	const lineRef = useRef<SVGPathElement>(null);

	const max = Math.max(...data);
	const WIDTH = width;
	const HEIGHT = WIDTH * heightRatio;

	const points: Point[] = data.map((d, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - (d / max) * height;
		return { x, y };
	});

	const linePath = getLinePath(points, smoothStroke);

	const areaPath = getAreaPath(points, { width, height, smoothStroke });

	useEffect(() => {
		// Animate area
		requestAnimationFrame(() => setShowArea(true));

		// Animate line
		if (!lineRef.current) return;

		const length = lineRef.current.getTotalLength();

		lineRef.current.style.strokeDasharray = `${length}`;
		lineRef.current.style.strokeDashoffset = `${length}`;

		// Force reflow
		lineRef.current.getBoundingClientRect();

		lineRef.current.style.transition = "stroke-dashoffset 700ms ease-out 150ms";
		lineRef.current.style.strokeDashoffset = "0";
	}, [data]);

	if (!data.length) return null;
	return (
		<svg
			viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			style={{ width: "100%", height: "100%", display: "block" }}
		>
			{/* Area */}
			<path
				d={areaPath}
				fill={fill}
				style={{
					transformOrigin: "bottom",
					transform: showArea ? "scaleY(1)" : "scaleY(0)",
					transition: "transform 600ms ease-out 300ms",
				}}
			/>

			{/* Line */}
			<path
				ref={lineRef}
				d={linePath}
				fill="none"
				stroke={stroke}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default AreaChart;
