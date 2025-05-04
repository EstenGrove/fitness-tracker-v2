import type { Pool } from "pg";
import type { Activity } from "../modules/types.ts";
import type { PostWorkoutParams } from "../modules/stats/types.ts";

class StatsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
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
}

export { StatsService };
