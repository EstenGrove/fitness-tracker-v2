import { differenceInHours, isSameDay } from "date-fns";
import {
	HabitStreakDetailsResp,
	StreaksCacheStatus,
	WorkoutStreakDetailsResp,
} from "../features/streaks/types";
import { currentEnv, streakApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";
import { LocalStorage } from "./utils_storage";

export type StreakSize = "XSM" | "SM" | "MD" | "LG" | "XLG" | "XXLG";
export type StreakColor =
	| "fire"
	| "gold"
	| "green"
	| "purple"
	| "pink"
	| "blue";

export type StreakTierName =
	| "spark"
	| "charge"
	| "flow"
	| "surge"
	| "blaze"
	| "inferno"
	| "mythic"
	| "legendary"
	| "epic"
	| "ascended"
	| "eternal";

const STREAK_TIERS: StreakTier[] = [
	{ max: 3, tier: "spark" },
	{ max: 5, tier: "charge" },
	{ max: 7, tier: "flow" },
	{ max: 10, tier: "surge" },
	{ max: 14, tier: "blaze" },
	{ max: 21, tier: "inferno" },
	{ max: 30, tier: "mythic" },
	{ max: 60, tier: "legendary" },
	{ max: 90, tier: "epic" },
	{ max: 120, tier: "ascended" },
	{ max: 365, tier: "eternal" },
];

export type StreakTier = { max: number; tier: StreakTierName };

const getStreakTier = (
	days: number,
	tiers: StreakTier[] = STREAK_TIERS
): StreakTier => {
	const tier =
		tiers.find((t) => days <= t.max) ?? STREAK_TIERS[STREAK_TIERS.length - 1];
	return tier;
};

const STREAK_MEDAL_CONFIG: Record<
	StreakTier["tier"],
	{
		color: "fire" | "gold" | "green" | "purple" | "pink" | "blue";
		size: "XSM" | "SM" | "MD" | "LG" | "XLG";
		label: string;
	}
> = {
	spark: {
		color: "blue",
		size: "XSM",
		label: "Getting Started",
	},
	charge: {
		color: "blue",
		size: "SM",
		label: "Building Momentum",
	},
	flow: {
		color: "green",
		size: "SM",
		label: "In the Flow",
	},
	surge: {
		color: "green",
		size: "MD",
		label: "Surging",
	},
	blaze: {
		color: "gold",
		size: "MD",
		label: "On Fire",
	},
	inferno: {
		color: "fire",
		size: "LG",
		label: "Unstoppable",
	},
	mythic: {
		color: "purple",
		size: "LG",
		label: "Mythic Streak",
	},
	legendary: {
		color: "pink",
		size: "XLG",
		label: "Legendary",
	},
	epic: {
		color: "pink",
		size: "XLG",
		label: "Epic Run",
	},
	ascended: {
		color: "gold",
		size: "XLG",
		label: "Ascended",
	},
	eternal: {
		color: "fire",
		size: "XLG",
		label: "Eternal Streak",
	},
};

const fetchWorkoutStreaks = async (
	userID: string,
	targetDate: string
): WorkoutStreakDetailsResp => {
	let url = currentEnv.base + streakApis.getWorkoutStreaks;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchHabitStreaks = async (
	userID: string,
	habitID: number,
	targetDate: string
): HabitStreakDetailsResp => {
	let url = currentEnv.base + streakApis.getHabitStreaks;
	url += "?" + new URLSearchParams({ userID, targetDate });
	url += "&" + new URLSearchParams({ habitID: String(habitID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// STREAKS CACHE UTILS //
const STREAKS_KEY = `STREAKS`;
const STREAKS_CACHE = new LocalStorage();

/**
 * Rules for show streaks modal:
 * - IF there's no cache, then we "probably" haven't seen it in a while => SHOW STREAKS
 * - IF there's a cache, then check "when" it was last seen; If greater than 10hrs ago OR was NOT already seen today => SHOW STREAKS
 * @param currentTime Date
 * @returns boolean
 */
const shouldShowStreaks = (currentTime: Date = new Date()): boolean => {
	const seenCache = STREAKS_CACHE.get<StreaksCacheStatus>(
		STREAKS_KEY
	) as StreaksCacheStatus;

	// If there's no cache, then it hasn't been seen in a while (presumably)...so we show it!
	if (!seenCache) return true;

	const seenXHoursAgo = differenceInHours(
		currentTime,
		new Date(seenCache.lastSeen)
	);
	const wasSeenToday = isSameDay(currentTime, new Date(seenCache.lastSeen));
	const justFinishedWorkout =
		"justFinished" in seenCache && seenCache.justFinished;

	// If we just finished a workout, then show it IF it hasn't been seen today, or last time it was seen was greater than 10hrs ago
	if (justFinishedWorkout && (seenXHoursAgo >= 10 || !wasSeenToday)) {
		return true;
	}

	return false;
};

const updateLastSeen = (timestamp: string) => {
	STREAKS_CACHE.set(STREAKS_KEY, {
		lastSeen: timestamp,
	});
};

const updateStreaksCache = (
	lastSeen: string,
	justFinished: boolean = false
) => {
	STREAKS_CACHE.set(STREAKS_KEY, {
		lastSeen: lastSeen,
		justFinished: justFinished,
	});
};

const updateStreaksCachePromise = (
	lastSeen: string,
	justFinished: boolean = false
) => {
	return new Promise((resolve) => {
		resolve(
			STREAKS_CACHE.set(STREAKS_KEY, {
				lastSeen: lastSeen,
				justFinished: justFinished,
			})
		);
	});
};

export {
	STREAK_TIERS,
	STREAK_MEDAL_CONFIG,
	getStreakTier,
	// STREAKS CACHE UTILS
	STREAKS_KEY,
	STREAKS_CACHE,
	shouldShowStreaks,
	updateLastSeen,
	updateStreaksCache,
	updateStreaksCachePromise,
	// Data fetching utils
	fetchWorkoutStreaks,
	fetchHabitStreaks,
};
