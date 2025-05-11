import type { Pool } from "pg";
import type { Activity, DateRange } from "../modules/types.ts";
import type { HistoryOfTypeDB } from "../modules/history/types.ts";

interface LastSessionParams {
	userID: string;
	workoutID: number;
	activityType: string;
	targetDate: string;
}

export type HistoryResp = Promise<HistoryOfTypeDB[] | unknown>;
export type LastSessionResp = Promise<HistoryOfTypeDB | unknown>;

class HistoryService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getHistoryDetails(
		userID: string,
		historyID: number,
		activityType: string
	) {
		try {
			const query = `SELECT * FROM get_history_details(
				$1,
				$2,
				$3
			) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				activityType,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getMostRecentSession(params: LastSessionParams) {
		const { userID, workoutID, activityType } = params;
		try {
			const query = `SELECT * FROM get_most_recent_workout_entry(
				$1,
				$2,
				$3
			) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				activityType,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0]?.data;
			return rows?.lastWorkout;
		} catch (error) {
			return error;
		}
	}

	async getLastWorkoutSession(params: LastSessionParams): LastSessionResp {
		const { userID, workoutID, activityType, targetDate } = params;
		try {
			const query = `SELECT * FROM get_last_workout_by_date(
				$1,
				$2,
				$3,
				$4
			) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				activityType,
				targetDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getHistoryForRange(userID: string, range: DateRange): HistoryResp {
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_all_history_for_range(
        $1,
        $2,
        $3
      ) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getHistoryForRangeAndActivity(
		userID: string,
		activityType: Activity,
		range: DateRange
	): HistoryResp {
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_history_for_range_and_activity(
        $1,
        $2,
        $3,
        $4
      ) as data`;
			const results = await this.#db.query(query, [
				userID,
				activityType,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			console.log("rows", rows);
			return rows.history;
		} catch (error) {
			return error;
		}
	}
}

export { HistoryService };
