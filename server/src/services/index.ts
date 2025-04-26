import db from "../db/db.ts";
import { WorkoutsService } from "./WorkoutsService.ts";
import { UserService } from "./UserService.ts";
import { HistoryService } from "./HistoryService.ts";
import { DashboardService } from "./DashboardService.ts";
import { MedicationsService } from "./MedicationsService.ts";
import { RecentActivityService } from "./RecentActivityService.ts";

const userService = new UserService(db);
const historyService = new HistoryService(db);
const workoutsService = new WorkoutsService(db);
const dashboardService = new DashboardService(db);
const medicationsService = new MedicationsService(db);
const recentActivityService = new RecentActivityService(db);

const allServices = {
	user: userService,
	history: historyService,
	workouts: workoutsService,
	dashboard: dashboardService,
	medications: medicationsService,
	recentActivity: recentActivityService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	recentActivityService,
	medicationsService,
	dashboardService,
	workoutsService,
	historyService,
	userService,
};
