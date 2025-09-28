import { AsyncResponse, RangeParams } from "../features/types";
import { currentEnv, exportApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type ExportResp = AsyncResponse<Blob | unknown>;

const exportWorkoutHistory = async (
	userID: string,
	dateRange: RangeParams
): ExportResp => {
	let url = currentEnv.base + exportApis.workoutHistory;
	url += "?" + new URLSearchParams({ userID, ...dateRange });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.blob();
		return response;
	} catch (error) {
		return error;
	}
};

// File Utils

const downloadFile = (data: Blob | File, filename: string = "History.csv") => {
	const link = document.createElement("a");
	const url = window.URL.createObjectURL(data);
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();

	window.URL.revokeObjectURL(url);
};

export { exportWorkoutHistory, downloadFile };
