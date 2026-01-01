import React from "react";

type Props = {
	children: React.ReactNode;
	color?: string;
	strokeWidth?: number;
	radius?: number;
	duration?: number;
	glow?: boolean;
	className?: string;
};

export const AnimatedBorderCard: React.FC<Props> = ({
	children,
	color = "#22c55e",
	strokeWidth = 2,
	radius = 12,
	duration = 800,
	glow = false,
	className = "",
}) => {
	return (
		<div
			className={`animated-border-card ${className}`}
			style={{ borderRadius: radius }}
		>
			<svg
				className="animated-border-svg"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<rect
					x="1"
					y="1"
					width="98"
					height="98"
					rx={radius}
					ry={radius}
					style={{
						stroke: color,
						strokeWidth,
						animationDuration: `${duration}ms`,
						filter: glow ? `drop-shadow(0 0 6px ${color})` : undefined,
					}}
				/>
			</svg>

			<div className="animated-border-content">{children}</div>
		</div>
	);
};
