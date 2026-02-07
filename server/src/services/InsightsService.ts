import type { Pool } from "pg";

class InsightsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getCardioInsights(userID: string) {
		try {
			const query = `SELECT * FROM get_cardio_insights($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchInsights(userID: string) {
		try {
			const query = `SELECT * FROM get_stretch_workout_insights($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthInsights(userID: string, workoutID: number) {
		try {
			const query = `SELECT * FROM get_strength_workout_insights($1, $2) as data`;
			const results = await this.#db.query(query, [userID, workoutID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getWalkInsights(userID: string) {
		try {
			const query = `SELECT * FROM get_walk_insights($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedInsights(userID: string) {
		try {
			const query = `SELECT * FROM get_timed_insights($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherInsights(userID: string) {
		try {
			const query = `SELECT * FROM get_other_insights($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { InsightsService };
