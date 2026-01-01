import type { Pool } from "pg";

class StreaksService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async evaluateWorkoutStreaks(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM evaluate_workout_streaks_for_date($1, $2)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getCurrentWorkoutStreak(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_current_workout_streak($1, $2)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCurrentHabitStreak(
		userID: string,
		habitID: number,
		targetDate: string
	) {
		try {
			const query = `SELECT * FROM get_current_habit_streak($1, $2)`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				targetDate,
			]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getWorkoutStreaks(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_workout_streak_details($1, $2) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getHabitStreaks(userID: string, habitID: number, targetDate: string) {
		try {
			const query = `SELECT * FROM get_habit_streak_details($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				targetDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { StreaksService };
