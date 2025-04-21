import type { PillSummary, PillSummaryDB } from "./types.ts";

const normalizePillSummary = (summary: PillSummaryDB): PillSummary => {
	const client: PillSummary = {
		scheduleID: summary.schedule_id,
		totalPills: summary.total_pills,
		totalPillsTaken: summary.total_pills_taken,
		totalPillsTakenToday: summary.total_pills_taken_today,
		totalPillsRemaining: summary.total_pills_remaining,
		daysLeft: summary.days_left,
	};

	return client;
};

export { normalizePillSummary };
