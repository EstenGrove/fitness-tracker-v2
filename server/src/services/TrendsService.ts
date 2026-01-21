import type { Pool } from "pg";

class TrendsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getWalkTrends(userID: string) {
		try {
			const query = `SELECT * FROM get_walk_trends($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthTrends(userID: string, workoutID: number) {
		try {
			const query = `SELECT * FROM get_strength_trends($1, $2) as data`;
			const results = await this.#db.query(query, [userID, workoutID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCardioTrends(userID: string) {
		try {
			const query = `SELECT * FROM get_cardio_trends($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchTrends(userID: string) {
		try {
			const query = `SELECT * FROM get_stretch_trends($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedTrends(userID: string) {
		try {
			const query = `SELECT * FROM get_timed_trends($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherTrends(userID: string) {
		try {
			const query = `SELECT * FROM get_other_trends($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { TrendsService };
