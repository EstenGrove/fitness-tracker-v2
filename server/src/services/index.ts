import db from "../db/db.ts";
import { UserService } from "./UserService.ts";
import { AuthService } from "./AuthService.ts";
import { HistoryService } from "./HistoryService.ts";
import { WorkoutsService } from "./WorkoutsService.ts";
import { DashboardService } from "./DashboardService.ts";
import { MedicationsService } from "./MedicationsService.ts";
import { RecentActivityService } from "./RecentActivityService.ts";
import { StatsService } from "./StatsService.ts";
import { HabitsService } from "./HabitsService.ts";

const authService = new AuthService(db);
const userService = new UserService(db);
const statsService = new StatsService(db);
const habitsService = new HabitsService(db);
const historyService = new HistoryService(db);
const workoutsService = new WorkoutsService(db);
const dashboardService = new DashboardService(db);
const medicationsService = new MedicationsService(db);
const recentActivityService = new RecentActivityService(db);

const allServices = {
	user: userService,
	auth: authService,
	stats: statsService,
	habits: habitsService,
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
	habitsService,
	statsService,
	authService,
	userService,
};
