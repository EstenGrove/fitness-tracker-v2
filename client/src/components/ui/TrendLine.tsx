import { useEffect, useRef } from "react";

interface Props {
	data: number[];
	stroke?: string;
	width?: number; // virtual width
	height?: number; // virtual height
	strokeWidth?: number;
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

const TrendLine = ({
	data,
	stroke = "rgb(59,130,246)",
	width = 300,
	height = 120,
	strokeWidth = 1.5,
	smoothStroke = true,
}: Props) => {
	const lineRef = useRef<SVGPathElement>(null);

	const max = Math.max(...data);
	const min = Math.min(...data);
	const range = max - min || 1;

	const points: Point[] = data.map((d, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - ((d - min) / range) * height;
		return { x, y };
	});

	const linePath = getLinePath(points, smoothStroke);

	useEffect(() => {
		if (!lineRef.current) return;

		const length = lineRef.current.getTotalLength();

		lineRef.current.style.strokeDasharray = `${length}`;
		lineRef.current.style.strokeDashoffset = `${length}`;

		// Force layout commit
		lineRef.current.getBoundingClientRect();

		lineRef.current.style.transition = "stroke-dashoffset 700ms ease-out";
		lineRef.current.style.strokeDashoffset = "0";
	}, [data]);

	if (!data.length) return null;

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="none"
			shapeRendering="crispEdges"
			style={{
				width: "100%",
				height: "100%",
				display: "block",
			}}
		>
			<path
				ref={lineRef}
				d={linePath}
				fill="none"
				stroke={stroke}
				strokeWidth={strokeWidth}
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default TrendLine;
