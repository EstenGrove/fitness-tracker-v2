import { describe, it, expect } from "vitest";
import { milesToSteps, milesToPace, pacePerMile } from "../../../utils/utils_steps";

describe("milesToSteps", () => {
	it("converts 1 mile with default stride (2.5 ft) to 2112 steps", () => {
		expect(milesToSteps(1)).toBe(2112);
	});
	it("converts 2 miles with default stride to 4224 steps", () => {
		expect(milesToSteps(2)).toBe(4224);
	});
	it("respects a custom stride length", () => {
		// 5280 / 2 = 2640 steps per mile
		expect(milesToSteps(1, 2)).toBe(2640);
	});
	it("returns 0 for 0 miles", () => {
		expect(milesToSteps(0)).toBe(0);
	});
});

describe("milesToPace", () => {
	it("calculates pace in minutes per mile", () => {
		expect(milesToPace(3, 30)).toBe(10);
	});
	it("returns 0 when miles is 0", () => {
		expect(milesToPace(0, 30)).toBe(0);
	});
	it("returns 0 when minutes is 0", () => {
		expect(milesToPace(3, 0)).toBe(0);
	});
	it("returns 0 when both inputs are 0", () => {
		expect(milesToPace(0, 0)).toBe(0);
	});
	it("returns 0 for negative miles", () => {
		expect(milesToPace(-1, 30)).toBe(0);
	});
});

describe("pacePerMile", () => {
	it("returns 0 when miles is 0", () => {
		expect(pacePerMile(0, 2000, 30)).toBe(0);
	});
	it("returns 0 when steps is 0", () => {
		expect(pacePerMile(3, 0, 30)).toBe(0);
	});
	it("returns 0 when minutes is 0", () => {
		expect(pacePerMile(3, 2000, 0)).toBe(0);
	});
	it("returns 0 for negative inputs", () => {
		expect(pacePerMile(-1, 2000, 30)).toBe(0);
	});
	it("calculates pace correctly for valid inputs", () => {
		// (30 * 2000) / (3 * 5280) = 60000 / 15840 ≈ 3.788
		const result = pacePerMile(3, 2000, 30);
		expect(result).toBeCloseTo(3.788, 2);
	});
});
