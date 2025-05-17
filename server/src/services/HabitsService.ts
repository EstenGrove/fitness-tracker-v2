import type { Pool } from "pg";
import type { HabitDB, HabitLogDB } from "../modules/habits/types.ts";

export type HabitsResp = Promise<HabitDB[] | unknown>;
export type HabitLogsResp = Promise<HabitLogDB[] | unknown>;

class HabitsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getHabits(userID: string, targetDate: string): HabitsResp {
		try {
			const query = `SELECT * FROM get_user_habits(
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
	async getHabitLogs(userID: string, habitID: number): HabitLogsResp {
		try {
			const query = `SELECT * FROM get_habit_logs(
        $1,
        $2
      )`;
			const results = await this.#db.query(query, [userID, habitID]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { HabitsService };
