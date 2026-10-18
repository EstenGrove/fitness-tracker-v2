import { DEFAULT_PERIOD } from "./config.js";
import { isTrendPeriodKey } from "./utils.js";
import { isTrendCategoryKey, TREND_CATEGORIES } from "./categories/index.js";
import type { TrendCategoryData } from "./types.js";

// A single category's full data (for its detail page). 'period' defaults to 12W when omitted.
// - null = no data in either period (the detail page shows an empty state)
const getTrendCategory = async (
	userID: string,
	category: string | undefined,
	period: string | undefined = DEFAULT_PERIOD,
): Promise<TrendCategoryData | null | Error> => {
	if (!isTrendCategoryKey(category)) {
		return new Error(`Invalid trend category: '${category}'`);
	}
	if (!isTrendPeriodKey(period)) {
		return new Error(`Invalid trend period: '${period}'`);
	}

	const getCategoryData = TREND_CATEGORIES[category];
	return getCategoryData(userID, period);
};

export { getTrendCategory };
