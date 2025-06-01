import type { Pool } from "pg";
import type { Activity } from "../modules/types.js";
import type { PostWorkoutParams } from "../modules/stats/types.js";

export interface MinSummaryParams {
	userID: string;
	targetDate: string;
	rangeType: "Daily" | "Weekly" | "Monthly" | "Yearly";
}

class StatsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getPostWorkoutDetails(params: PostWorkoutParams) {
		const { userID, workoutID, activityType } = params;
		try {
			const query = `SELECT * FROM get_post_workout_details(
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
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutStrengthStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Strength";
		try {
			const query = `SELECT * FROM get_post_workout_strength(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutStretchStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Stretch";
		try {
			const query = `SELECT * FROM get_post_workout_stretch(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutWalkStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Walk";
		try {
			const query = `SELECT * FROM get_post_workout_walk(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutCardioStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Cardio";
		try {
			const query = `SELECT * FROM get_post_workout_cardio(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutTimedStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Timed";
		try {
			const query = `SELECT * FROM get_post_workout_timed(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getPostWorkoutOtherStats(params: PostWorkoutParams) {
		const { userID, workoutID, historyID } = params;
		const type = "Other";
		try {
			const query = `SELECT * FROM get_post_workout_other(
        $1,
        $2,
        $3,
        $4
      )`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				historyID,
				type,
			]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getDailyMins(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_daily_mins(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getWeeklyMins(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_weekly_mins(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getMonthlyMins(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_monthly_mins(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getYearlyMins(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_yearly_mins(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	// Summary Stats
	async getMinsSummaryForRange(params: MinSummaryParams) {
		const { userID, targetDate, rangeType } = params;
		try {
			const query = `SELECT * FROM get_mins_summary_for_range(
			$1,
			$2,
			$3
			)`;
			const results = await this.#db.query(query, [
				userID,
				targetDate,
				rangeType,
			]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { StatsService };
