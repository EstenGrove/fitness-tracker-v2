import db from "../db/db.ts";
import { WorkoutsService } from "./WorkoutsService.ts";
import { UserService } from "./UserService.ts";
import { HistoryService } from "./HistoryService.ts";

const userService = new UserService(db);
const historyService = new HistoryService(db);
const workoutsService = new WorkoutsService(db);

const allServices = {
	user: userService,
	history: historyService,
	workouts: workoutsService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	workoutsService,
	historyService,
	userService,
};
