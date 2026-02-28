import type { Pool } from "pg";
import type { AIInsightsByActivity } from "../modules/ai-insights/types.js";

type AIInsightsData<
	T extends keyof AIInsightsByActivity = keyof AIInsightsByActivity
> = Promise<AIInsightsByActivity[T] | unknown>;

class AIInsightsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	// ALL
	async getAIActivityInsights(
		userID: string,
		startDate: string,
		endDate: string
	) {
		try {
			const query = `SELECT * FROM get_ai_insights_for_all_activity($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getAIStrengthInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Strength"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_strength($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAICardioInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Cardio"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_cardio($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAIStretchInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Stretch"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_stretch($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAIWalkInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Walk"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_walk($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAITimedInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Timed"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_timed($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getAIOtherInsights(
		userID: string,
		startDate: string,
		endDate: string
	): AIInsightsData<"Other"> {
		try {
			const query = `SELECT * FROM get_ai_insights_data_for_other($1, $2, $3) as data`;
			const results = await this.#db.query(query, [userID, startDate, endDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { AIInsightsService };
