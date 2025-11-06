import type { Pool } from "pg";
import type { LogMedBody, MedsInfoDB } from "../modules/medications/types.js";

interface PillSummaryArgs {
	scheduleID: number;
	targetDate: string;
}
interface MedSummaryArgs {
	medID: number;
	targetDate: string;
}

export interface NewMedScheduleArgs {
	startDate: string;
	endDate: string;
	dosage: number;
	dosageDesc: string;
	frequency: number;
	quantity: number;
	medID: number;
	userID: string;
}

interface MedLogRangeArgs {
	medID: number;
	startDate: string;
	endDate: string;
}

export type MedsInfoResp = Promise<MedsInfoDB | unknown>;

class MedicationsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getMedDetails(userID: string, medID: number) {
		try {
			const query = `SELECT * FROM get_medication_details(
				$1,
				$2
			) as data`;
			const results = await this.#db.query(query, [userID, medID]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getMedLogsByRange(userID: string, params: MedLogRangeArgs) {
		const { medID, startDate, endDate } = params;
		try {
			const query = `SELECT * FROM get_medication_logs_by_range(
				$1,
				$2,
				$3,
				$4
			)`;
			const results = await this.#db.query(query, [
				userID,
				medID,
				startDate,
				endDate,
			]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getMedsInfo(userID: string, targetDate: string): MedsInfoResp {
		try {
			const query = `SELECT * FROM get_meds_info(
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

	async logMedication(userID: string, body: LogMedBody) {
		try {
			const { medID, scheduleID, loggedAt, amountTaken, action } = body;
			const query = `SELECT * FROM log_medication(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )`;
			const values = [userID, medID, scheduleID, loggedAt, amountTaken, action];
			const results = await this.#db.query(query, values);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getUserMeds(userID: string) {
		try {
			const query = `SELECT * FROM get_user_meds($1)`;
			const results = await this.#db.query(query, [userID]);
			const rows = results?.rows;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getActiveMedSchedule(
		userID: string,
		medID: number,
		targetDate: string
	) {
		try {
			const query = `SELECT * FROM get_active_medication_schedule(
        $1,
        $2,
        $3
      )`;
			const results = await this.#db.query(query, [userID, medID, targetDate]);
			const row = results?.rows?.[0];
			return row;
		} catch (error) {
			return error;
		}
	}

	async getPillSummaryByDate(userID: string, params: PillSummaryArgs) {
		const { scheduleID, targetDate } = params;
		try {
			const query = `SELECT * FROM get_pill_summary_by_date(
        $1,
        $2,
        $3
      )`;
			const results = await this.#db.query(query, [
				userID,
				scheduleID,
				targetDate,
			]);
			const rows = results?.rows?.[0];
			return rows;
		} catch (error) {
			return error;
		}
	}

	async getMedSummaryByDate(userID: string, params: MedSummaryArgs) {
		const { medID, targetDate } = params;
		try {
			const query = `SELECT * FROM get_medication_summary_by_date(
        $1,
        $2,
        $3
      ) as data`;
			const results = await this.#db.query(query, [userID, medID, targetDate]);
			const rows = results?.rows?.[0]?.data;
			return rows;
		} catch (error) {
			return error;
		}
	}

	async createMedSchedule(params: NewMedScheduleArgs) {
		try {
			const query = `SELECT * FROM create_med_schedule($1)`;
			const results = await this.#db.query(query, [params]);
			const data = results?.rows?.[0]?.data;
			return data;
		} catch (error) {
			return error;
		}
	}
}

export { MedicationsService };
