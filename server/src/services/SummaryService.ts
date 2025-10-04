import type { Pool } from "pg";

class SummaryService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getWorkoutHistoryCalendar(userID: string, baseDate: string) {
		try {
			const query = `SELECT * FROM get_workout_history_calendar($1, $2)`;
			const results = await this.#db.query(query, [userID, baseDate]);
			const data = results?.rows?.[0]?.get_workout_history_calendar;
			return data;
		} catch (error) {
			return error;
		}
	}
	async getWorkoutHistoryCalendarDetails(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_workout_history_calendar_details_for_date($1, $2)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const data =
				results?.rows?.[0]?.get_workout_history_calendar_details_for_date;
			return data;
		} catch (error) {
			return error;
		}
	}
}

export { SummaryService };
