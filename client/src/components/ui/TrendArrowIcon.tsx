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
}

const TrendArrowIcon = ({
	size = 24,
	strokeWidth = 2,
	gradient = "purple",
	colors,
	className,
	title,
}: TrendArrowIconProps) => {
	const gradientId = `trend-arrow-${useId()}`;
	const stops = colors && colors.length > 1 ? colors : gradients[gradient];

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
			<defs>
				{/* Diagonal along the arrow's direction of travel */}
				<linearGradient
					id={gradientId}
					gradientUnits="userSpaceOnUse"
					x1="2"
					y1="18"
					x2="22"
					y2="6"
				>
					{stops.map((color, i) => (
						<stop
							key={i}
							offset={`${(i / (stops.length - 1)) * 100}%`}
							stopColor={color}
						/>
					))}
				</linearGradient>
			</defs>
			<g
				stroke={`url(#${gradientId})`}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="2 18 9 11 13 15 22 6" />
				<polyline points="16 6 22 6 22 12" />
			</g>
		</svg>
	);
};

export default TrendArrowIcon;
