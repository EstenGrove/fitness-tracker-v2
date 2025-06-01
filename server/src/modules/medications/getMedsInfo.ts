import { medicationsService } from "../../services/index.js";
import type { MedsInfoResp } from "../../services/MedicationsService.js";
import type {
	Medication,
	MedicationDB,
	MedicationSchedule,
	MedicationScheduleDB,
	MedsInfoDB,
} from "./types.js";
import { normalizeMedSchedules, normalizeUserMeds } from "./userMeds.js";

const getMedsInfo = async (userID: string, targetDate: string) => {
	const rawInfo = (await medicationsService.getMedsInfo(
		userID,
		targetDate
	)) as MedsInfoDB;

	if (rawInfo instanceof Error) {
		return rawInfo;
	}

	const activeMeds = normalizeUserMeds(rawInfo.activeMeds);
	const activeSchedules = normalizeMedSchedules(rawInfo.activeSchedules);

	return {
		activeMeds,
		activeSchedules,
	};
};

export { getMedsInfo };
