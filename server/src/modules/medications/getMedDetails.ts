import { medicationsService } from "../../services/index.js";
import { normalizeMedLogs } from "./medLogs.js";
import type { MedDetailsDB } from "./types.js";
import { normalizeMedSchedule, normalizeUserMed } from "./userMeds.js";

const getMedDetails = async (userID: string, medID: number) => {
	const rawDetails = (await medicationsService.getMedDetails(
		userID,
		medID
	)) as MedDetailsDB;

	if (rawDetails instanceof Error) {
		return rawDetails;
	}

	const userMed = normalizeUserMed(rawDetails.medication);
	const schedule = normalizeMedSchedule(rawDetails.schedule);
	const logs = normalizeMedLogs(rawDetails.logs);

	return {
		medication: userMed,
		schedule: schedule,
		logs: logs,
	};
};

export { getMedDetails };
