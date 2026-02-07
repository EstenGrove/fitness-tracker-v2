import type { Pool } from "pg";
import type { DateRange } from "../modules/types.js";

class WeeklyRecapService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getWeeklyRecap(userID: string, range: DateRange) {
		try {
			const query = `SELECT * FROM get_weekly_workout_recap($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				range.startDate,
				range.endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getWeeklyRecaps(userID: string, range: DateRange) {
		try {
			const query = `SELECT * FROM get_weekly_workout_recaps($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				range.startDate,
				range.endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}
export { WeeklyRecapService };
