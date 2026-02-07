import { useEffect, useRef } from "react";

interface Dataset {
	data: number[];
	fill?: string;
	stroke?: string;
	opacity?: number;
}

interface Props {
	datasets: Dataset[];
	width?: number;
	height?: number;
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

const LayeredAreaChart = ({ datasets, width = 300, height = 120 }: Props) => {
	const areaRefs = useRef<SVGPathElement[]>([]);

	// global min/max so all layers share scale
	const allValues = datasets.flatMap((d) => d.data);
	const max = Math.max(...allValues);
	const min = Math.min(...allValues);
	const range = max - min || 1;

	const buildPoints = (data: number[]) =>
		data.map((d, i) => ({
			x: (i / (data.length - 1)) * width,
			y: height - ((d - min) / range) * height,
		}));

	useEffect(() => {
		areaRefs.current.forEach((path) => {
			if (!path) return;

			path.style.transformOrigin = "bottom";
			path.style.transform = "scaleY(0)";
			path.getBoundingClientRect();
			path.style.transition = "transform 700ms ease-out";
			path.style.transform = "scaleY(1)";
		});
	}, [datasets]);

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			style={{ display: "block" }}
		>
			{datasets.slice(0, 4).map((set, idx) => {
				const points = buildPoints(set.data);
				const linePath = buildSmoothPath(points);

				const areaPath = `
          ${linePath}
          L ${points[points.length - 1].x} ${height}
          L ${points[0].x} ${height}
          Z
        `;

				return (
					<g key={idx}>
						{/* Area */}
						<path
							ref={(el) => {
								if (el) areaRefs.current[idx] = el;
							}}
							d={areaPath}
							fill={set.fill ?? "rgba(59,130,246,0.3)"}
							opacity={set.opacity ?? 0.6}
						/>

						{/* Stroke */}
						<path
							d={linePath}
							fill="none"
							stroke={set.stroke ?? "#3b82f6"}
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</g>
				);
			})}
		</svg>
	);
};

export default LayeredAreaChart;
