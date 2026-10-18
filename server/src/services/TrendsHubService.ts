import type { Pool } from "pg";
import type {
	RawAdherence,
	RawCardioWalking,
	RawConsistency,
	RawEffort,
	RawStrength,
	RawVolume,
	RawWorkoutStreakStatus,
} from "../modules/trends-hub/types.js";

// The 'get_trends_*' SQL functions (db/migrations/003_trends_hub.sql); fixed names, never user input
type TrendsFunctionName =
	| "get_trends_consistency"
	| "get_trends_volume"
	| "get_trends_adherence"
	| "get_trends_strength"
	| "get_trends_effort"
	| "get_trends_cardio_walking";

class TrendsHubService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	// All 'get_trends_*' functions share the same (userID, asOfDate, numOfWeeks) signature
	async #getTrendsData<T>(
		fnName: TrendsFunctionName,
		userID: string,
		weeks: number,
	): Promise<T | Error> {
		try {
			const query = `SELECT * FROM ${fnName}($1, CURRENT_DATE, $2) as data`;
			const results = await this.#db.query(query, [userID, weeks]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error as Error;
		}
	}

	async getConsistency(
		userID: string,
		weeks: number,
	): Promise<RawConsistency | Error> {
		return this.#getTrendsData("get_trends_consistency", userID, weeks);
	}

	async getVolume(userID: string, weeks: number): Promise<RawVolume | Error> {
		return this.#getTrendsData("get_trends_volume", userID, weeks);
	}

	async getAdherence(
		userID: string,
		weeks: number,
	): Promise<RawAdherence | Error> {
		return this.#getTrendsData("get_trends_adherence", userID, weeks);
	}

	async getStrength(
		userID: string,
		weeks: number,
	): Promise<RawStrength | Error> {
		return this.#getTrendsData("get_trends_strength", userID, weeks);
	}

	async getEffort(userID: string, weeks: number): Promise<RawEffort | Error> {
		return this.#getTrendsData("get_trends_effort", userID, weeks);
	}

	async getCardioWalking(
		userID: string,
		weeks: number,
	): Promise<RawCardioWalking | Error> {
		return this.#getTrendsData("get_trends_cardio_walking", userID, weeks);
	}

	// Same fn as StreaksService, but dates come back as "YYYY-MM-DD" text (pg would parse them into
	// local-time Date objects), along with the DB's own CURRENT_DATE
	async getWorkoutStreakStatus(
		userID: string,
	): Promise<RawWorkoutStreakStatus | Error> {
		try {
			const query = `
				SELECT
					CURRENT_DATE::text AS "today",
					s.current_streak AS "days",
					s.streak_end::text AS "endDate"
				FROM (SELECT 1) AS one
				LEFT JOIN get_current_workout_streak($1) AS s ON true
			`;
			const results = await this.#db.query(query, [userID]);
			const row = results?.rows?.[0];
			const hasStreak = row?.days !== null && row?.days !== undefined;

			return {
				today: row?.today,
				streak: hasStreak ? { days: row.days, endDate: row.endDate } : null,
			};
		} catch (error) {
			return error as Error;
		}
	}
}

export { TrendsHubService };
