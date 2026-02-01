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
import AreaChart from "../components/ui/AreaChart";
import TrendLine from "../components/ui/TrendLine";
import HeatMap from "../components/ui/HeatMap";
import ProgressRing from "../components/ui/ProgressRing";
import ProgressCircle from "../components/ui/ProgressCircle";
import ProgressArc from "../components/ui/ProgressArc";
import ProgressContent from "../components/ui/ProgressContent";
import TrendItem from "../components/recaps-shared/TrendItem";
import LayeredAreaChart from "../components/ui/LayeredAreaChart";

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

const strengthData = [
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 13,
		maxVolume: 1600,
		totalMins: 24,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-03-19",
		totalCalories: 77.156062137,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 12,
		maxVolume: 1600,
		totalMins: 30,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-03-20",
		totalCalories: 96.44507767125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 11,
		maxVolume: 1600,
		totalMins: 26,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-03-22",
		totalCalories: 117.02002757445,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 9,
		maxVolume: 1600,
		totalMins: 30,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-03-27",
		totalCalories: 173.60113980825,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 8,
		maxVolume: 1600,
		totalMins: 18,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-03-29",
		totalCalories: 104.16068388495,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 4,
		maxVolume: 1740,
		totalMins: 20,
		totalReps: 87,
		totalSets: 4,
		totalVolume: 1740,
		workoutDate: "2025-04-17",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 5,
		maxVolume: 1600,
		totalMins: 18,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-04-19",
		totalCalories: 81.01386524385,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 6,
		maxVolume: 1840,
		totalMins: 20,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-04-22",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 7,
		maxVolume: 1840,
		totalMins: 25,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-04-24",
		totalCalories: 160.74179611875,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 14,
		maxVolume: 1700,
		totalMins: 30,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-04-26",
		totalCalories: 135.02310873975,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 15,
		maxVolume: 1840,
		totalMins: 30,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-04-29",
		totalCalories: 173.60113980825,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 16,
		maxVolume: 1920,
		totalMins: 28,
		totalReps: 96,
		totalSets: 4,
		totalVolume: 1920,
		workoutDate: "2025-05-01",
		totalCalories: 162.0277304877,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 20,
		maxVolume: 1840,
		totalMins: 25,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-05-06",
		totalCalories: 144.667616506875,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 25,
		maxVolume: 960,
		totalMins: 15,
		totalReps: 48,
		totalSets: 2,
		totalVolume: 960,
		workoutDate: "2025-05-10",
		totalCalories: 48.222538835625,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 28,
		maxVolume: 1660,
		totalMins: 20,
		totalReps: 83,
		totalSets: 4,
		totalVolume: 1660,
		workoutDate: "2025-05-13",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 34.6666666666666666666,
		maxReps: 22,
		historyID: 29,
		maxVolume: 1600,
		totalMins: 15,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-05-15",
		totalCalories: 86.800569904125,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 30,
		maxVolume: 900,
		totalMins: 7,
		totalReps: 45,
		totalSets: 2,
		totalVolume: 900,
		workoutDate: "2025-05-17",
		totalCalories: 22.503851456625,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 33,
		maxVolume: 1840,
		totalMins: 27,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-05-20",
		totalCalories: 156.241025827425,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 34,
		maxVolume: 1700,
		totalMins: 20,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-05-22",
		totalCalories: 90.0154058265,
	},
	{
		est1RM: null,
		maxReps: 25,
		historyID: 40,
		maxVolume: 0,
		totalMins: 18,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 0,
		workoutDate: "2025-05-27",
		totalCalories: 104.16068388495,
	},
	{
		est1RM: 40.0,
		maxReps: 30,
		historyID: 43,
		maxVolume: 1840,
		totalMins: 14,
		totalReps: 92,
		totalSets: 4,
		totalVolume: 1840,
		workoutDate: "2025-05-29",
		totalCalories: 81.01386524385,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 45,
		maxVolume: 1600,
		totalMins: 18,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-06-03",
		totalCalories: 115.7340932055,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 50,
		maxVolume: 1500,
		totalMins: 11,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-06-10",
		totalCalories: 63.653751263025,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 52,
		maxVolume: 1700,
		totalMins: 16,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-06-12",
		totalCalories: 72.0123246612,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 53,
		maxVolume: 1500,
		totalMins: 16,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-06-15",
		totalCalories: 72.0123246612,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 54,
		maxVolume: 1600,
		totalMins: 15,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-06-17",
		totalCalories: 86.800569904125,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 56,
		maxVolume: 1700,
		totalMins: 24,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-06-19",
		totalCalories: 154.312124274,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 57,
		maxVolume: 1600,
		totalMins: 17,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-06-23",
		totalCalories: 98.373979224675,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 58,
		maxVolume: 1440,
		totalMins: 16,
		totalReps: 72,
		totalSets: 4,
		totalVolume: 1440,
		workoutDate: "2025-06-30",
		totalCalories: 72.0123246612,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 59,
		maxVolume: 1500,
		totalMins: 15,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-07-03",
		totalCalories: 67.511554369875,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 61,
		maxVolume: 1440,
		totalMins: 22,
		totalReps: 72,
		totalSets: 4,
		totalVolume: 1440,
		workoutDate: "2025-07-08",
		totalCalories: 99.01694640915,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 62,
		maxVolume: 1600,
		totalMins: 17,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-07-10",
		totalCalories: 76.513094952525,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 63,
		maxVolume: 1440,
		totalMins: 13,
		totalReps: 72,
		totalSets: 4,
		totalVolume: 1440,
		workoutDate: "2025-07-15",
		totalCalories: 75.227160583575,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 64,
		maxVolume: 1540,
		totalMins: 15,
		totalReps: 77,
		totalSets: 4,
		totalVolume: 1540,
		workoutDate: "2025-07-18",
		totalCalories: 67.511554369875,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 65,
		maxVolume: 1640,
		totalMins: 28,
		totalReps: 82,
		totalSets: 4,
		totalVolume: 1640,
		workoutDate: "2025-07-19",
		totalCalories: 162.0277304877,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 66,
		maxVolume: 800,
		totalMins: 5,
		totalReps: 40,
		totalSets: 2,
		totalVolume: 800,
		workoutDate: "2025-07-20",
		totalCalories: 32.14835922375,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 69,
		maxVolume: 1500,
		totalMins: 18,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-07-25",
		totalCalories: 115.7340932055,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 71,
		maxVolume: 1800,
		totalMins: 17,
		totalReps: 90,
		totalSets: 5,
		totalVolume: 1800,
		workoutDate: "2025-08-02",
		totalCalories: 98.373979224675,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 72,
		maxVolume: 1700,
		totalMins: 18,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-08-05",
		totalCalories: 104.16068388495,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 73,
		maxVolume: 1700,
		totalMins: 17,
		totalReps: 85,
		totalSets: 5,
		totalVolume: 1700,
		workoutDate: "2025-08-07",
		totalCalories: 76.513094952525,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 74,
		maxVolume: 1300,
		totalMins: 19,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-08-12",
		totalCalories: 85.514635535175,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 77,
		maxVolume: 1300,
		totalMins: 16,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-08-16",
		totalCalories: 72.0123246612,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 79,
		maxVolume: 1400,
		totalMins: 14,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-08-19",
		totalCalories: 63.01078407855,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 80,
		maxVolume: 1400,
		totalMins: 16,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-08-21",
		totalCalories: 92.5872745644,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 83,
		maxVolume: 1300,
		totalMins: 23,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-08-26",
		totalCalories: 103.517716700475,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 85,
		maxVolume: 1400,
		totalMins: 16,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-08-28",
		totalCalories: 72.0123246612,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 87,
		maxVolume: 1400,
		totalMins: 15,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-09-02",
		totalCalories: 86.800569904125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 89,
		maxVolume: 1300,
		totalMins: 16,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-09-04",
		totalCalories: 92.5872745644,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 90,
		maxVolume: 1400,
		totalMins: 18,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-09-11",
		totalCalories: 81.01386524385,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 93,
		maxVolume: 1440,
		totalMins: 17,
		totalReps: 72,
		totalSets: 4,
		totalVolume: 1440,
		workoutDate: "2025-09-16",
		totalCalories: 98.373979224675,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 94,
		maxVolume: 1500,
		totalMins: 15,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-09-23",
		totalCalories: 67.511554369875,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 95,
		maxVolume: 1300,
		totalMins: 20,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-10-01",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 96,
		maxVolume: 1300,
		totalMins: 16,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-10-08",
		totalCalories: 92.5872745644,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 97,
		maxVolume: 1400,
		totalMins: 18,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-10-14",
		totalCalories: 104.16068388495,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 99,
		maxVolume: 1400,
		totalMins: 17,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-10-16",
		totalCalories: 98.373979224675,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 100,
		maxVolume: 1500,
		totalMins: 17,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-10-21",
		totalCalories: 109.30442136075,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 101,
		maxVolume: 1600,
		totalMins: 20,
		totalReps: 80,
		totalSets: 5,
		totalVolume: 1600,
		workoutDate: "2025-10-23",
		totalCalories: 115.7340932055,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 102,
		maxVolume: 1600,
		totalMins: 20,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-10-25",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 103,
		maxVolume: 1500,
		totalMins: 16,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-10-28",
		totalCalories: 92.5872745644,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 104,
		maxVolume: 1320,
		totalMins: 14,
		totalReps: 66,
		totalSets: 4,
		totalVolume: 1320,
		workoutDate: "2025-10-30",
		totalCalories: 63.01078407855,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 106,
		maxVolume: 1400,
		totalMins: 18,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-11-04",
		totalCalories: 115.7340932055,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 108,
		maxVolume: 1500,
		totalMins: 20,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-11-06",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 109,
		maxVolume: 1300,
		totalMins: 15,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-11-08",
		totalCalories: 96.44507767125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 112,
		maxVolume: 1320,
		totalMins: 20,
		totalReps: 66,
		totalSets: 4,
		totalVolume: 1320,
		workoutDate: "2025-11-11",
		totalCalories: 128.593436895,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 113,
		maxVolume: 1300,
		totalMins: 15,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-11-13",
		totalCalories: 96.44507767125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 116,
		maxVolume: 1700,
		totalMins: 17,
		totalReps: 85,
		totalSets: 5,
		totalVolume: 1700,
		workoutDate: "2025-11-18",
		totalCalories: 109.30442136075,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 117,
		maxVolume: 1300,
		totalMins: 19,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-11-20",
		totalCalories: 122.16376505025,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 119,
		maxVolume: 1500,
		totalMins: 17,
		totalReps: 75,
		totalSets: 4,
		totalVolume: 1500,
		workoutDate: "2025-11-25",
		totalCalories: 109.30442136075,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 120,
		maxVolume: 800,
		totalMins: 7,
		totalReps: 40,
		totalSets: 2,
		totalVolume: 800,
		workoutDate: "2025-11-27",
		totalCalories: 40.506932621925,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 121,
		maxVolume: 1900,
		totalMins: 17.84415,
		totalReps: 95,
		totalSets: 5,
		totalVolume: 1900,
		workoutDate: "2025-11-29",
		totalCalories: 114.7320288484957125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 123,
		maxVolume: 1800,
		totalMins: 19.660416666666666,
		totalReps: 90,
		totalSets: 5,
		totalVolume: 1800,
		workoutDate: "2025-12-02",
		totalCalories: 126.4100274977203082135521035,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 124,
		maxVolume: 1300,
		totalMins: 16.31815,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-12-04",
		totalCalories: 94.42831465206649125,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 126,
		maxVolume: 1400,
		totalMins: 21.304583333333333,
		totalReps: 70,
		totalSets: 4,
		totalVolume: 1400,
		workoutDate: "2025-12-09",
		totalCalories: 123.283331660217091821098446575,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 127,
		maxVolume: 1300,
		totalMins: 15.235433333333333,
		totalReps: 65,
		totalSets: 4,
		totalVolume: 1300,
		workoutDate: "2025-12-11",
		totalCalories: 88.162953071309075571098446575,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 130,
		maxVolume: 1600,
		totalMins: 22.03986666666667,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-12-16",
		totalCalories: 141.7091101687107214322394825,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 131,
		maxVolume: 1600,
		totalMins: 16.274083333333333,
		totalReps: 80,
		totalSets: 4,
		totalVolume: 1600,
		workoutDate: "2025-12-18",
		totalCalories: 104.63701540744856035677605175,
	},
	{
		est1RM: 38.6666666666666666666,
		maxReps: 28,
		historyID: 134,
		maxVolume: 1700,
		totalMins: 18.94046666666667,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2025-12-23",
		totalCalories: 109.60288672778331428901553425,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 135,
		maxVolume: 1920,
		totalMins: 20.845483333333334,
		totalReps: 96,
		totalSets: 5,
		totalVolume: 1920,
		workoutDate: "2025-12-25",
		totalCalories: 134.0296172785387167864478965,
	},
	{
		est1RM: 38.0,
		maxReps: 27,
		historyID: 136,
		maxVolume: 1760,
		totalMins: 17.153916666666664,
		totalReps: 88,
		totalSets: 4,
		totalVolume: 1760,
		workoutDate: "2025-12-28",
		totalCalories: 99.2646495169689783187875726,
	},
	{
		est1RM: 33.3333333333333333334,
		maxReps: 20,
		historyID: 137,
		maxVolume: 1000,
		totalMins: 11.070400000000001,
		totalReps: 50,
		totalSets: 3,
		totalVolume: 1000,
		workoutDate: "2026-01-03",
		totalCalories: 71.17903919012040642967184475,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 138,
		maxVolume: 1700,
		totalMins: 24.55441666666667,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2026-01-06",
		totalCalories: 142.08915735533415053901553425,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 140,
		maxVolume: 1680,
		totalMins: 17.77355,
		totalReps: 84,
		totalSets: 4,
		totalVolume: 1680,
		workoutDate: "2026-01-08",
		totalCalories: 114.2780940162563625,
	},
	{
		est1RM: 36.6666666666666666666,
		maxReps: 25,
		historyID: 144,
		maxVolume: 1700,
		totalMins: 18.30905,
		totalReps: 85,
		totalSets: 4,
		totalVolume: 1700,
		workoutDate: "2026-01-13",
		totalCalories: 117.7211832891199875,
	},
	{
		est1RM: 38.6666666666666666666,
		maxReps: 28,
		historyID: 146,
		maxVolume: 2020,
		totalMins: 20.8066,
		totalReps: 101,
		totalSets: 5,
		totalVolume: 2020,
		workoutDate: "2026-01-15",
		totalCalories: 133.77961020497535,
	},
	{
		est1RM: 37.3333333333333333334,
		maxReps: 26,
		historyID: 150,
		maxVolume: 2080,
		totalMins: 19.72145,
		totalReps: 104,
		totalSets: 5,
		totalVolume: 2080,
		workoutDate: "2026-01-20",
		totalCalories: 126.8024518026448875,
	},
	{
		est1RM: 38.6666666666666666666,
		maxReps: 28,
		historyID: 152,
		maxVolume: 2180,
		totalMins: 25.21486666666667,
		totalReps: 109,
		totalSets: 5,
		totalVolume: 2180,
		workoutDate: "2026-01-22",
		totalCalories: 162.1233182757919714322394825,
	},
];

