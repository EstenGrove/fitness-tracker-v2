import type { Pool } from "pg";
import type { UserDB } from "../modules/user/types.ts";

export type UserDBResp = Promise<UserDB | unknown>;
export type UserExistsResp = Promise<{ is_active_user: boolean } | unknown>;

class UserService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async userExists(username: string, password: string): UserExistsResp {
		try {
			const query = `SELECT * FROM user_exists(
				$1,
				$2
			) as data`;
			const results = await this.#db.query(query, [username, password]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getUserByLogin(username: string, password: string): UserDBResp {
		try {
			const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
			const results = await this.#db.query(query, [username, password]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getUserByID(userID: string): UserDBResp {
		try {
			const query = `SELECT * FROM users WHERE user_id = $1`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { UserService };
