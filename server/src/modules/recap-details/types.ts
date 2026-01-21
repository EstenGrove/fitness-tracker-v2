import type {
	CardioInsights,
	OtherInsights,
	StrengthInsights,
	StretchInsights,
	TimedInsights,
	WalkInsights,
} from "../insights/types.js";
import type {
	CardioRecap,
	OtherRecap,
	StrengthRecap,
	StretchRecap,
	TimedRecap,
	WalkRecap,
} from "../recaps/types.js";
import type {
	CardioTrends,
	OtherTrends,
	StrengthTrends,
	StretchTrends,
	TimedTrends,
	WalkTrends,
} from "../trends/types.js";

export interface StrengthRecapDetails {
	recap: StrengthRecap;
	trends: StrengthTrends;
	insights: StrengthInsights;
}
export interface StretchRecapDetails {
	recap: StretchRecap;
	trends: StretchTrends;
	insights: StretchInsights;
}
export interface WalkRecapDetails {
	recap: WalkRecap;
	trends: WalkTrends;
	insights: WalkInsights;
}
export interface CardioRecapDetails {
	recap: CardioRecap;
	trends: CardioTrends;
	insights: CardioInsights;
}
export interface TimedRecapDetails {
	recap: TimedRecap;
	trends: TimedTrends;
	insights: TimedInsights;
}
export interface OtherRecapDetails {
	recap: OtherRecap;
	trends: OtherTrends;
	insights: OtherInsights;
}

export type ActivityRecapDetails =
	| WalkRecapDetails
	| StrengthRecapDetails
	| CardioRecapDetails
	| StretchRecapDetails
	| TimedRecapDetails
	| OtherRecapDetails;
