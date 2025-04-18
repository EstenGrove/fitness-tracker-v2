import db from "../db/db.ts";
import { WorkoutsService } from "./WorkoutsService.ts";
import { UserService } from "./UserService.ts";
import { HistoryService } from "./HistoryService.ts";
import { DashboardService } from "./DashboardService.ts";

const userService = new UserService(db);
const historyService = new HistoryService(db);
const workoutsService = new WorkoutsService(db);
const dashboardService = new DashboardService(db);

const allServices = {
	user: userService,
	history: historyService,
	workouts: workoutsService,
	dashboard: dashboardService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	dashboardService,
	workoutsService,
	historyService,
	userService,
};
