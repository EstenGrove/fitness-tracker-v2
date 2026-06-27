import StrengthMetricsSummary from "../components/metrics-cards/StrengthMetricsSummary";
import StrengthRepsMetrics from "../components/metrics-cards/StrengthRepsMetrics";
import StrengthSetsMetrics from "../components/metrics-cards/StrengthSetsMetrics";
import StrengthVolumeMetrics from "../components/metrics-cards/StrengthVolumeMetrics";
import {
	StrengthMetrics,
	StrengthMetricsCardDataMap,
	StretchMetricsCardDataMap,
	TimedMetricsCardDataMap,
	WalkMetricsCardDataMap,
	WalkMetrics,
	OtherMetricsCardDataMap,
	ExerciseMetrics,
	CardioMetricsCardDataMap,
	ActivityMetrics,
	ActivityMetricsCardDataMap,
} from "../features/metrics/types";
import { Activity } from "../features/shared/types";
import { RangeParams } from "../features/types";
import { MappedCarouselCard } from "./utils_carousel";
import { currentEnv, metricsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import { getDistanceBetweenDates } from "./utils_dates";
import StrengthDurationMetrics from "../components/metrics-cards/StrengthDurationMetrics";
import MetricsTitleCard from "../components/carousel-cards/MetricsTitleCard";

export type ActivityMetricsAfterParams = {
	activityType: Activity;
	workoutID: number;
	historyID: number;
	range: RangeParams;
};

const fetchActivityMetricsAfterWorkout = async (
	userID: string,
	params: ActivityMetricsAfterParams,
) => {
	const { activityType, workoutID, historyID, range } = params;
	const { startDate, endDate } = range;
	let url = currentEnv.base + metricsApis.getActivityMetricsAfterWorkout;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ startDate, endDate });
	url +=
		"&" +
		new URLSearchParams({
			workoutID: String(workoutID),
			historyID: String(historyID),
		});

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchActivityMetricsData = async (
	userID: string,
	params: ActivityMetricsAfterParams,
) => {
	const { activityType, workoutID, historyID, range } = params;
	const { startDate, endDate } = range;
	let url = currentEnv.base + metricsApis.getActivityMetricsData;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ workoutID: String(workoutID) });
	url += "&" + new URLSearchParams({ historyID: String(historyID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const getStrengthMetricsCards = (
	data: StrengthMetrics,
): MappedCarouselCard<StrengthMetricsCardDataMap>[] => {
	const { range } = data;
	const days = getDistanceBetweenDates("days", range);
	const titleCard = {
		id: 0,
		kind: "Title",
		data: {
			title: "How does this session compare to your previous sessions?",
			desc: `Your comparison against the last ${days} days.`,
		},
		render: MetricsTitleCard,
	};
	const summaryCard = {
		id: 1,
		kind: "Summary",
		data,
		render: StrengthMetricsSummary,
	};
	const setsCard = {
		id: 2,
		kind: "Sets",
		data,
		render: StrengthSetsMetrics,
	};
	const repsCard = {
		id: 3,
		kind: "Reps",
		data,
		render: StrengthRepsMetrics,
	};
	const volumeCard = {
		id: 4,
		kind: "Volume",
		data,
		render: StrengthVolumeMetrics,
	};
	const durationCard = {
		id: 5,
		kind: "Duration",
		data,
		render: StrengthDurationMetrics,
	};

	return [
		titleCard,
		summaryCard,
		setsCard,
		repsCard,
		volumeCard,
		durationCard,
	] as MappedCarouselCard<StrengthMetricsCardDataMap>[];
};

const getWalkMetricsCards = (
	data: WalkMetrics,
): MappedCarouselCard<WalkMetricsCardDataMap>[] => {
	return [];
};

const getCardioMetricsCards = (
	data: ExerciseMetrics,
): MappedCarouselCard<CardioMetricsCardDataMap>[] => {
	return [];
};

const getStretchMetricsCards = (
	data: ExerciseMetrics,
): MappedCarouselCard<StretchMetricsCardDataMap>[] => {
	return [];
};

const getTimedMetricsCards = (
	data: ExerciseMetrics,
): MappedCarouselCard<TimedMetricsCardDataMap>[] => {
	return [];
};

const getOtherMetricsCards = (
	data: ExerciseMetrics,
): MappedCarouselCard<OtherMetricsCardDataMap>[] => {
	return [];
};

const getActivityMetricsCards = (
	activityType: Activity,
	data: ActivityMetrics,
): MappedCarouselCard<ActivityMetricsCardDataMap>[] => {
	switch (activityType) {
		case "Strength": {
			const strengthCards = getStrengthMetricsCards(data as StrengthMetrics);
			return strengthCards as MappedCarouselCard<ActivityMetricsCardDataMap>[];
		}
		case "Walk": {
			const walkCards = getWalkMetricsCards(data as WalkMetrics);
			return walkCards as MappedCarouselCard<ActivityMetricsCardDataMap>[];
		}
		case "Cardio": {
			const cardioCards = getCardioMetricsCards(data as ExerciseMetrics);
			return cardioCards as MappedCarouselCard<ActivityMetricsCardDataMap>[];
		}
		case "Stretch": {
			const stretchCards = getStretchMetricsCards(data as ExerciseMetrics);
			return stretchCards as MappedCarouselCard<ActivityMetricsCardDataMap>[];
		}
		default: {
			return [] as MappedCarouselCard<ActivityMetricsCardDataMap>[];
		}
	}
};

export {
	fetchActivityMetricsAfterWorkout,
	fetchActivityMetricsData,
	getStrengthMetricsCards,
	getWalkMetricsCards,
	getCardioMetricsCards,
	getStretchMetricsCards,
	getTimedMetricsCards,
	getOtherMetricsCards,
	// Wrapper around all activity type cards
	getActivityMetricsCards,
};
