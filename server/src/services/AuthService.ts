import type { Pool } from "pg";
import type { LoggedInDB } from "../modules/auth/types.js";

export type LoggedInDBResp = Promise<LoggedInDB | unknown>;
export type LoggedOutDBResp = Promise<LoggedOutDBResp | unknown>;

class AuthService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getActiveSession(userID: string) {
		try {
			const query = `SELECT * FROM get_active_session($1) as data`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}

	async isLoggedIn(userID: string, targetDate: string) {
		try {
			const query = `SELECT * FROM is_logged_in(
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

	async login(
		username: string,
		password: string,
		token: string
	): LoggedInDBResp {
		try {
			const query = `SELECT * FROM login_user(
        $1,
        $2,
        $3
      ) as data`;
			const results = await this.#db.query(query, [username, password, token]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async logout(userID: string, sessionID: string): LoggedOutDBResp {
		try {
			const query = `SELECT * FROM logout_user(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, sessionID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async refresh(userID: string, sessionID: string) {
		try {
			const query = `SELECT * FROM refresh_auth(
        $1,
        $2
      ) as data`;
			const results = await this.#db.query(query, [userID, sessionID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { AuthService };
