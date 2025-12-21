import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";
import habitRoutes from "./habitRoutes.js";
import streakRoutes from "./streakRoutes.js";
import exportRoutes from "./exportRoutes.js";
import statsRoutes from "./statsRoutes.js";
import historyRoutes from "./historyRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import summaryRoutes from "./summaryRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import recentActivityRoutes from "./recentActivityRoutes.js";

const allRoutes = {
	recentActivity: recentActivityRoutes,
	medications: medicationRoutes,
	dashboard: dashboardRoutes,
	workouts: workoutRoutes,
	settings: settingsRoutes,
	summary: summaryRoutes,
	history: historyRoutes,
	exports: exportRoutes,
	streaks: streakRoutes,
	habits: habitRoutes,
	stats: statsRoutes,
	chat: chatRoutes,
	auth: authRoutes,
	user: userRoutes,
};

export { allRoutes };
