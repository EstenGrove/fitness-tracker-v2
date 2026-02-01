interface Props {
	data: (number | null)[];
	columns?: number;
	size?: number;
	gap?: number;
	noDataColor?: string;
	colors?: string[];
}

const intensities = {
	blue: [
		"#dbeafe",
		"#bfdbfe",
		"#93c5fd",
		"#60a5fa",
		"#3b82f6",
		"#2563eb",
		"#1e40af",
	],
	green: [
		"#ecfdf5",
		"#d1fae5",
		"#a7f3d0",
		"#6ee7b7",
		"#34d399",
		"#10b981",
		"#059669",
		"#047857",
	],
	red: [
		"#fef2f2",
		"#fee2e2",
		"#fecaca",
		"#fca5a5",
		"#f87171",
		"#ef4444",
		"#dc2626",
		"#991b1b",
	],
	grey: ["#f1f5f9", "#e5e7eb", "#9ca3af", "#ffffff", "#000000"],
};

const colorRamps = {
	Purple: [
		"#f3ecff",
		"#e0d4ff",
		"#c9b7ff",
		"#b39aff",
		"#9d7eff",
		"#8743ff",
		"rgb(105,25,255)",
	],
	Red: [
		"#ffe5e6",
		"#ffb8ba",
		"#ff8a8e",
		"#ff5d62",
		"#ff3b3f",
		"#ff1a25",
		"#ff333d",
	],
	Green: [
		"#e6fff8",
		"#b8fff0",
		"#8affe6",
		"#5dffe0",
		"#33ffda",
		"#1affd4",
		"#00e2bd",
	],
	Blue: [
		"#e6f2ff",
		"#b8d9ff",
		"#8abfff",
		"#5d99ff",
		"#3377ff",
		"#1a5dff",
		"#007cff",
	],
	BrightRed: [
		"#ffe6f0",
		"#ffb8d1",
		"#ff8ab2",
		"#ff5c93",
		"#ff2e74",
		"#ff1160",
		"#ff005b",
	],
};

const HeatMap = ({
	data,
	columns = 7,
	size = 16,
	gap = 4,
	noDataColor = "#000",
	colors = colorRamps.Purple,
}: Props) => {
	const values = data.filter((v): v is number => v !== null);

	const max = Math.max(...values, 0);
	const min = Math.min(...values, 0);
	const range = max - min || 1;

	const getColor = (value: number | null) => {
		if (value === null || value === 0) return noDataColor;

		const normalized = (value - min) / range;

		const idx = Math.min(
			colors.length - 1,
			Math.floor(normalized * colors.length)
		);

		return colors[idx];
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${columns}, ${size}px)`,
				gap,
			}}
		>
			{data.map((value, i) => (
				<div
					key={i}
					style={{
						width: size,
						height: size,
						borderRadius: 4,
						backgroundColor: getColor(value),
						transition: "background-color 300ms ease",
					}}
				/>
			))}
		</div>
	);
};

export default HeatMap;
