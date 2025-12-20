export type StreakSize = "XSM" | "SM" | "MD" | "LG" | "XLG";
export type StreakColor =
	| "fire"
	| "gold"
	| "green"
	| "purple"
	| "pink"
	| "blue";

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

export type StreakTier = { max: number; tier: string };

const getStreakTier = (
	days: number,
	tiers: StreakTier[] = STREAK_TIERS
): StreakTier => {
	const tier =
		tiers.find((t) => days <= t.max) ?? STREAK_TIERS[STREAK_TIERS.length - 1];
	return tier;
};

export { STREAK_TIERS, getStreakTier };
