import { FLAME_GRADIENTS, type FlameColorKey } from "../../utils/utils_flame";
import { IconSize } from "../../utils/utils_icons";

type FlameGlow = "none" | "soft" | "neon";

type Props = {
	variant?: FlameColorKey;
	size?: IconSize;
	glow?: FlameGlow;
};

const getSize = (size: IconSize) => {
	const sizes: Record<IconSize, string> = {
		XSM: "1.8rem",
		SM: "3rem",
		MD: "6.5rem",
		LG: "8rem",
		XLG: "15rem",
		XXLG: "25rem",
	};
	return sizes?.[size] ?? sizes.MD;
};

const FlameIcon = ({ variant = "fire", size = "MD", glow = "none" }: Props) => {
	const iconSize = getSize(size);
	const gradients = FLAME_GRADIENTS[variant];

	// Unique IDs (important when multiple icons are rendered)
	const outerId = `outerFlame-${variant}`;
	const innerId = `innerFlame-${variant}`;
	const glowId = `flameGlow-${variant}-${glow}`;

	const glowFilter = glow === "none" ? undefined : `url(#${glowId})`;

	return (
		<svg
			width={iconSize}
			height={iconSize}
			viewBox="-5 -10 110 135"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
		>
			<defs>
				{/* Outer flame gradient */}
				<linearGradient id={outerId} x1="0" y1="0" x2="0" y2="1">
					{gradients.outer.map((stop) => (
						<stop
							key={stop.offset}
							offset={stop.offset}
							stopColor={stop.color}
						/>
					))}
				</linearGradient>

				{/* Inner flame gradient */}
				<linearGradient id={innerId} x1="0" y1="0" x2="0" y2="1">
					{gradients.inner.map((stop) => (
						<stop
							key={stop.offset}
							offset={stop.offset}
							stopColor={stop.color}
						/>
					))}
				</linearGradient>

				{/* Glow filters */}
				{glow !== "none" && (
					<filter id={glowId} x="-75%" y="-75%" width="250%" height="250%">
						<feGaussianBlur
							in="SourceGraphic"
							stdDeviation={glow === "neon" ? 6 : 3}
							result="blur"
						/>

						{glow === "neon" && (
							<feColorMatrix
								in="blur"
								type="matrix"
								values="
									2 0 0 0 0
									0 2 0 0 0
									0 0 2 0 0
									0 0 0 1 0
								"
								result="glow"
							/>
						)}

						<feMerge>
							<feMergeNode in={glow === "neon" ? "glow" : "blur"} />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				)}
			</defs>

			{/* Outer flame (glow applied here) */}
			<path
				d="M48.586 5.7578c0.10156-1.918 2.3242-3.0312 3.9375-1.8164 1.6172 1.2109 1.6172 1.2109 2.3242 1.8164 6.4648 5.3555 10.605 12.121 11.617 20.605 0.60547 5.5547 0 10.91-1.918 16.16-1.5156 4.2422 0.20312 8.5859 4.1406 10.305 2.8281 1.2109 5.5547 0.80859 7.9805-1.0117 0.91016-0.70703 1.5156-2.0195 2.0195-3.332s2.9297-1.8164 3.7383-0.20312c2.8281 5.7578 4.5469 11.816 4.5469 18.383 0 11.211-5.0508 19.797-13.84 26.465-2.5234 1.918-5.2539 3.332-8.2812 4.4453 4.3438-4.0391 6.3633-8.7891 5.4531-14.645-0.40234-2.9297-1.6172-5.3555-3.2305-7.5742-1.6172-2.2227-3.5352-1.3125-4.3438 0.50391-1.918 3.9375-7.0703 4.7461-10.305 1.8164-4.8477-4.4453-6.3633-10.102-5.8594-16.465 0.30469-3.0312 1.8164-7.5742 3.2305-11.312 1.4141-3.7383-1.6172-3.4336-3.1328-2.0195-8.082 7.6758-20.504 24.141-10.809 43.938 1.2109 2.5234 3.0312 4.7461 5.1523 6.668-0.80859-0.30469-1.5156-0.50391-2.3242-0.80859-7.6758-2.9297-14.039-7.5742-18.281-14.746-3.5352-5.9609-4.3438-12.426-3.6367-19.191 1.3125-11.617 6.5664-21.211 14.645-29.496 5.4531-5.5547 10.203-11.617 13.84-18.484 1.6172-3.1328 2.9297-6.3633 3.2305-9.8984z"
				fill={`url(#${outerId})`}
				filter={glowFilter}
			/>

			{/* Inner flame (kept sharp) */}
			<path
				d="M48 15c-5 6-5 12-3 18 2 6 6 4 8 0s3-12 0-18c-2-4-5-4-5-0z"
				fill={`url(#${innerId})`}
			/>
		</svg>
	);
};

export default FlameIcon;
