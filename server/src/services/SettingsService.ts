import type { Pool } from "pg";

class SettingsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getNavItems() {
		try {
			const query = `SELECT * FROM get_settings_categories_and_items()`;
			const results = await this.#db.query(query, []);
			const rows = results?.rows?.[0]?.get_settings_categories_and_items;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getAllSettings(userID: string) {
		try {
			const query = `SELECT * FROM get_all_settings($1)`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { SettingsService };
