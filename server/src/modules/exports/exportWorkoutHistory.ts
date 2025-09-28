import { exportsService } from "../../services/index.js";
import type { ExportFormat, UserRangeParams } from "../types.js";
import { parse as parseToCsv } from "json2csv";

export type ExportCSVResp = Promise<string | unknown>;
export type ExportJSONResp = Promise<Array<any> | unknown>;

const exportWorkoutHistory = async (params: UserRangeParams): ExportCSVResp => {
	const type = "workout-history";
	const { userID, startDate, endDate } = params;
	const dbParams = [userID, startDate, endDate];
	const results = await exportsService.exportHistory(type, dbParams);

	if (results instanceof Error) {
		return results;
	}

	if (!results) {
		return new Error(`No results were returned: ${results}`);
	}

	const csvData = parseToCsv(results);

	return csvData;
};

export { exportWorkoutHistory };
