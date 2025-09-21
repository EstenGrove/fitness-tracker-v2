import db from "../db/db.js";
import { UserService } from "./UserService.js";
import { AuthService } from "./AuthService.js";
import { HistoryService } from "./HistoryService.js";
import { WorkoutsService } from "./WorkoutsService.js";
import { DashboardService } from "./DashboardService.js";
import { MedicationsService } from "./MedicationsService.js";
import { RecentActivityService } from "./RecentActivityService.js";
import { StatsService } from "./StatsService.js";
import { HabitsService } from "./HabitsService.js";
import { SummaryService } from "./SummaryService.js";

const authService = new AuthService(db);
const userService = new UserService(db);
const statsService = new StatsService(db);
const habitsService = new HabitsService(db);
const historyService = new HistoryService(db);
const summaryService = new SummaryService(db);
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
	summary: summaryService,
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
	summaryService,
	historyService,
	habitsService,
	statsService,
	authService,
	userService,
};
