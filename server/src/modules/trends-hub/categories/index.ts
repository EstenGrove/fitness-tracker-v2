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
import { buildStrengthData } from "./strength.js";
import { buildCardioData } from "./cardio.js";
import { buildWalkingData } from "./walking.js";
import { buildEffortData } from "./effort.js";

/**
 * CATEGORY REGISTRY
 * - The single place that maps a category to its data: fetch the raw SQL output, then build it
 * - Adding a category = a SQL fn, a builder in './<category>.ts' & one entry here
 * - Order here = order of the cards on the hub
 * - null = no data in either period (eg. no strength workouts): the hub hides the category
 */

export type GetCategoryData = (
	userID: string,
	periodKey: TrendPeriodKey,
) => Promise<TrendCategoryData | null | Error>;

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
	strength: async (userID, periodKey) => {
		const raw = await trendsHubService.getStrength(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildStrengthData(raw, periodKey);
	},
	// Cardio & walking come from the same query; each category reads its own half
	cardio: async (userID, periodKey) => {
		const raw = await trendsHubService.getCardioWalking(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildCardioData(raw, periodKey);
	},
	walking: async (userID, periodKey) => {
		const raw = await trendsHubService.getCardioWalking(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildWalkingData(raw, periodKey);
	},
	effort: async (userID, periodKey) => {
		const raw = await trendsHubService.getEffort(
			userID,
			PERIOD_WEEKS[periodKey],
		);
		if (raw instanceof Error) return raw;

		return buildEffortData(raw, periodKey);
	},
};

const TREND_CATEGORY_KEYS = Object.keys(TREND_CATEGORIES) as TrendCategoryKey[];

const isTrendCategoryKey = (value: unknown): value is TrendCategoryKey => {
	// 'Object.hasOwn' (not 'in'), so prototype keys like "toString" aren't accepted
	return typeof value === "string" && Object.hasOwn(TREND_CATEGORIES, value);
};

export { TREND_CATEGORIES, TREND_CATEGORY_KEYS, isTrendCategoryKey };
