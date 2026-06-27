import { describe, it, expect } from "vitest";
import { getScaledHeight, getHighAndLowRanges } from "../../utils/utils_summary";
import type { MinMaxRange } from "../../components/summary/types";

describe("getScaledHeight", () => {
	it("returns 0 when value is 0", () => {
		const range: MinMaxRange = { min: 0, max: 100 };
		expect(getScaledHeight(0, range)).toBe(0);
	});
	it("returns 100 when value equals max", () => {
		const range: MinMaxRange = { min: 0, max: 100 };
		expect(getScaledHeight(100, range)).toBe(100);
	});
	it("returns 50 for a value that is half of max", () => {
		const range: MinMaxRange = { min: 0, max: 100 };
		expect(getScaledHeight(50, range)).toBe(50);
	});
	it("scales correctly for non-100 max values", () => {
		const range: MinMaxRange = { min: 0, max: 200 };
		expect(getScaledHeight(50, range)).toBe(25);
	});
	it("returns a value greater than 100 when value exceeds max", () => {
		const range: MinMaxRange = { min: 0, max: 100 };
		expect(getScaledHeight(150, range)).toBe(150);
	});
});

describe("getHighAndLowRanges", () => {
	it("returns correct max, min, and step for a simple set", () => {
		const data = [
			{ label: "Mon", value: 10 },
			{ label: "Tue", value: 20 },
			{ label: "Wed", value: 30 },
		];
		const result = getHighAndLowRanges(data);
		// min = 10, max = 30 + 10 (step) = 40
		expect(result.min).toBe(10);
		expect(result.step).toBe(10);
		expect(result.max).toBe(40);
	});
	it("ignores zero values when calculating min and max", () => {
		const data = [
			{ label: "Mon", value: 0 },
			{ label: "Tue", value: 15 },
			{ label: "Wed", value: 30 },
		];
		const result = getHighAndLowRanges(data);
		expect(result.min).toBe(15);
		expect(result.max).toBe(45);
	});
	it("works correctly when all values are the same", () => {
		const data = [
			{ label: "A", value: 20 },
			{ label: "B", value: 20 },
		];
		const result = getHighAndLowRanges(data);
		expect(result.min).toBe(20);
		expect(result.max).toBe(40);
	});
});
