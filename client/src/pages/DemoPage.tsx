import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/DemoPage.module.scss";

import { useState } from "react";

type Region = "leftArm" | "rightArm" | "chest" | "abs" | "leftLeg" | "rightLeg";

const BodyMap = () => {
	const [selected, setSelected] = useState<Region[]>([]);

	const toggleRegion = (region: Region) => {
		setSelected((prev) =>
			prev.includes(region)
				? prev.filter((r) => r !== region)
				: [...prev, region]
		);
	};

	const isSelected = (region: Region) => selected.includes(region);

	return (
		<svg viewBox="0 0 300 600" width="250" style={{ cursor: "pointer" }}>
			{/* Left Arm */}
			<path
				d="M50 150 L80 150 L80 300 L50 300 Z"
				fill={isSelected("leftArm") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("leftArm")}
			/>

			{/* Right Arm */}
			<path
				d="M220 150 L250 150 L250 300 L220 300 Z"
				fill={isSelected("rightArm") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("rightArm")}
			/>

			{/* Chest */}
			<rect
				x="100"
				y="150"
				width="100"
				height="80"
				fill={isSelected("chest") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("chest")}
			/>

			{/* Abs */}
			<rect
				x="110"
				y="235"
				width="80"
				height="100"
				fill={isSelected("abs") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("abs")}
			/>

			{/* Left Leg */}
			<rect
				x="120"
				y="340"
				width="30"
				height="200"
				fill={isSelected("leftLeg") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("leftLeg")}
			/>

			{/* Right Leg */}
			<rect
				x="160"
				y="340"
				width="30"
				height="200"
				fill={isSelected("rightLeg") ? "#f77" : "#ddd"}
				onClick={() => toggleRegion("rightLeg")}
			/>
		</svg>
	);
};

const DemoPage = () => {
	return (
		<PageContainer>
			<PageHeader title="Demo Page" />
			<div className={styles.DemoPage}>
				<BodyMap />
			</div>
		</PageContainer>
	);
};

export default DemoPage;
