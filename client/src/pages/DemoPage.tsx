import AchievementBadge from "../components/achievements/AchievementBadge";
import AchievementMedal from "../components/achievements/AchievementMedal";
import AchievementStreak from "../components/achievements/AchievementStreak";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import StreakBadge from "../components/streaks/StreakBadge";
import StreakMedal, { FireStreak } from "../components/streaks/StreakMedal";
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

const Item = () => {
	return (
		<svg class="svg-container">
			<defs>
				<filter
					id="turbulent-displace"
					colorInterpolationFilters="sRGB"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
				>
					<feTurbulence
						type="turbulence"
						baseFrequency="0.02"
						numOctaves="10"
						result="noise1"
						seed="1"
					/>
					<feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
						<animate
							attributeName="dy"
							values="700; 0"
							dur="6s"
							repeatCount="indefinite"
							calcMode="linear"
						/>
					</feOffset>

					<feTurbulence
						type="turbulence"
						baseFrequency="0.02"
						numOctaves="10"
						result="noise2"
						seed="1"
					/>
					<feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
						<animate
							attributeName="dy"
							values="0; -700"
							dur="6s"
							repeatCount="indefinite"
							calcMode="linear"
						/>
					</feOffset>

					<feTurbulence
						type="turbulence"
						baseFrequency="0.02"
						numOctaves="10"
						result="noise1"
						seed="2"
					/>
					<feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
						<animate
							attributeName="dx"
							values="490; 0"
							dur="6s"
							repeatCount="indefinite"
							calcMode="linear"
						/>
					</feOffset>

					<feTurbulence
						type="turbulence"
						baseFrequency="0.02"
						numOctaves="10"
						result="noise2"
						seed="2"
					/>
					<feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
						<animate
							attributeName="dx"
							values="0; -490"
							dur="6s"
							repeatCount="indefinite"
							calcMode="linear"
						/>
					</feOffset>

					<feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
					<feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
					<feBlend
						in="part1"
						in2="part2"
						mode="color-dodge"
						result="combinedNoise"
					/>

					<feDisplacementMap
						in="SourceGraphic"
						in2="combinedNoise"
						scale="30"
						xChannelSelector="R"
						yChannelSelector="B"
					/>
				</filter>
			</defs>
		</svg>
	);
};

const DemoPage = () => {
	return (
		<PageContainer>
			<PageHeader title="Demo Page" />
			<div className={styles.DemoPage}>
				{/* <StreakMedal streak={30} label="Day Streak" /> */}
				<StreakBadge streak={30} label="Weeks Streak" color="purple" />
				<StreakBadge streak={30} label="Weeks Streak" color="fire" />
				<Item />
			</div>
		</PageContainer>
	);
};

export default DemoPage;
