import type { Pool } from "pg";
import type { Activity, DateRange, Effort } from "../modules/types.js";
import type {
	DeleteWorkoutDateParams,
	LogWorkoutBody,
	SkippedWorkoutDB,
	SkipWorkoutBody,
	WorkoutSet,
} from "../modules/workouts/types.js";
import type { HistoryOfTypeDB } from "../modules/history/types.js";

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
export type SkippedResp = Promise<SkippedWorkoutDB | unknown>;

class WorkoutsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getScheduledWorkouts(userID: string, dateRange: DateRange) {
		const { startDate, endDate } = dateRange;

		try {
			const query = `SELECT * FROM get_scheduled_workouts_for_range($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	// Returns scheduled workouts grouped by date
	async getScheduledWorkoutsGrouped(userID: string, dateRange: DateRange) {
		const { startDate, endDate } = dateRange;

		try {
			const query = `SELECT * FROM get_scheduled_workouts_json_by_date($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.get_scheduled_workouts_json_by_date;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async deleteWorkoutDate(params: DeleteWorkoutDateParams) {
		const { userID, workoutID, activityType, workoutDate } = params;
		try {
			const queryParams = [userID, workoutID, activityType, workoutDate];
			const query = `SELECT * FROM delete_workout_instance($1, $2, $3, $4)`;
			const results = await this.#db.query(query, queryParams);
			const rows = results?.rows?.[0]?.delete_workout_instance;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async skipWorkout(userID: string, values: SkipWorkoutBody): SkippedResp {
		const { workoutID, activityType, workoutDate } = values;
		try {
			const query = `SELECT * FROM skip_workout(
				$1,
				$2,
				$3,
				$4
			) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				activityType,
				workoutDate,
			]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
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
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAllUserWorkouts(userID: string) {
		try {
			const query = `SELECT * FROM get_all_user_workouts(
				$1
			) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows;
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
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getSkippedWorkouts(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_skipped_workouts_for_date(
				$1,
				$2
			) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getTodaysUnscheduled(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_todays_unscheduled_workouts($1, $2)`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows ?? [];
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
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async markWorkoutAsDone(details: MarkAsDoneBody) {
		try {
			const query = `SELECT * FROM mark_workout_as_done(
				$1
			) as data`;
			const results = await this.#db.query(query, [details]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async createRecurringWorkout(data: object) {
		try {
			const query = `SELECT * FROM create_recurring_workout($1)`;
			const results = await this.#db.query(query, [data]);
			const rows = results?.rows?.[0]?.create_recurring_workout;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async createOneTimeWorkout(data: object) {
		try {
			const query = `SELECT * FROM create_single_workout($1)`;
			const results = await this.#db.query(query, [data]);
			const rows = results?.rows?.[0]?.create_single_workout;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { WorkoutsService };
