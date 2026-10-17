import type { Pool } from "pg";
import type {
	AINewTrendNotice,
	AIPriorNotice,
	AITrendNotice,
	AIWeeklyTotalsData,
} from "../modules/trend-notices/types.js";

// 'week_start::text' keeps DATEs as "YYYY-MM-DD" (pg would otherwise parse them into local-time Date objects)
const NOTICE_COLUMNS = `
	notice_id AS "noticeID",
	user_id AS "userID",
	week_start::text AS "weekStart",
	direction,
	metrics,
	title,
	message,
	generated_by AS "generatedBy",
	created_at AS "createdAt",
	dismissed_at AS "dismissedAt"
`;

class TrendNoticesService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	// Weekly totals for the last 'weeks' completed weeks (week boundaries are decided by the DB)
	// - Pass 'lastWeekStart' to replay the weeks as of a past notice (defaults to the current week)
	async getWeeklyTotals(
		userID: string,
		weeks: number,
		lastWeekStart: string | null = null,
	): Promise<AIWeeklyTotalsData | Error> {
		try {
			const query = `
				SELECT * FROM get_weekly_workout_totals(
					$1,
					COALESCE($3::date + 7, CURRENT_DATE),
					$2
				) as data
			`;
			const results = await this.#db.query(query, [
				userID,
				weeks,
				lastWeekStart,
			]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error as Error;
		}
	}

	async getNotice(
		userID: string,
		weekStart: string,
	): Promise<AITrendNotice | null | Error> {
		try {
			const query = `
				SELECT ${NOTICE_COLUMNS}
				FROM workout_trend_notices
				WHERE user_id = $1 AND week_start = $2::date
			`;
			const results = await this.#db.query(query, [userID, weekStart]);
			return results?.rows?.[0] ?? null;
		} catch (error) {
			return error as Error;
		}
	}

	// Most recent notice within the last 'weeks' weeks (dismissed or not)
	async getLatestNotice(
		userID: string,
		lastWeekStart: string,
		weeks: number,
	): Promise<AITrendNotice | null | Error> {
		try {
			const query = `
				SELECT ${NOTICE_COLUMNS}
				FROM workout_trend_notices
				WHERE user_id = $1
					AND week_start > $2::date - ($3::int * 7)
					AND week_start <= $2::date
				ORDER BY week_start DESC
				LIMIT 1
			`;
			const results = await this.#db.query(query, [
				userID,
				lastWeekStart,
				weeks,
			]);
			return results?.rows?.[0] ?? null;
		} catch (error) {
			return error as Error;
		}
	}

	// Notices from the 'weeks' weeks before 'lastWeekStart' (for the cooldown check)
	async getRecentNotices(
		userID: string,
		lastWeekStart: string,
		weeks: number,
	): Promise<AIPriorNotice[] | Error> {
		try {
			const query = `
				SELECT week_start::text AS "weekStart", direction
				FROM workout_trend_notices
				WHERE user_id = $1
					AND week_start > $2::date - ($3::int * 7)
					AND week_start < $2::date
				ORDER BY week_start DESC
			`;
			const results = await this.#db.query(query, [
				userID,
				lastWeekStart,
				weeks,
			]);
			return results?.rows ?? [];
		} catch (error) {
			return error as Error;
		}
	}

	// Returns null if a notice already exists for this user/week (concurrent request won the race)
	async insertNotice(
		notice: AINewTrendNotice,
	): Promise<AITrendNotice | null | Error> {
		try {
			const query = `
				INSERT INTO workout_trend_notices
					(user_id, week_start, direction, metrics, title, message, generated_by)
				VALUES ($1, $2::date, $3, $4::jsonb, $5, $6, $7)
				ON CONFLICT (user_id, week_start) DO NOTHING
				RETURNING ${NOTICE_COLUMNS}
			`;
			const results = await this.#db.query(query, [
				notice.userID,
				notice.weekStart,
				notice.direction,
				JSON.stringify(notice.metrics),
				notice.title,
				notice.message,
				notice.generatedBy,
			]);
			return results?.rows?.[0] ?? null;
		} catch (error) {
			return error as Error;
		}
	}

	// Scoped to 'user_id' so users can only dismiss their own notices
	async dismissNotice(
		userID: string,
		noticeID: string,
		dismissedAt: string,
	): Promise<AITrendNotice | null | Error> {
		try {
			const query = `
				SELECT * FROM dismiss_ai_trend_notice($1, $2, $3::date)
			`;
			const results = await this.#db.query(query, [
				userID,
				noticeID,
				dismissedAt,
			]);
			return results?.rows?.[0] ?? null;
		} catch (error) {
			return error as Error;
		}
	}
}

export { TrendNoticesService };
