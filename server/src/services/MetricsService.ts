import type { Pool } from "pg";
import type { DateRange } from "../modules/types.js";

export type ActivityMetricsParams = {
	workoutID: number;
	range: DateRange;
};

export type ActivitySessionMetricsParams = {
	historyID: number;
	workoutID?: number;
};

export type ActivityMetricsCompareParams = {
	historyID: number;
	workoutID: number;
	range: DateRange;
};

class MetricsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	// SESSION METRICS
	async getWalkSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_walk_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_strength_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_stretch_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCardioSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_cardio_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_timed_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherSessionMetrics(
		userID: string,
		params: ActivitySessionMetricsParams,
	) {
		const { historyID, workoutID } = params;
		try {
			const query = `SELECT * FROM get_other_session_metrics($1, $2, $3) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	// HISTORICAL METRICS
	async getWalkHistoryMetrics(userID: string, params: ActivityMetricsParams) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_walk_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthHistoryMetrics(
		userID: string,
		params: ActivityMetricsParams,
	) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_strength_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchHistoryMetrics(
		userID: string,
		params: ActivityMetricsParams,
	) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_stretch_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCardioHistoryMetrics(userID: string, params: ActivityMetricsParams) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_cardio_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedHistoryMetrics(userID: string, params: ActivityMetricsParams) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_timed_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherHistoryMetrics(userID: string, params: ActivityMetricsParams) {
		const { workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_other_history_metrics($1, $2, $3, $4) as data`;
			const results = await this.#db.query(query, [
				userID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	// COMPARISON METRICS
	async getWalkComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_walk_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStrengthComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_strength_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getStretchComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_stretch_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getCardioComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_cardio_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getTimedComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_timed_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getOtherComparisonMetrics(
		userID: string,
		params: ActivityMetricsCompareParams,
	) {
		const { historyID, workoutID, range } = params;
		const { startDate, endDate } = range;
		try {
			const query = `SELECT * FROM get_other_metrics_comparison($1, $2, $3, $4, $5) as data`;
			const results = await this.#db.query(query, [
				userID,
				historyID,
				workoutID,
				startDate,
				endDate,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { MetricsService };
