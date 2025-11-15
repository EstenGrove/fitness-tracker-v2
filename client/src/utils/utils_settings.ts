import { JobsRefreshSummary } from "../features/settings/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, settingsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type SettingCategory =
	| "Exports"
	| "Advanced"
	| "Account"
	| "Application";

export interface SettingOption {
	id: string | number;
	label: string;
	route?: string;
	category: SettingCategory;
	onClick?: () => void;
}

export type SettingItemProps = {
	option: SettingOption;
	onSelect: () => void;
};

export type SettingsByCategory = Record<SettingCategory, SettingOption[]>;

export type JobsSummaryResp = AsyncResponse<JobsRefreshSummary>;

export interface SettingsData {
	settings: SettingOption[];
}

export interface SettingInfo {
	name: string;
	isEnabled: boolean;
}

// Fetches our setting categories, items & UI-formatted items.
const fetchSettingNavOptions = async (userID: string) => {
	let url = currentEnv.base + settingsApis.navItems;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Fetch all settings
const fetchSettings = async (userID: string) => {
	let url = currentEnv.base + settingsApis.all;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Fetch info about a given setting: '/settings/theme', '/settings/jobs' etc.
const fetchSettingInfo = async (userID: string, path: string) => {
	let url = currentEnv.base + path;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchJobsSummary = async (userID: string): JobsSummaryResp => {
	// let url = currentEnv.base + jobsApis.summary;
	let url = currentEnv.base + settingsApis.jobs;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export {
	fetchSettingNavOptions,
	fetchSettings,
	fetchSettingInfo,
	fetchJobsSummary,
};
