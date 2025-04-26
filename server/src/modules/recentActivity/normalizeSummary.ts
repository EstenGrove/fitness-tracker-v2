import type { DateRange } from "../types.ts";
import { normalizeCardioSummary } from "./cardioSummary.ts";
import { normalizeOtherSummary } from "./otherSummary.ts";
import { normalizeStepsSummary } from "./stepsSummary.ts";
import { normalizeStrengthSummary } from "./strengthSummary.ts";
import { normalizeStretchSummary } from "./stretchSummary.ts";
import { normalizeTimedSummary } from "./timedSummary.ts";
import { normalizeTotalMins } from "./totalMins.ts";
import type { ActivitySummaryFor, ActivitySummaryForDB } from "./types.ts";

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
