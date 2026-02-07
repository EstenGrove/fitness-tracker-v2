import type { Pool } from "pg";
import type { DateRange, DateRangeDB } from "../modules/types.js";

class SummaryService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getExerciseSummaryForRange(userID: string, range: DateRange) {
		try {
			const query = `SELECT * FROM get_exercise_summary_for_range($1, $2, $3)`;
			const results = await this.#db.query(query, [
				userID,
				range.startDate,
				range.endDate,
			]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
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
