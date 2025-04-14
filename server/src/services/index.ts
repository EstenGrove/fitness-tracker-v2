import db from "../db/db.ts";
import { WorkoutsService } from "./WorkoutsService.ts";
import { UserService } from "./UserService.ts";

const userService = new UserService(db);
const workoutsService = new WorkoutsService(db);

const allServices = {
	user: userService,
	workouts: workoutsService,
};

export {
	// ALL SERVICES
	allServices,
	// INDIVIDUAL SERVICES
	workoutsService,
	userService,
};
