import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import habitRoutes from "./habitRoutes.js";
import statsRoutes from "./statsRoutes.js";
import historyRoutes from "./historyRoutes.js";
import workoutRoutes from "./workoutRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import recentActivityRoutes from "./recentActivityRoutes.js";

const allRoutes = {
	recentActivity: recentActivityRoutes,
	medications: medicationRoutes,
	dashboard: dashboardRoutes,
	workouts: workoutRoutes,
	history: historyRoutes,
	habits: habitRoutes,
	stats: statsRoutes,
	auth: authRoutes,
	user: userRoutes,
};

export { allRoutes };
