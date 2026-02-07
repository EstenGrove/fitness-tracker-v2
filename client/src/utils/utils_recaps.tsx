import { JSX, ReactNode } from "react";
import {
	StrengthRecapDetails,
	CardioRecapDetails,
	ActivityRecapDetails,
	WalkRecapDetails,
	TimedRecapDetails,
	OtherRecapDetails,
	StretchRecapDetails,
} from "../features/workout-recaps/types";
import { Activity } from "../features/shared/types";
import { ActivityRecapCard } from "../features/recaps/types";
import StrengthTitleCard from "../components/recaps-strength/StrengthTitleCard";
import StrengthTotalsCard from "../components/recaps-strength/StrengthTotalsCard";
import StretchTitleCard from "../components/recaps-stretch/StretchTitleCard";
import StretchTotalsCard from "../components/recaps-stretch/StretchTotalsCard";
import WalkTitleCard from "../components/recaps-walk/WalkTitleCard";
import WalkTotalsCard from "../components/recaps-walk/WalkTotalsCard";
import CardioTitleCard from "../components/recaps-cardio/CardioTitleCard";
import CardioTotalsCard from "../components/recaps-cardio/CardioTotalsCard";
import StrengthSetsCard from "../components/recaps-strength/StrengthSetsCard";
import WalkAveragesCard from "../components/recaps-walk/WalkAveragesCard";
import StrengthVolumeCard from "../components/recaps-strength/StrengthVolumeCard";
import CardioAveragesCard from "../components/recaps-cardio/CardioAveragesCard";
import StretchConsistencyCard from "../components/recaps-stretch/StretchConsistencyCard";

const renderContent = (content?: JSX.Element | ReactNode) => {
	if (content) {
		return content;
	}
	return null;
};

const getRecapStrengthCards = (
	data: StrengthRecapDetails,
): ActivityRecapCard<"Strength">[] => {
	const titleCard: ActivityRecapCard<"Strength"> = {
		id: 0,
		data,
		render: StrengthTitleCard,
	} as ActivityRecapCard<"Strength">;

	const totalsCard = {
		id: 1,
		data,
		render: StrengthTotalsCard,
	} as ActivityRecapCard<"Strength">;

	const avgCard = {
		id: 2,
		type: "Strength",
		data: data,
		render: StrengthVolumeCard,
	} as ActivityRecapCard<"Strength">;

	const setsCard = {
		id: 3,
		data,
		render: StrengthSetsCard,
	} as ActivityRecapCard<"Strength">;

	const strengthCards = [titleCard, totalsCard, avgCard, setsCard];

	return strengthCards;
};
const getRecapCardioCards = (
	data: CardioRecapDetails,
): ActivityRecapCard<"Cardio">[] => {
	const titleCard: ActivityRecapCard<"Cardio"> = {
		id: 0,
		type: "Cardio",
		data: data,
		render: CardioTitleCard,
	};
	const totalsCard: ActivityRecapCard<"Cardio"> = {
		id: 1,
		type: "Cardio",
		data: data,
		render: CardioTotalsCard,
	};
	const avgsCard: ActivityRecapCard<"Cardio"> = {
		id: 2,
		type: "Cardio",
		data: data,
		render: CardioAveragesCard,
	};

	const cardioCards = [titleCard, totalsCard, avgsCard];

	return cardioCards;
};
const getRecapWalkCards = (data: WalkRecapDetails) => {
	const titleCard = {
		id: 0,
		type: "Title",
		data: data,
		render: WalkTitleCard,
	};
	const totalsCard = {
		id: 1,
		type: "Walk",
		data: data,
		render: WalkTotalsCard,
	};
	const avgCard = {
		id: 2,
		type: "Walk",
		data: data,
		render: WalkAveragesCard,
	};

	const walkCards = [titleCard, totalsCard, avgCard];

	return walkCards;
};
const getRecapTimedCards = (data: TimedRecapDetails) => {
	const titleCard = {
		id: 0,
		type: "Title",
		data: data,
		render: null,
	};

	const timedCards = [titleCard];

	return timedCards;
};
const getRecapOtherCards = (data: OtherRecapDetails) => {
	const titleCard = {
		id: 0,
		type: "Title",
		data: data,
		render: null,
	};

	const otherCards = [titleCard];

	return otherCards;
};
const getRecapStretchCards = (data: StretchRecapDetails) => {
	const titleCard = {
		id: 0,
		type: "Title",
		data: data,
		render: StretchTitleCard,
	};
	const totalsCard = {
		id: 1,
		type: "Stretch",
		data: data,
		render: StretchTotalsCard,
	};
	const consistencyCard = {
		id: 2,
		type: "Stretch",
		data: data,
		render: StretchConsistencyCard,
	};
	const stretchCards = [titleCard, totalsCard, consistencyCard];

	return stretchCards;
};

const getActivityRecapCards = (
	activityType: Activity,
	data: ActivityRecapDetails,
	workoutName: string = "",
) => {
	if (!data) return [];

	switch (activityType) {
		case "Strength": {
			const newData = { ...data, title: workoutName };
			return getRecapStrengthCards(newData as StrengthRecapDetails);
		}
		case "Stretch": {
			return getRecapStretchCards(data as StretchRecapDetails);
		}
		case "Cardio": {
			return getRecapCardioCards(data as CardioRecapDetails);
		}
		case "Walk": {
			return getRecapWalkCards(data as WalkRecapDetails);
		}
		case "Timed": {
			return getRecapTimedCards(data as TimedRecapDetails);
		}
		case "Other": {
			return getRecapOtherCards(data as OtherRecapDetails);
		}
		default:
			return [];
	}
};

// UTILS //

// Get number of days for recap
const getDaysRange = (data: ActivityRecapDetails) => {
	if (!data) return 0;
	const days = data.trends?.rangeDays ?? data.trends?.sampleSize;

	return days || 0;
};

const getLongestMins = (data: ActivityRecapDetails) => {
	if (!data || !data?.history?.length) return 0;

	const allMins = [...data.history].map((entry) => entry.totalMins);
	const max = Math.max(...allMins);

	return max;
};

export {
	renderContent,
	getRecapCardioCards,
	getRecapStrengthCards,
	getActivityRecapCards,
	// UTILS
	getDaysRange,
	getLongestMins,
};
