import type { Pool } from "pg";

class UserService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async login(username: string, password: string) {
		try {
			const query = `SELECT * FROM login_user(
        $1,
        $2
      )`;
			const results = await this.#db.query(query, [username, password]);
			const row = results?.rows?.[0];

			return row;
		} catch (error) {
			return error;
		}
	}
}

export { UserService };
