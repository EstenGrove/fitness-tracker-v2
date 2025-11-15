import type { Pool } from "pg";

class JobsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getRefreshesSummary() {
		try {
			const query = `SELECT * FROM get_refresh_schedules_summary_json()`;
			const results = await this.#db.query(query, []);
			const rows = results?.rows?.[0]?.get_refresh_schedules_summary_json;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { JobsService };
