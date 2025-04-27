import type { PillSummary, PillSummaryDB } from "./types.ts";

const normalizePillSummary = (summary: PillSummaryDB): PillSummary => {
	const client: PillSummary = {
		scheduleID: summary.schedule_id,
		totalPills: summary.total_pills,
		pillsTaken: summary.total_pills_taken,
		pillsTakenToday: summary.total_pills_taken_today,
		pillsRemaining: summary.total_pills_remaining,
		daysLeft: summary.days_left,
	};

	return client;
};

export { normalizePillSummary };
