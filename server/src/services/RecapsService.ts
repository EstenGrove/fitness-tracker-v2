import type { Pool } from "pg";

class RecapsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getWalkRecap(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_for_walk($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthRecap(userID: string, workoutID: number) {
		try {
			const query = `SELECT * FROM get_recap_for_strength($1, $2) as data`;
			const results = await this.#db.query(query, [userID, workoutID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCardioRecap(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_for_cardio($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchRecap(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_stretch($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedRecap(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_for_timed($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherRecap(userID: string) {
		try {
			const query = `SELECT * FROM get_recap_for_other($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { RecapsService };
