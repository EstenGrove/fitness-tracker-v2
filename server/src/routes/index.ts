import historyRoutes from "./historyRoutes.ts";
import workoutRoutes from "./workoutRoutes.ts";
import dashboardRoutes from "./dashboardRoutes.ts";
import medicationRoutes from "./medicationRoutes.ts";

const allRoutes = {
	medications: medicationRoutes,
	dashboard: dashboardRoutes,
	workouts: workoutRoutes,
	history: historyRoutes,
};

export { allRoutes };
