import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import habitRoutes from "./habitRoutes.js";
import exportRoutes from "./exportRoutes.js";
import statsRoutes from "./statsRoutes.js";
import historyRoutes from "./historyRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import summaryRoutes from "./summaryRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import recentActivityRoutes from "./recentActivityRoutes.js";

const allRoutes = {
	recentActivity: recentActivityRoutes,
	medications: medicationRoutes,
	dashboard: dashboardRoutes,
	workouts: workoutRoutes,
	summary: summaryRoutes,
	history: historyRoutes,
	exports: exportRoutes,
	habits: habitRoutes,
	stats: statsRoutes,
	auth: authRoutes,
	user: userRoutes,
};

export { allRoutes };
