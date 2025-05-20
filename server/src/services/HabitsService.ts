import type { Pool } from "pg";
import type {
	HabitCardDB,
	HabitDB,
	HabitDetailParams,
	HabitDetailsDB,
	HabitLogDB,
	HabitLogValues,
	NewHabitValues,
	RecentHabitLogDB,
} from "../modules/habits/types.ts";

export interface RecentHabitParams {
	targetDate: string;
	lastXDays: number;
}

export type HabitResp = Promise<HabitDB | unknown>;
export type LoggedHabitResp = Promise<HabitDB | unknown>;
export type BatchedLogsResp = Promise<HabitDB[] | unknown>;
export type HabitsResp = Promise<HabitDB[] | unknown>;
export type HabitLogsResp = Promise<HabitLogDB[] | unknown>;
export type HabitDetailsResp = Promise<HabitDetailsDB | unknown>;
export type HabitCardsResp = Promise<HabitCardDB[] | unknown>;
export type RecentHabitLogsResp = Promise<RecentHabitLogDB[] | unknown>;

class HabitsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getRecentHabitLogs(
		userID: string,
		params: RecentHabitParams
	): RecentHabitLogsResp {
		const { targetDate, lastXDays } = params;
		try {
			const query = `SELECT * FROM get_recent_habit_logs(
				$1,
				$2,
				$3
			)`;
			const results = await this.#db.query(query, [
				userID,
				targetDate,
				lastXDays,
			]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async createHabit(userID: string, values: NewHabitValues): HabitResp {
		try {
			const query = `SELECT * FROM create_habit(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, values]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getHabitCards(userID: string, targetDate: string): HabitCardsResp {
		try {
			const query = `SELECT * FROM get_habit_cards(
				$1,
				$2
			) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data?.habitCards;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async logHabitsBatched(logs: HabitLogValues[]): BatchedLogsResp {
		try {
			const query = `SELECT * FROM log_habits_batched($1::JSONB)`;
			const results = await this.#db.query(query, [JSON.stringify(logs)]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async logHabit(values: HabitLogValues): LoggedHabitResp {
		try {
			const query = `SELECT * FROM log_habit(
        $1
      )`;
			const results = await this.#db.query(query, [values]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getHabitDetails(params: HabitDetailParams): HabitDetailsResp {
		const { userID, habitID, targetDate } = params;
		try {
			const query = `SELECT * FROM get_habit_details(
				$1,
				$2,
				$3
			) as data`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				targetDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
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
