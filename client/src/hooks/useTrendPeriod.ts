import { useSearchParams } from "react-router";
import { TrendPeriodKey } from "../features/trends-hub/types";
import {
	DEFAULT_TREND_PERIOD,
	isTrendPeriodKey,
} from "../utils/utils_trendsHub";

/**
 * The selected trends period, kept in the URL (?period=12W)
 * - Survives hub -> detail -> back, reloads & shared links
 * - Invalid/missing values fall back to the default (12W)
 */

const useTrendPeriod = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const param = searchParams.get("period");
	const period: TrendPeriodKey = isTrendPeriodKey(param)
		? param
		: DEFAULT_TREND_PERIOD;

	// Updates only 'period' (keeps any other params); 'replace' so period changes don't pile up in history
	const setPeriod = (newPeriod: TrendPeriodKey) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				next.set("period", newPeriod);
				return next;
			},
			{ replace: true },
		);
	};

	return {
		period,
		setPeriod,
	};
};

export { useTrendPeriod };
