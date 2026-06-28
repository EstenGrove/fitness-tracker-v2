import { describe, it, expect } from "vitest";
import { getStreakTier, STREAK_TIERS } from "../../../utils/utils_streaks";

describe("getStreakTier", () => {
	it("returns 'spark' tier for 1 day (≤3)", () => {
		expect(getStreakTier(1).tier).toBe("spark");
	});
	it("returns 'spark' tier for 3 days (boundary)", () => {
		expect(getStreakTier(3).tier).toBe("spark");
	});
	it("returns 'charge' tier for 4 days", () => {
		expect(getStreakTier(4).tier).toBe("charge");
	});
	it("returns 'flow' tier for 7 days (boundary)", () => {
		expect(getStreakTier(7).tier).toBe("flow");
	});
	it("returns 'surge' tier for 10 days (boundary)", () => {
		expect(getStreakTier(10).tier).toBe("surge");
	});
	it("returns 'blaze' tier for 14 days (boundary)", () => {
		expect(getStreakTier(14).tier).toBe("blaze");
	});
	it("returns 'mythic' tier for 30 days (boundary)", () => {
		expect(getStreakTier(30).tier).toBe("mythic");
	});
	it("returns 'eternal' tier for 365 days (max)", () => {
		expect(getStreakTier(365).tier).toBe("eternal");
	});
	it("returns 'eternal' tier when days exceed all defined tiers", () => {
		expect(getStreakTier(999).tier).toBe("eternal");
	});
	it("accepts a custom tiers array", () => {
		const custom = [
			{ max: 5, tier: "bronze" as const },
			{ max: 10, tier: "silver" as const },
		];
		const customTiers = custom as unknown as typeof STREAK_TIERS;
		expect(getStreakTier(3, customTiers).tier).toBe("bronze");
		expect(getStreakTier(7, customTiers).tier).toBe("silver");
	});
	it("returns the tier object with a max value", () => {
		const result = getStreakTier(5);
		expect(result).toHaveProperty("max");
		expect(result).toHaveProperty("tier");
	});
});
