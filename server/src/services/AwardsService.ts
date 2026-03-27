import type { Pool } from "pg";

class AwardsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
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

	async getWorkoutStreakAchievements(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_workout_streak_achievements($1, $2)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getWorkoutAwardsAndStreaks(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_workout_awards_and_achievements($1, $2) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			console.log("results", results);
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { AwardsService };
