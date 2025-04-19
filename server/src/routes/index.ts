import historyRoutes from "./historyRoutes.ts";
import workoutRoutes from "./workoutRoutes.ts";
import dashboardRoutes from "./dashboardRoutes.ts";

const allRoutes = {
	dashboard: dashboardRoutes,
	workouts: workoutRoutes,
	history: historyRoutes,
};

export { allRoutes };
