import { CSSProperties } from "react";
import styles from "../css/pages/DemoPage.module.scss";
import AchievementBadge from "../components/achievements/AchievementBadge";
import AchievementMedal from "../components/achievements/AchievementMedal";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import StreakMedal from "../components/streaks/StreakMedal";
import StreakTierMedal from "../components/streaks/StreakTierMedal";
import FlameIcon from "../components/ui/FlameIcon";
import css from "../css/pages/DemoPage.module.scss";
import LayeredCircles from "../components/ui/LayeredCircles";
import AnimatedCircles from "../components/ui/AnimatedCircles";
import Circle from "../components/ui/Circle";
import DriftingCircle from "../components/ui/DriftingCircle";

const colorVariants = {
	Pink: [
		"rgba(255, 214, 229, 1)", // soft / background
		"rgb(255, 102, 153)", // light
		"rgb(255, 0, 102)", // base
		"rgb(204, 0, 82)", // dark
		"rgb(153, 0, 61)", // deep
	],

	Purple: [
		"rgb(229, 221, 252)",
		"rgb(167, 139, 250)",
		"rgb(124, 58, 237)",
		"rgb(96, 44, 180)",
		"rgb(68, 32, 128)",
	],

	Blue: [
		"rgb(219, 234, 254)",
		"rgb(96, 165, 250)",
		"rgb(0, 124, 255)",
		"rgb(0, 95, 196)",
		"rgb(0, 67, 138)",
	],

	Red: [
		"rgb(254, 226, 226)",
		"rgb(252, 165, 165)",
		"#ff333d",
		"rgb(220, 38, 38)",
		"rgb(153, 27, 27)",
	],
};

const ringVariants = {
	Blue: "rgba(0, 124, 255, 0.6)",
	Purple: "rgba(124, 58, 237, 0.6)",
	Pink: "rgba(255, 0, 102, 0.6)",
	Red: "rgba(255, 51, 61, 0.6)",
};

const translucentColorVariants = {
	Pink: [
		"rgba(255, 0, 102, 0.08)",
		"rgba(255, 0, 102, 0.16)",
		"rgba(255, 0, 102, 0.24)",
	],

	Purple: [
		"rgba(124, 58, 237, 0.08)",
		"rgba(124, 58, 237, 0.16)",
		"rgba(124, 58, 237, 0.24)",
	],

	Blue: [
		"rgba(0, 124, 255, 0.08)",
		"rgba(0, 124, 255, 0.16)",
		"rgba(0, 124, 255, 0.24)",
	],

	Red: [
		"rgba(255, 51, 61, 0.08)",
		"rgba(255, 51, 61, 0.16)",
		"rgba(255, 51, 61, 0.24)",
	],
};

const newColors = {
	Purple: [
		"rgb(229, 221, 252)",
		"rgb(167, 139, 250)",
		"rgb(124, 58, 237)",
		"rgb(96, 44, 180)",
		"rgb(68, 32, 128)",
	],

	Pink: [
		"rgb(255, 214, 229)",
		"rgb(255, 102, 153)",
		"rgb(255, 0, 102)",
		"rgb(204, 0, 82)",
		"rgb(153, 0, 61)",
	],

	Blue: [
		"rgb(219, 234, 254)",
		"rgb(96, 165, 250)",
		"#007cff",
		"rgb(0, 95, 196)",
		"rgb(0, 67, 138)",
	],

	Green: [
		"rgb(204, 250, 241)",
		"rgb(94, 234, 212)",
		"#00e2bd",
		"rgb(0, 178, 148)",
		"rgb(0, 122, 101)",
	],

	Red: [
		"rgb(254, 226, 226)",
		"rgb(252, 165, 165)",
		"#ff333d",
		"rgb(220, 38, 38)",
		"rgb(153, 27, 27)",
	],

	Yellow: [
		"rgb(254, 249, 195)",
		"rgb(253, 224, 71)",
		"#f9f871",
		"rgb(202, 138, 4)",
		"rgb(133, 77, 14)",
	],

	Orange: [
		"rgb(255, 237, 213)",
		"rgb(253, 186, 116)",
		"#ff7700",
		"rgb(234, 88, 12)",
		"rgb(154, 52, 18)",
	],

	/* ───────────────
     NEW UNIQUE COLORS
     ─────────────── */

	Teal: [
		"rgb(204, 251, 241)",
		"rgb(94, 234, 212)",
		"rgb(20, 184, 166)",
		"rgb(13, 148, 136)",
		"rgb(15, 118, 110)",
	],

	Cyan: [
		"rgb(207, 250, 254)",
		"rgb(103, 232, 249)",
		"rgb(6, 182, 212)",
		"rgb(8, 145, 178)",
		"rgb(14, 116, 144)",
	],

	Indigo: [
		"rgb(224, 231, 255)",
		"rgb(165, 180, 252)",
		"rgb(99, 102, 241)",
		"rgb(67, 56, 202)",
		"rgb(49, 46, 129)",
	],

	Lime: [
		"rgb(236, 252, 203)",
		"rgb(190, 242, 100)",
		"rgb(132, 204, 22)",
		"rgb(77, 124, 15)",
		"rgb(54, 83, 20)",
	],

	Coral: [
		"rgb(255, 228, 220)",
		"rgb(255, 159, 140)",
		"rgb(255, 99, 71)",
		"rgb(220, 68, 50)",
		"rgb(160, 45, 35)",
	],

	Slate: [
		"rgb(241, 245, 249)",
		"rgb(148, 163, 184)",
		"rgb(100, 116, 139)",
		"rgb(51, 65, 85)",
		"rgb(30, 41, 59)",
	],
};

