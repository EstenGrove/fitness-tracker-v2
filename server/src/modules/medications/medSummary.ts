import { normalizeMedLogs } from "./medLogs.ts";
import { normalizePillSummary } from "./pillSummary.ts";
import type { MedSummary, MedSummaryDB } from "./types.ts";

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
