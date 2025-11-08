import type { Pool } from "pg";

class ChatSuggestionsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getSuggestions(userID: string) {
		try {
			const query = `SELECT * FROM get_chat_suggestions($1)`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { ChatSuggestionsService };
