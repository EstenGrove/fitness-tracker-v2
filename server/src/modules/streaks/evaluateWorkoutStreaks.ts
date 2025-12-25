import db from "../../db/db.js";
import { streaksService } from "../../services/index.js";

const evaluateWorkoutStreaks = async (userID: string, targetDate: string) => {
	const data = streaksService.evaluateWorkoutStreaks(userID, targetDate);

	if (data instanceof Error) {
		return data;
	}

	return data;
};

// Promise version that's non-block (eg. fire and forget)
const evaluateWorkoutStreaksPromise = (userID: string, targetDate: string) => {
	const query = `SELECT * FROM evaluate_workout_streaks_for_date($1, $2)`;

	return new Promise((resolve, reject) => {
		db.query(query, [userID, targetDate]).then(resolve, reject);
	});
};

export { evaluateWorkoutStreaks, evaluateWorkoutStreaksPromise };
