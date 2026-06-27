import { metricsService } from "../../services/index.js";
import type { ActivityMetricsCompareParams } from "../../services/MetricsService.js";
import type { Activity } from "../types.js";

export type MetricsParams = ActivityMetricsCompareParams & {
	activityType: Activity;
};

const getWalkMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getWalkComparisonMetrics(userID, params);
	return metrics;
};

const getStrengthMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getStrengthComparisonMetrics(
		userID,
		params,
	);
	return metrics;
};

const getStretchMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getStretchComparisonMetrics(
		userID,
		params,
	);
	return metrics;
};

const getCardioMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getCardioComparisonMetrics(
		userID,
		params,
	);
	return metrics;
};

const getTimedMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getTimedComparisonMetrics(
		userID,
		params,
	);
	return metrics;
};

const getOtherMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const metrics = await metricsService.getOtherComparisonMetrics(
		userID,
		params,
	);
	return metrics;
};

// WRAPPER FN
const getActivityMetricsComparison = async (
	userID: string,
	params: MetricsParams,
) => {
	const { activityType } = params;
	switch (activityType) {
		case "Strength": {
			return await getStrengthMetricsComparison(userID, params);
		}
		case "Stretch": {
			return await getStretchMetricsComparison(userID, params);
		}
		case "Walk": {
			return await getWalkMetricsComparison(userID, params);
		}
		case "Cardio": {
			return await getCardioMetricsComparison(userID, params);
		}
		case "Timed": {
			return await getTimedMetricsComparison(userID, params);
		}
		case "Other": {
			return await getOtherMetricsComparison(userID, params);
		}
		default: {
			throw new Error(`Invalid activity type: ${activityType}`);
		}
	}
};

export {
	getStrengthMetricsComparison,
	getStretchMetricsComparison,
	getCardioMetricsComparison,
	getTimedMetricsComparison,
	getOtherMetricsComparison,
	getWalkMetricsComparison,
	// Activity Metrics Wrapper FN
	getActivityMetricsComparison,
};
