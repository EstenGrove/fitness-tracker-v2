import type { Pool } from "pg";

class WorkoutsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
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
}

export { WorkoutsService };
