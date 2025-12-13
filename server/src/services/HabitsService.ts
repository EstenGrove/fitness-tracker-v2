import type { Pool } from "pg";
import type {
	HabitCardDB,
	HabitDB,
	HabitDetailParams,
	HabitDetailsDB,
	HabitHistoryDB,
	HabitLogDB,
	HabitLogValues,
	HabitMonthSummary,
	HabitWeekSummary,
	HabitYearSummary,
	NewHabitValues,
	RecentHabitLogDB,
} from "../modules/habits/types.js";

export interface RecentHabitParams {
	targetDate: string;
	lastXDays: number;
}

export interface NewHabitGoalParams {
	userID: string;
	habitID: number;
	newGoal: number;
	newGoalUnit: string;
}

export type HabitResp = Promise<HabitDB | unknown>;
export type LoggedHabitResp = Promise<HabitDB | unknown>;
export type BatchedLogsResp = Promise<HabitDB[] | unknown>;
export type HabitsResp = Promise<HabitDB[] | unknown>;
export type HabitLogsResp = Promise<HabitLogDB[] | unknown>;
export type HabitDetailsResp = Promise<HabitDetailsDB | unknown>;
export type HabitCardsResp = Promise<HabitCardDB[] | unknown>;
export type RecentHabitLogsResp = Promise<RecentHabitLogDB[] | unknown>;
export type HabitItemResp = Promise<HabitDB | unknown>;
export type HabitHistoryResp = Promise<HabitHistoryDB | unknown>;
export type HabitWeekResp = Promise<HabitWeekSummary | unknown>;
export type HabitMonthResp = Promise<HabitMonthSummary | unknown>;

class HabitsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getHabitHistory(
		userID: string,
		habitID: number,
		lastXDays: number = 60
	): HabitHistoryResp {
		try {
			const query = `SELECT * FROM get_habit_history_summary(
				$1,
				$2,
				$3
			)`;
			const results = await this.#db.query(query, [userID, habitID, lastXDays]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getHabitByID(userID: string, habitID: number): HabitItemResp {
		try {
			const query = `SELECT * FROM get_habit_by_id(
				$1,
				$2
			)`;
			const results = await this.#db.query(query, [userID, habitID]);
			const row = results?.rows?.[0];
			return row;
		} catch (error) {
			return error;
		}
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

	async getHabitWeek(
		userID: string,
		habitID: number,
		targetDate: string
	): HabitWeekResp {
		try {
			const query = `SELECT * FROM get_habit_week(
				$1,
				$2,
				$3
			)`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				targetDate,
			]);
			const data = results?.rows?.[0].data;
			return data;
		} catch (error) {
			return error;
		}
	}
	async getHabitMonth(
		userID: string,
		habitID: number,
		targetDate: string
	): HabitMonthResp {
		try {
			const query = `SELECT * FROM get_habit_month(
				$1,
				$2,
				$3
			)`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				targetDate,
			]);
			const data = results?.rows?.[0].data;
			return data;
		} catch (error) {
			return error;
		}
	}
	async getHabitYear(
		userID: string,
		habitID: number,
		baseDate: string
	): Promise<HabitYearSummary | unknown> {
		try {
			const query = `SELECT * FROM get_habit_year($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, habitID, baseDate]);
			const data = results?.rows?.[0]?.data;
			return data;
		} catch (error) {
			return error;
		}
	}
	async getHabitYearSummary(
		userID: string,
		habitID: number,
		year: number
	): Promise<HabitYearSummary | unknown> {
		try {
			const query = `SELECT * FROM get_habit_year_summary($1, $2, $3)`;
			const results = await this.#db.query(query, [userID, habitID, year]);
			const data = results?.rows?.[0]?.get_habit_year_summary;
			return data;
		} catch (error) {
			return error;
		}
	}

	async getHabitHistoryForRange(
		userID: string,
		habitID: number,
		startDate: string,
		endDate: string
	) {
		try {
			const query = `SELECT * FROM get_habit_history_for_range(
				$1,
				$2,
				$3,
				$4
			)`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				startDate,
				endDate,
			]);
			const data = results?.rows?.[0]?.get_habit_history_for_range;
			return data;
		} catch (error) {
			return error;
		}
	}

	async changeHabitGoal(data: NewHabitGoalParams) {
		const { userID, habitID, newGoal, newGoalUnit } = data;
		try {
			const query = `SELECT * FROM change_habit_goal($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				habitID,
				newGoal,
				newGoalUnit,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { HabitsService };
