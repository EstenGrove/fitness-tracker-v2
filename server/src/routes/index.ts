import userRoutes from "./userRoutes.ts";
import authRoutes from "./authRoutes.ts";
import habitRoutes from "./habitRoutes.ts";
import statsRoutes from "./statsRoutes.ts";
import historyRoutes from "./historyRoutes.ts";
import workoutRoutes from "./workoutRoutes.ts";
import dashboardRoutes from "./dashboardRoutes.ts";
import medicationRoutes from "./medicationRoutes.ts";
import recentActivityRoutes from "./recentActivityRoutes.ts";

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
