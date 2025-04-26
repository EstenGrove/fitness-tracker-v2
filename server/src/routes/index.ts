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
};

export { allRoutes };
