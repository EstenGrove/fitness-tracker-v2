import type { TrendChangeType, TrendPeriodKey } from "./types.js";

// Number of completed weeks in each period (passed to the 'get_trends_*' SQL functions)
export const PERIOD_WEEKS: Record<TrendPeriodKey, number> = {
	"4W": 4,
	"12W": 12,
	"6M": 26,
	"1Y": 52,
};

// Used in insight text, eg. "up 6 pts from the previous 12 weeks"
export const PERIOD_LABELS: Record<TrendPeriodKey, string> = {
	"4W": "4 weeks",
	"12W": "12 weeks",
	"6M": "6 months",
	"1Y": "year",
};

export const DEFAULT_PERIOD: TrendPeriodKey = "12W";

// Thresholds by change type: relative = %, points = percentage points
type ChangeThresholds = Record<TrendChangeType, number>;

// Changes smaller than this read as "steady" (NEUTRAL tone)
const STEADY_CHANGE: ChangeThresholds = { relative: 10, points: 5 };
// Momentum (last N weeks vs the rest of the period) needs a bigger change to be worth mentioning
const MOMENTUM_MIN_CHANGE: ChangeThresholds = { relative: 15, points: 5 };

// Shared thresholds. Category-specific thresholds live at the top of each category file.
export const TRENDS_HUB_CONFIG = {
	STEADY_CHANGE,
	// Weeks of data needed before pattern insights (best day, etc.)
	MIN_WEEKS_OF_HISTORY: 4,
	// Insights shown per category
	MAX_INSIGHTS: 3,
	// Momentum: the last N weeks vs the rest of the period (only for periods longer than N weeks)
	MOMENTUM_WEEKS: 4,
	MOMENTUM_MIN_CHANGE,
};
