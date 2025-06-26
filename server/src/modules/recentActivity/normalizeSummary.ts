import type { DateRange } from "../types.js";
import { normalizeCardioSummary } from "./cardioSummary.js";
import { normalizeOtherSummary } from "./otherSummary.js";
import { normalizeStepsSummary } from "./stepsSummary.js";
import { normalizeStrengthSummary } from "./strengthSummary.js";
import { normalizeStretchSummary } from "./stretchSummary.js";
import { normalizeTimedSummary } from "./timedSummary.js";
import { normalizeTotalMins } from "./totalMins.js";
import type { ActivitySummaryFor, ActivitySummaryForDB } from "./types.js";

const normalizeRecentSummary = (
	summary: ActivitySummaryForDB
): ActivitySummaryFor => {
	const { dateRange, totalMins, segments, summaries } = summary;

	const newSummary: ActivitySummaryFor = {
		dateRange: dateRange,
		segments: segments,
		totalMins: normalizeTotalMins(totalMins),
		summaries: {
			walkSummary: normalizeStepsSummary(summaries.walkSummary),
			strengthSummary: normalizeStrengthSummary(summaries.strengthSummary),
			stretchSummary: normalizeStretchSummary(summaries.stretchSummary),
			cardioSummary: normalizeCardioSummary(summaries.cardioSummary),
			timedSummary: normalizeTimedSummary(summaries.timedSummary),
			otherSummary: normalizeOtherSummary(summaries.otherSummary),
		},
	};

	return newSummary;
};

export { normalizeRecentSummary };
