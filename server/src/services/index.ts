import db from "../db/db.js";
import { JobsService } from "./JobsService.js";
import { UserService } from "./UserService.js";
import { AuthService } from "./AuthService.js";
import { StatsService } from "./StatsService.js";
import { HabitsService } from "./HabitsService.js";
import { ExportService } from "./ExportService.js";
import { TrendsService } from "./TrendsService.js";
import { StreaksService } from "./StreaksService.js";
import { SummaryService } from "./SummaryService.js";
import { HistoryService } from "./HistoryService.js";
import { SettingsService } from "./SettingsService.js";
import { ChatDataService } from "./ChatDataService.js";
import { WorkoutsService } from "./WorkoutsService.js";
import { DashboardService } from "./DashboardService.js";
import { WeeklyRecapService } from "./WeeklyRecapService.js";
import { MedicationsService } from "./MedicationsService.js";
import { RecentActivityService } from "./RecentActivityService.js";
import { ChatSuggestionsService } from "./ChatSuggestionsService.js";
import { InsightsService } from "./InsightsService.js";
import { RecapsService } from "./RecapsService.js";
import { RecapsAndDetailsService } from "./RecapsAndDetailsService.js";

const authService = new AuthService(db);
const userService = new UserService(db);
const jobsService = new JobsService(db);
const statsService = new StatsService(db);
const chatService = new ChatDataService(db);
const habitsService = new HabitsService(db);
const trendsService = new TrendsService(db);
const recapsService = new RecapsService(db);
const exportsService = new ExportService(db);
const streaksService = new StreaksService(db);
const historyService = new HistoryService(db);
const summaryService = new SummaryService(db);
const insightsService = new InsightsService(db);
const workoutsService = new WorkoutsService(db);
const settingsService = new SettingsService(db);
const dashboardService = new DashboardService(db);
const weeklyRecapService = new WeeklyRecapService(db);
const medicationsService = new MedicationsService(db);
const recentActivityService = new RecentActivityService(db);
const chatSuggestionsService = new ChatSuggestionsService(db);
const recapsAndDetailsService = new RecapsAndDetailsService(db);

const allServices = {
	user: userService,
	auth: authService,
	chat: chatService,
	jobs: jobsService,
	stats: statsService,
	recaps: recapsService,
	habits: habitsService,
	streaks: streaksService,
	exports: exportsService,
	history: historyService,
	summary: summaryService,
	insights: insightsService,
	settings: settingsService,
	workouts: workoutsService,
	dashboard: dashboardService,
	weeklyRecap: weeklyRecapService,
	medications: medicationsService,
	recentActivity: recentActivityService,
	chatSuggestions: chatSuggestionsService,
	recapsAndDetails: recapsAndDetailsService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	recapsAndDetailsService,
	chatSuggestionsService,
	recentActivityService,
	medicationsService,
	weeklyRecapService,
	dashboardService,
	insightsService,
	workoutsService,
	settingsService,
	summaryService,
	historyService,
	exportsService,
	streaksService,
	habitsService,
	recapsService,
	trendsService,
	statsService,
	chatService,
	authService,
	userService,
	jobsService,
};
