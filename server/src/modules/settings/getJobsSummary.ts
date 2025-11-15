import { jobsService } from "../../services/index.js";

export type JobStatus = "SUCCESS" | "FAILED" | "SKIPPED";

export interface JobRunDB {
	id: number;
	run_id: string;
	schedule_id: number;
	status: JobStatus;
	message: string;
	refresh_until: string | null;
	started_at: string;
	completed_at: string;
	created_at: string;
	was_batch: boolean;
}
export interface JobRun {
	id: number;
	runID: string;
	scheduleID: number;
	status: JobStatus;
	message: string;
	refreshUntil: string | null;
	startedAt: string;
	completedAt: string;
	createdAt: string;
	wasBatch: boolean;
}
export interface JobSummaryDB {
	run_id: string;
	succeeded: number;
	failed: number;
	skipped: number;
	total: number;
	started_at: string;
	ended_at: string;
}
export interface JobSummary {
	runID: string;
	succeeded: number;
	failed: number;
	skipped: number;
	total: number;
	startedAt: string;
	endedAt: string;
}

const normalizeJobRefreshes = (results: JobRunDB[]): JobRun[] => {
	if (!results || !results.length) return [];

	const newResults: JobRun[] = results.map((run) => ({
		id: run.id,
		runID: run.run_id,
		scheduleID: run.schedule_id,
		status: run.status,
		message: run.message,
		refreshUntil: run.refresh_until,
		startedAt: run.started_at,
		completedAt: run.completed_at,
		createdAt: run.created_at,
		wasBatch: run.was_batch,
	}));

	return newResults;
};

const normalizeJobSummaries = (summaries: JobSummaryDB[]): JobSummary[] => {
	if (!summaries || !summaries.length) return [];

	const newSummaries: JobSummary[] = summaries.map((item) => ({
		runID: item.run_id,
		succeeded: item.succeeded,
		failed: item.failed,
		skipped: item.skipped,
		total: item.total,
		startedAt: item.started_at,
		endedAt: item.ended_at,
	}));

	return newSummaries;
};

const getJobsSummary = async () => {
	const result = await jobsService.getRefreshesSummary();

	if (result instanceof Error) {
		return result;
	}

	const { refreshes, summaries } = result;

	const runs = normalizeJobRefreshes(refreshes);
	const details = normalizeJobSummaries(summaries);

	return {
		refreshes: runs,
		summaries: details,
	};
};

export { getJobsSummary };
