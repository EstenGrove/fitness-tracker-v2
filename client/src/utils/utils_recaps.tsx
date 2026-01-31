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

const renderContent = (content?: JSX.Element | ReactNode) => {
	if (content) {
		return content;
	}
	return null;
};

const getRecapStrengthCards = (
	data: StrengthRecapDetails
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
	const setsCard = {
		id: 2,
		data,
		render: StrengthSetsCard,
	} as ActivityRecapCard<"Strength">;

	const strengthCards = [titleCard, totalsCard, setsCard];

	return strengthCards;
};
const getRecapCardioCards = (
	data: CardioRecapDetails
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

	const cardioCards = [titleCard, totalsCard];

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

	const walkCards = [titleCard, totalsCard];

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

	const stretchCards = [titleCard, totalsCard];

	return stretchCards;
};

const getActivityRecapCards = (
	activityType: Activity,
	data: ActivityRecapDetails
) => {
	switch (activityType) {
		case "Strength": {
			return getRecapStrengthCards(data as StrengthRecapDetails);
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

export {
	renderContent,
	getRecapCardioCards,
	getRecapStrengthCards,
	getActivityRecapCards,
};
