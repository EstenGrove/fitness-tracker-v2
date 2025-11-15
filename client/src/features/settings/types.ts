import { SettingOption } from "../../utils/utils_settings";

export interface SettingCategory {
	id: number;
	name: string;
	desc: string;
	label: string;
	isActive: boolean;
	createdAt: string;
}
export interface SettingCategoryItem {
	id: number;
	categoryID: number;
	label: string;
	route: string;
	isActive: boolean;
	createdAt: string;
}

export interface SettingsNavsInfo {
	categories: SettingCategory[];
	categoryItems: SettingCategoryItem[];
	settingsItems: SettingOption[];
}

export type JobsStatus = "SUCCESS" | "FAILED" | "SKIPPED";

export interface JobsRefresh {
	id: number;
	runID: number;
	scheduleID: number;
	status: JobsStatus;
	message: string;
	refreshUntil: string | null;
	startedAt: string;
	completedAt: string;
	createdAt: string;
	wasBatch: boolean;
}

export interface JobsSummary {
	runID: number;
	succeeded: number;
	failed: number;
	skipped: number;
	total: number;
	startedAt: string;
	endedAt: string;
}

export interface JobsRefreshSummary {
	refreshes: JobsRefresh[];
	summaries: JobsSummary[];
}
