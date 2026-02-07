import { ReactNode } from "react";
import ProgressArc from "./ProgressArc";

type Props = {
	progress: number;
	size?: number;
	stroke?: string;
	strokeWidth?: number;
	children?: ReactNode;
};

const ProgressContent = ({
	progress = 0,
	size = 160,
	strokeWidth = 14,
	stroke = "#3b82f6",
	children,
}: Props) => {
	return (
		<div
			style={{
				position: "relative",
				width: size,
				height: size,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<ProgressArc
				progress={progress}
				size={size}
				stroke={stroke}
				strokeWidth={strokeWidth}
			/>
			{/* Center content */}
			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "none",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default ProgressContent;
