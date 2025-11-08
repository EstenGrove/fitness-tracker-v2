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
import { ExportService } from "./ExportService.js";
import { ChatDataService } from "./ChatDataService.js";
import { ChatSuggestionsService } from "./ChatSuggestionsService.js";

const authService = new AuthService(db);
const userService = new UserService(db);
const statsService = new StatsService(db);
const chatService = new ChatDataService(db);
const habitsService = new HabitsService(db);
const exportsService = new ExportService(db);
const historyService = new HistoryService(db);
const summaryService = new SummaryService(db);
const workoutsService = new WorkoutsService(db);
const dashboardService = new DashboardService(db);
const medicationsService = new MedicationsService(db);
const recentActivityService = new RecentActivityService(db);
const chatSuggestionsService = new ChatSuggestionsService(db);

const allServices = {
	user: userService,
	auth: authService,
	chat: chatService,
	stats: statsService,
	habits: habitsService,
	exports: exportsService,
	history: historyService,
	summary: summaryService,
	workouts: workoutsService,
	dashboard: dashboardService,
	medications: medicationsService,
	recentActivity: recentActivityService,
	chatSuggestions: chatSuggestionsService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	chatSuggestionsService,
	recentActivityService,
	medicationsService,
	dashboardService,
	workoutsService,
	summaryService,
	historyService,
	exportsService,
	habitsService,
	statsService,
	chatService,
	authService,
	userService,
};
