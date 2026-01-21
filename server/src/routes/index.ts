import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";
import habitRoutes from "./habitRoutes.js";
import statsRoutes from "./statsRoutes.js";
import trendsRoutes from "./trendsRoutes.js";
import streakRoutes from "./streakRoutes.js";
import exportRoutes from "./exportRoutes.js";
import historyRoutes from "./historyRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import summaryRoutes from "./summaryRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import weeklyRecap from "./weeklyRecapRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import recentActivityRoutes from "./recentActivityRoutes.js";

const allRoutes = {
	recentActivity: recentActivityRoutes,
	medications: medicationRoutes,
	dashboard: dashboardRoutes,
	settings: settingsRoutes,
	weeklyRecap: weeklyRecap,
	workouts: workoutRoutes,
	summary: summaryRoutes,
	history: historyRoutes,
	exports: exportRoutes,
	streaks: streakRoutes,
	habits: habitRoutes,
	stats: statsRoutes,
	trends: trendsRoutes,
	chat: chatRoutes,
	auth: authRoutes,
	user: userRoutes,
};

export { allRoutes };
