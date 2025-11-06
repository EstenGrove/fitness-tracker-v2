import type { Pool } from "pg";

class RecentActivityService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getDayActivity(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_day_activity_summary(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getWeeklyActivity(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_weekly_activity_summary(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getMonthlyActivity(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_monthly_activity_summary(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getQuarterlyActivity(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_quarterly_activity_summary(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getYearlyActivity(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_yearly_activity_summary(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getSummaryForDay(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_recent_activity_summary_for_day(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getSummaryForWeek(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_recent_activity_summary_for_week(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getSummaryForMonth(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_recent_activity_summary_for_month(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getSummaryForYear(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM get_recent_activity_summary_for_year(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { RecentActivityService };
