import type { Pool } from "pg";
import type { DashboardSummaryDB } from "../modules/dashboard/types.ts";

export type SummaryResp = Promise<DashboardSummaryDB | unknown>;

class DashboardService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getDashboardSummary(userID: string, targetDate: string): SummaryResp {
		try {
			const query = `SELECT * FROM get_dashboard_summary($1, $2) as data`;
			const values = [userID, targetDate];
			const result = await this.#db.query(query, values);
			const rows = result?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { DashboardService };
