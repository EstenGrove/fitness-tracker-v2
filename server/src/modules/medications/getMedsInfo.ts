import { medicationsService } from "../../services/index.ts";
import type { MedsInfoResp } from "../../services/MedicationsService.ts";
import type {
	Medication,
	MedicationDB,
	MedicationSchedule,
	MedicationScheduleDB,
	MedsInfoDB,
} from "./types.ts";
import { normalizeMedSchedules, normalizeUserMeds } from "./userMeds.ts";

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
