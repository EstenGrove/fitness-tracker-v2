// flameGradients.ts
export const FLAME_GRADIENTS = {
	fire: {
		outer: [
			{ offset: "0%", color: "#ff6a00" },
			{ offset: "100%", color: "#ff1a00" },
		],
		inner: [
			{ offset: "0%", color: "#fff700" },
			{ offset: "100%", color: "#ff9900" },
		],
	},

	blue: {
		outer: [
			{ offset: "0%", color: "#60a5fa" },
			{ offset: "100%", color: "#1d4ed8" },
		],
		inner: [
			{ offset: "0%", color: "#bfdbfe" },
			{ offset: "100%", color: "#3b82f6" },
		],
	},

	purple: {
		outer: [
			{ offset: "0%", color: "#c084fc" },
			{ offset: "100%", color: "#6d28d9" },
		],
		inner: [
			{ offset: "0%", color: "#f5d0fe" },
			{ offset: "100%", color: "#a855f7" },
		],
	},

	pink: {
		outer: [
			{ offset: "0%", color: "#ff4d85" }, // hot pink highlight
			{ offset: "100%", color: "#ff005b" }, // deep pink base
		],
		inner: [
			{ offset: "0%", color: "#ffd1e1" }, // soft hot center
			{ offset: "100%", color: "#ff3b7a" },
		],
	},

	gold: {
		outer: [
			{ offset: "0%", color: "#fcd34d" }, // bright gold
			{ offset: "100%", color: "#f59e0b" }, // rich amber
		],
		inner: [
			{ offset: "0%", color: "#fff7cc" }, // molten center
			{ offset: "100%", color: "#fbbf24" },
		],
	},

	green: {
		outer: [
			{ offset: "0%", color: "#34d399" }, // emerald highlight
			{ offset: "100%", color: "#059669" }, // deep green flame
		],
		inner: [
			{ offset: "0%", color: "#d1fae5" }, // glowing mint
			{ offset: "100%", color: "#10b981" },
		],
	},

	grey: {
		outer: [
			{ offset: "0%", color: "#9ca3af" }, // cool silver
			{ offset: "100%", color: "#4b5563" }, // charcoal base
		],
		inner: [
			{ offset: "0%", color: "#e5e7eb" }, // soft white-hot center
			{ offset: "100%", color: "#9ca3af" },
		],
	},

	amber: {
		outer: [
			{ offset: "0%", color: "#fde68a" },
			{ offset: "100%", color: "#d97706" },
		],
		inner: [
			{ offset: "0%", color: "#fff7ed" },
			{ offset: "100%", color: "#fbbf24" },
		],
	},

	obsidian: {
		outer: [
			{ offset: "0%", color: "#4b5563" },
			{ offset: "100%", color: "#030712" },
		],
		inner: [
			{ offset: "0%", color: "#9ca3af" },
			{ offset: "100%", color: "#374151" },
		],
	},

	crimson: {
		outer: [
			{ offset: "0%", color: "#f87171" },
			{ offset: "100%", color: "#991b1b" },
		],
		inner: [
			{ offset: "0%", color: "#fee2e2" },
			{ offset: "100%", color: "#ef4444" },
		],
	},

	prismatic: {
		outer: [
			{ offset: "0%", color: "#22d3ee" },
			{ offset: "25%", color: "#6366f1" },
			{ offset: "50%", color: "#a855f7" },
			{ offset: "75%", color: "#ec4899" },
			{ offset: "100%", color: "#f59e0b" },
		],
		inner: [
			{ offset: "0%", color: "#ffffff" },
			{ offset: "100%", color: "#fde68a" },
		],
	},

	// NEON/INTENSE VARIANTS //
	pinkNeon: {
		outer: [
			{ offset: "0%", color: "#ff7abf" }, // neon pink glow
			{ offset: "100%", color: "#ff005b" }, // hot magenta
		],
		inner: [
			{ offset: "0%", color: "#fff0f7" }, // white-hot core
			{ offset: "100%", color: "#ff4fa3" },
		],
	},

	goldNeon: {
		outer: [
			{ offset: "0%", color: "#ffe066" }, // molten gold
			{ offset: "100%", color: "#f59e0b" }, // amber burn
		],
		inner: [
			{ offset: "0%", color: "#fffbe6" }, // near-white core
			{ offset: "100%", color: "#ffd54f" },
		],
	},

	greenNeon: {
		outer: [
			{ offset: "0%", color: "#6ee7b7" }, // electric mint
			{ offset: "100%", color: "#10b981" }, // neon emerald
		],
		inner: [
			{ offset: "0%", color: "#ecfdf5" }, // white-hot mint
			{ offset: "100%", color: "#34d399" },
		],
	},

	greyNeon: {
		outer: [
			{ offset: "0%", color: "#d1d5db" }, // chrome glow
			{ offset: "100%", color: "#6b7280" }, // dark steel
		],
		inner: [
			{ offset: "0%", color: "#ffffff" }, // pure white core
			{ offset: "100%", color: "#e5e7eb" },
		],
	},

	blueNeon: {
		outer: [
			{ offset: "0%", color: "#93c5fd" },
			{ offset: "100%", color: "#1d4ed8" },
		],
		inner: [
			{ offset: "0%", color: "#f0f9ff" },
			{ offset: "100%", color: "#60a5fa" },
		],
	},

	purpleNeon: {
		outer: [
			{ offset: "0%", color: "#e9d5ff" },
			{ offset: "100%", color: "#7c3aed" },
		],
		inner: [
			{ offset: "0%", color: "#faf5ff" },
			{ offset: "100%", color: "#c084fc" },
		],
	},

	crimsonNeon: {
		outer: [
			{ offset: "0%", color: "#fca5a5" },
			{ offset: "100%", color: "#dc2626" },
		],
		inner: [
			{ offset: "0%", color: "#fff5f5" },
			{ offset: "100%", color: "#fb7185" },
		],
	},
} as const;