const getDataFor = <T extends object>(data: Array<T>, key: keyof T) => {
	const sorted = data.sort((a, b) => {
		return b.historyID - a.historyID;
	});
	const dataset = sorted.map((entry) => {
		return entry[key];
	});
	return dataset;
};

const baseData = [15, 32, 18, 22, 21, 30, 45, 48];
const heatData = [
	20,
	22,
	15,
	null,
	33,
	41,
	10,
	12,
	41,
	26,
	10,
	null,
	17,
	19,
	35,
	12,
	18,
	null,
	33,
	44,
	23,
];

const getLongestMins = (data) => {
	const allMins = data.map((x) => x.totalMins);
	const max = Math.max(...allMins);
	const min = Math.min(...allMins, 0);

	return {
		min,
		max,
	};
};

const DemoPage = () => {
	const primary = ringVariants.Red;
	const secondary = ringVariants.Blue;
	const tertiary = ringVariants.Purple;
	const minsData = getDataFor(strengthData, "totalMins");
	const maxRepsData = getDataFor(strengthData, "maxReps");
	const maxVolData = getDataFor(strengthData, "maxVolume");
	const minMax = getLongestMins(strengthData);
	console.log("minMax", minMax);

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
				<div className={css.DemoPage_item}>
					<LayeredAreaChart
						width={320}
						height={140}
						datasets={[
							{
								data: [10, 20, 40, 35, 50, 60],
								fill: "rgba(0,124,255,0.25)",
								stroke: "#007cff",
							},
							{
								data: [5, 15, 25, 30, 45, 55],
								fill: "rgba(0,226,189,0.25)",
								stroke: "#00e2bd",
							},
							{
								data: [8, 18, 28, 20, 38, 48],
								fill: "rgba(255,51,61,0.25)",
								stroke: "#ff333d",
							},
						]}
					/>
				</div>
				<div className={css.DemoPage_item}>
					<TrendItem />
				</div>
				<div className={css.DemoPage_item}>
					<ProgressContent
						size={140}
						strokeWidth={7}
						progress={55}
						stroke="var(--walkAccent)"
					>
						<div style={{ fontSize: "2rem", fontWeight: "700" }}>5.5k lbs.</div>
					</ProgressContent>
				</div>

				<div className={css.DemoPage_item}>
					<HeatMap
						data={minsData}
						size={25}
						gap={1}
						columns={8}
						// colors={["#bbf7d0", "#4ade80", "#16a34a"]}
						noDataColor="var(--blueGrey900)"
					/>
				</div>
				<div className={css.DemoPage_item}>
					<TrendLine
						// data={[...baseData].reverse()}
						data={[...baseData]}
						stroke="var(--accent-green)"
						strokeWidth={3.25}
					/>
				</div>
				<div className={css.DemoPage}>
					<AreaChart
						data={maxVolData as number[]}
						fill="var(--walkFill)"
						stroke="var(--walkAccent)"
						// fill="var(--strengthFill)"
						// stroke="var(--strengthAccent)"
					/>
					{/* <TrendLine direction="down" width={300} height={250} /> */}
				</div>
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
