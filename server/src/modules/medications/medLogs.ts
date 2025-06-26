import type { MedicationLog, MedicationLogDB } from "./types.js";

const normalizeMedLog = (log: MedicationLogDB): MedicationLog => {
	const client: MedicationLog = {
		logID: log.log_id,
		scheduleID: log.schedule_id,
		loggedAt: log.logged_at,
		dose: log.dose,
		notes: log.notes,
		createdDate: log.created_date,
	};
	return client;
};
const normalizeMedLogs = (logs: MedicationLogDB[]): MedicationLog[] => {
	if (!logs || !logs.length) return [];

	return logs.map(normalizeMedLog);
};

export { normalizeMedLog, normalizeMedLogs };
