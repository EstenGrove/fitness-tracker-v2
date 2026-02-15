import type { Pool } from "pg";
import type { Activity, DateRange } from "../modules/types.js";
import type { HistoryOfTypeDB } from "../modules/history/types.js";
import type { WorkoutSet } from "../modules/workouts/types.js";

interface LastSessionParams {
	userID: string;
	workoutID: number;
	activityType: string;
	targetDate: string;
}

export interface UpdateHistoryData {
	userID: string;
	historyID: number;
	activityType: Activity;
	startTime?: string;
	endTime?: string;
	duration?: number;
	sets?: WorkoutSet[];
	steps?: number;
	miles?: number;
	pace?: number;
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
			return rows.history;
		} catch (error) {
			return error;
		}
	}

	// Returns JSONB data from the PROC/Fn
	async updateWorkoutHistoryEntry(newData: UpdateHistoryData) {
		try {
			const query = `SELECT * FROM edit_workout_history_entry($1)`;
			const result = await this.#db.query(query, [newData]);
			const rows = result?.rows?.[0]?.edit_workout_history_entry;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async deleteWorkoutSession(
		userID: string,
		historyID: number,
		activityType: Activity
	) {
		try {
			const query = `SELECT * FROM delete_workout_session($1, $2, $3)`;
			const result = await this.#db.query(query, [
				userID,
				historyID,
				activityType,
			]);
			const rows = result?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { HistoryService };
