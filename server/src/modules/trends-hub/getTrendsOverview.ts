import { DEFAULT_PERIOD } from "./config.js";
import { isTrendPeriodKey } from "./utils.js";
import { TREND_CATEGORIES, TREND_CATEGORY_KEYS } from "./categories/index.js";
import type {
	TrendCategoryCard,
	TrendCategoryData,
	TrendsOverview,
} from "./types.js";

// A card = the category's headline KPI + its top insight (from data we already built)
const toCategoryCard = (data: TrendCategoryData): TrendCategoryCard => {
	return {
		category: data.category,
		kpi: data.kpis[0],
		insight: data.insights[0] ?? null,
	};
};

// The hub (/trends): every category in parallel. A category that fails is left out (& logged),
// so one bad query doesn't break the whole page. Only errors if every category fails.
const getTrendsOverview = async (
	userID: string,
	period: string | undefined = DEFAULT_PERIOD,
): Promise<TrendsOverview | Error> => {
	if (!isTrendPeriodKey(period)) {
		return new Error(`Invalid trend period: '${period}'`);
	}

	const results = await Promise.all(
		TREND_CATEGORY_KEYS.map((key) => TREND_CATEGORIES[key](userID, period)),
	);

	const loaded: TrendCategoryData[] = [];
	results.forEach((result, idx) => {
		if (result instanceof Error) {
			console.error(
				`[TRENDS HUB]: '${TREND_CATEGORY_KEYS[idx]}' failed`,
				result,
			);
			return;
		}
		loaded.push(result);
	});

	if (!loaded.length) {
		return new Error("Unable to load any trend categories");
	}

	return {
		period: loaded[0].period,
		cards: loaded.map(toCategoryCard),
	};
};

export { getTrendsOverview };
