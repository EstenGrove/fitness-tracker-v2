import type { Pool } from "pg";

class ChatDataService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getAICaloriesSummary(
		userID: string,
		startDate?: string,
		endDate?: string
	) {
		try {
			const query = `SELECT * FROM get_calories_for_range_by_activity($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getAIWorkoutSummary(
		userID: string,
		startDate?: string,
		endDate?: string
	) {
		try {
			const query = `SELECT * FROM get_ai_workout_summary($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { ChatDataService };
