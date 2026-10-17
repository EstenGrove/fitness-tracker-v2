import { useState } from "react";
import { getTrendsAccent, setTrendsAccent } from "../utils/utils_theme";
import { DEFAULT_TRENDS_ACCENT } from "../utils/utils_trendsHub";

/**
 * The trends hub's accent color (Settings > Theme)
 * - Changes apply instantly (via '--trends-accent-primary') & are saved per device
 * @returns accent - the active color (the default when none is picked)
 * @returns isCustom - false when using the default
 */

const useTrendsAccent = () => {
	const [savedAccent, setSavedAccent] = useState<string | null>(() =>
		getTrendsAccent(),
	);

	const setAccent = (color: string) => {
		setTrendsAccent(color);
		setSavedAccent(color);
	};

	const resetAccent = () => {
		setTrendsAccent(null);
		setSavedAccent(null);
	};

	return {
		accent: savedAccent ?? DEFAULT_TRENDS_ACCENT,
		isCustom: savedAccent !== null,
		setAccent,
		resetAccent,
	};
};

export { useTrendsAccent };
