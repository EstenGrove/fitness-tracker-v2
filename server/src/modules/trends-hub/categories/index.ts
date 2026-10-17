import { trendsHubService } from "../../../services/index.js";
import { PERIOD_WEEKS } from "../config.js";
import type {
	TrendCategoryData,
	TrendCategoryKey,
	TrendPeriodKey,
} from "../types.js";
import { buildConsistencyData } from "./consistency.js";
import { buildVolumeData } from "./volume.js";
import { buildAdherenceData } from "./adherence.js";

/**
 * CATEGORY REGISTRY
 * - The single place that maps a category to its data: fetch the raw SQL output, then build it
 * - Adding a category = a SQL fn, a builder in './<category>.ts' & one entry here
 * - Order here = order of the cards on the hub
 */

export type GetCategoryData = (
	userID: string,
	periodKey: TrendPeriodKey,
) => Promise<TrendCategoryData | Error>;

const TREND_CATEGORIES: Record<TrendCategoryKey, GetCategoryData> = {
	consistency: async (userID, periodKey) => {
		const weeks = PERIOD_WEEKS[periodKey];
		const [raw, streakStatus] = await Promise.all([
			trendsHubService.getConsistency(userID, weeks),
			trendsHubService.getWorkoutStreakStatus(userID),
		]);
		if (raw instanceof Error) return raw;
		if (streakStatus instanceof Error) return streakStatus;

		return buildConsistencyData(raw, periodKey, streakStatus);
	},
	volume: async (userID, periodKey) => {
		const raw = await trendsHubService.getVolume(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildVolumeData(raw, periodKey);
	},
	adherence: async (userID, periodKey) => {
		const raw = await trendsHubService.getAdherence(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildAdherenceData(raw, periodKey);
	},
};

const TREND_CATEGORY_KEYS = Object.keys(TREND_CATEGORIES) as TrendCategoryKey[];

const isTrendCategoryKey = (value: unknown): value is TrendCategoryKey => {
	// 'Object.hasOwn' (not 'in'), so prototype keys like "toString" aren't accepted
	return typeof value === "string" && Object.hasOwn(TREND_CATEGORIES, value);
};

export { TREND_CATEGORIES, TREND_CATEGORY_KEYS, isTrendCategoryKey };
