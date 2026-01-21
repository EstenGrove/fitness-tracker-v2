import type { Pool } from "pg";

/**
 * This service calls the various fns: 'get_recap_and_trends_for_strength()'
 */

class RecapsAndDetailsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getRecapAndTrendsForStrength(userID: string, workoutID: number) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_strength($1, $2) as data`;
			const results = await this.#db.query(query, [userID, workoutID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getRecapAndTrendsForStretch(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_stretch($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getRecapAndTrendsForWalk(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_walk($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getRecapAndTrendsForCardio(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_cardio($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getRecapAndTrendsForTimed(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_timed($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getRecapAndTrendsForOther(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_and_trends_for_other($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { RecapsAndDetailsService };