export type FlameColorKey = keyof typeof FLAME_GRADIENTS;

export type FlameStreakTier =
	| "inactive"
	| "starter"
	| "consistent"
	| "hot"
	| "elite"
	| "legendary"
	| "mythic";

export enum FlameStreakTierName {
	INACTIVE = "inactive",
	STARTER = "starter",
	CONSISTENT = "consistent",
	HOT = "hot",
	ELITE = "elite",
	LEGENDARY = "legendary",
	MYTHIC = "mythic",
}

const FLAME_STREAK_MAP: Record<
	FlameStreakTier,
	{
		variant: FlameColorKey;
		glow: "none" | "soft" | "neon";
		pulse?: boolean;
	}
> = {
	inactive: {
		variant: "grey",
		glow: "none",
	},

	starter: {
		variant: "green",
		glow: "soft",
	},

	consistent: {
		variant: "blue",
		glow: "soft",
	},

	hot: {
		variant: "fire",
		glow: "soft",
		pulse: true,
	},

	elite: {
		variant: "purpleNeon",
		glow: "neon",
		pulse: true,
	},

	legendary: {
		variant: "goldNeon",
		glow: "neon",
		pulse: true,
	},

	mythic: {
		variant: "prismatic",
		glow: "neon",
		pulse: true,
	},
};

const getFlameStreakTier = (streak: number): FlameStreakTier => {
	if (streak <= 0) return FlameStreakTierName.INACTIVE;
	if (streak <= 3) return FlameStreakTierName.STARTER;
	if (streak <= 7) return FlameStreakTierName.CONSISTENT;
	if (streak <= 14) return FlameStreakTierName.HOT;
	if (streak <= 30) return FlameStreakTierName.ELITE;
	if (streak <= 60) return FlameStreakTierName.LEGENDARY;
	return FlameStreakTierName.MYTHIC;
};

export { FLAME_STREAK_MAP, getFlameStreakTier };
