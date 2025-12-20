export type StreakSize = "XSM" | "SM" | "MD" | "LG" | "XLG";
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

export { STREAK_TIERS, STREAK_MEDAL_CONFIG, getStreakTier };
