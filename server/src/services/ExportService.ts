import type { Pool } from "pg";
import type { UserRangeParams } from "../modules/types.js";

export type ExportQueryType =
	| "workout-history"
	| "medication-history"
	| "session-history";

export type ExportQueries = {
	[K in ExportQueryType]: string;
};

const EXPORT_QUERIES: ExportQueries = {
	"workout-history": "SELECT * FROM get_workout_history_for_range($1, $2, $3)",
	"medication-history":
		"SELECT * FROM get_medication_logs_for_range($1, $2, $3, $4)",
	"session-history": "SELECT * FROM get_session_history_for_range($1, $2, $3)",
};

class ExportService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async exportHistory(type: ExportQueryType, params: Array<any>) {
		try {
			const query = EXPORT_QUERIES[type];
			const results = await this.#db.query(query, params);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { ExportService };
