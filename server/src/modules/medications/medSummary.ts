import { normalizeMedLogs } from "./medLogs.js";
import { normalizePillSummary } from "./pillSummary.js";
import type { MedSummary, MedSummaryDB } from "./types.js";

const normalizeMedSummary = (summary: MedSummaryDB): MedSummary => {
	const pillSummary = normalizePillSummary(summary.pillSummary);
	const logs = normalizeMedLogs(summary.medicationLogs);
	const client: MedSummary = {
		pillSummary: pillSummary,
		medicationLogs: logs,
	};

	return client;
};

export { normalizeMedSummary };