const DemoPage = () => {
	// const testColor = colorVariants["Blue"][2];
	// const testColor = translucentColorVariants["Red"][2];
	const primary = ringVariants.Red;
	const secondary = ringVariants.Blue;
	const tertiary = ringVariants.Purple;

	const set1 = [
		newColors.Blue[4],
		newColors.Cyan[4],
		newColors.Slate[4],
		newColors.Indigo[4],
	];

	return (
		<PageContainer>
			<PageHeader title="Demo Page" />
			<div className={css.DemoPage}>
				<div className={css.DemoPage_circles}>
					{/* <LayeredCircles
						size={75}
						// colors={[primary, secondary, tertiary]}
						colors={set1}
						overlap={0.6}
						opacity={0.3}
						ringOpacity={0.1}
					/> */}
					{/* <Circle
						size={350}
						color={set1[2]}
						ringOpacity={0.5}
						classes={[styles.driftAcross]}
						styles={{ opacity: 0.3 }}
					/> */}

					<DriftingCircle
						y={0}
						duration={3}
						delay={0}
						size={350}
						color={set1[1]}
						styles={{ opacity: 0.3 }}
					/>
				</div>
				<div className={css.DemoPage_circles}>
					{/* <Circle
						size={75}
						color={set1[0]}
						ringOpacity={0.1}
						classes={[styles.drift]}
					/> */}
					{/* <Circle
						size={350}
						color={set1[1]}
						ringOpacity={0.5}
						classes={[styles.driftAcross]}
						styles={{ opacity: 0.3 }}
					/> */}
					{/* <div
						className={`${styles.item} ${styles.drift}`}
						style={{
							width: "20rem",
							height: "20rem",
							borderRadius: "50%",
							backgroundColor: newColors.Blue[4],
						}}
					></div> */}
					{/* <AnimatedCircles
						size={75}
						// colors={[primary, secondary, tertiary]}
						colors={set1}
						overlap={0.6}
					/> */}
				</div>
				<div>
					<FlameIcon variant="blue" glow="neon" />
					<FlameIcon variant="green" />
					<FlameIcon variant="pink" glow="neon" />
					<FlameIcon variant="fire" />
					<FlameIcon variant="gold" />
					<FlameIcon variant="grey" />
					<FlameIcon variant="purple" />
					<FlameIcon variant="obsidian" />
					<FlameIcon variant="amber" />
					<FlameIcon variant="crimson" />
				</div>
				<div>
					<FlameIcon variant="blueNeon" />
					<FlameIcon variant="greenNeon" />
					<FlameIcon variant="pinkNeon" />
					<FlameIcon variant="fire" />
					<FlameIcon variant="goldNeon" />
					<FlameIcon variant="greyNeon" />
					<FlameIcon variant="purpleNeon" />
					<FlameIcon variant="crimsonNeon" />
					<FlameIcon variant="prismatic" />
				</div>

				{/* <StreakMedal streak={30} label="Day Streak" /> */}
				<StreakMedal streak={67} label="Weeks Streak" color="blue" />
				<StreakMedal
					streak={67}
					label="Weeks Streak"
					color="fire"
					variant="ascended"
				/>
				<StreakTierMedal streak={365} />
				{/* <Item /> */}
			</div>
		</PageContainer>
	);
};

export default DemoPage;
