import type { Pool } from "pg";
import type { Activity, Effort } from "../modules/types.ts";
import type { WorkoutSet } from "../modules/workouts/types.ts";
import type { HistoryOfTypeDB } from "../modules/history/types.ts";

interface MarkAsDoneBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	startTime: string;
	endTime: string;
	effort: Effort;
	workoutLength: number;
	steps?: number;
	miles?: number;
	pace?: number;
	sets?: WorkoutSet[];
}

export type LoggedWorkoutResp = Promise<HistoryOfTypeDB | unknown>;

class WorkoutsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async logStrength(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_strength_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Strength" };
		} catch (error) {
			return error;
		}
	}
	async logStretch(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_stretch_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			console.log("results", results);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Stretch" };
		} catch (error) {
			return error;
		}
	}
	async logWalk(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_walk_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Walk" };
		} catch (error) {
			return error;
		}
	}
	async logCardio(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_cardio_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Cardio" };
		} catch (error) {
			return error;
		}
	}
	async logTimed(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_timed_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Timed" };
		} catch (error) {
			return error;
		}
	}
	async logOther(values: object): LoggedWorkoutResp {
		try {
			const query = `SELECT * FROM log_other_workout(
				$1
			) as data`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows?.[0];
			return { ...rows, activity_type: "Other" };
		} catch (error) {
			return error;
		}
	}

	async getAllWorkouts(userID: string) {
		try {
			const query = `SELECT * FROM get_all_workouts(
				$1
			) as data`;
			const results = await this.#db.query(query, [userID]);
			console.log("[RESULTS]", results);
			const rows = results?.rows;
			console.log("results.rows", results.rows);
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getTodaysWorkouts(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_todays_workouts(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			console.log("results.rows", results.rows);
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getWorkoutDetails(
		userID: string,
		workoutID: number,
		activityType: string
	) {
		try {
			const query = `SELECT * FROM get_workout_details(
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
			return rows;
		} catch (error) {
			return error;
		}
	}

	async markWorkoutAsDone(details: MarkAsDoneBody) {
		console.log("details(inPG):", details);
		try {
			const query = `SELECT * FROM mark_workout_as_done(
				$1
			) as data`;
			const results = await this.#db.query(query, [details]);
			console.log("results", results);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { WorkoutsService };
