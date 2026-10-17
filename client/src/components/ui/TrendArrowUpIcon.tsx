import { useId } from "react";

// Stops run from the arrow's tail (bottom-left) to its head (top-right)
const gradients = {
	// Purple
	purple: ["#4c1d95", "#7c3aed", "#c084fc"],
	amethyst: ["#6d28d9", "#a855f7", "#f0abfc"],
	// Blue
	blue: ["#1e3a8a", "#2563eb", "#60a5fa"],
	ocean: ["#0369a1", "#0ea5e9", "#67e8f9"],
	// Fire-red
	fire: ["#991b1b", "#ef4444", "#fb923c"],
	ember: ["#dc2626", "#f97316", "#facc15"],
	// Green
	green: ["#14532d", "#16a34a", "#4ade80"],
	lime: ["#059669", "#22c55e", "#bef264"],
	// Pink
	pink: ["#9d174d", "#ec4899", "#f9a8d4"],
	sunset: ["#db2777", "#f472b6", "#fdba74"],
} as const;

export type TrendArrowGradient = keyof typeof gradients;

interface TrendArrowIconProps {
	size?: number;
	strokeWidth?: number;
	gradient?: TrendArrowGradient;
	colors?: string[]; // custom stops; overrides `gradient`
	className?: string;
	title?: string;
	draw?: boolean; // draw the arrow in from tail to head on mount
	drawDuration?: number; // ms
	drawDelay?: number; // ms
	flow?: boolean; // continuously move the gradient up the arrow
	flowDuration?: number; // seconds per loop
}

// Line gets most of the draw time, then the head finishes it off
const LINE_SHARE = 0.7;

const TrendArrowUpIcon = ({
	size = 24,
	strokeWidth = 2,
	gradient = "purple",
	colors,
	className,
	title,
	draw = true,
	drawDuration = 900,
	drawDelay = 0,
	flow = true,
	flowDuration = 3,
}: TrendArrowIconProps) => {
	const gradientId = `trend-arrow-${useId()}`;
	const stops = colors && colors.length > 1 ? colors : gradients[gradient];

	const prefersReducedMotion = window.matchMedia?.(
		"(prefers-reduced-motion: reduce)",
	)?.matches;
	const shouldDraw = draw && !prefersReducedMotion;
	const shouldFlow = flow && !prefersReducedMotion;

	const lineDuration = drawDuration * LINE_SHARE;
	const headDuration = drawDuration - lineDuration;

	const drawStyle = (duration: number, delay: number) =>
		shouldDraw
			? {
					strokeDasharray: 1,
					strokeDashoffset: 1,
					animation: `trend-arrow-draw ${duration}ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms both`,
				}
			: undefined;

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
		>
			{title && <title>{title}</title>}
			{shouldDraw && (
				<style>{`@keyframes trend-arrow-draw { to { stroke-dashoffset: 0; } }`}</style>
			)}
			<defs>
				{/* Diagonal along the arrow's direction of travel */}
				<linearGradient
					id={gradientId}
					gradientUnits="userSpaceOnUse"
					x1="2"
					y1="18"
					x2="22"
					y2="6"
					spreadMethod="reflect"
				>
					{stops.map((color, i) => (
						<stop
							key={i}
							offset={`${(i / (stops.length - 1)) * 100}%`}
							stopColor={color}
						/>
					))}
					{/* Shift two gradient lengths (one full reflect cycle) for a seamless loop */}
					{shouldFlow && (
						<animateTransform
							attributeName="gradientTransform"
							type="translate"
							from="0 0"
							to="40 -24"
							dur={`${flowDuration}s`}
							repeatCount="indefinite"
						/>
					)}
				</linearGradient>
			</defs>
			<g
				stroke={`url(#${gradientId})`}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path
					d="M2 18 L9 11 L13 15 L22 6"
					pathLength={1}
					style={drawStyle(lineDuration, drawDelay)}
				/>
				<path
					d="M16 6 H22 V12"
					pathLength={1}
					style={drawStyle(headDuration, drawDelay + lineDuration)}
				/>
			</g>
		</svg>
	);
};

export default TrendArrowUpIcon;
