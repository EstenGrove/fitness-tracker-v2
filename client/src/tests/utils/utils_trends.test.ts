import { describe, it, expect } from "vitest";
import {
	getTrendDirection,
	getTrendSymbol,
	formatTrendDelta,
	getTrendPercent,
	getTrendSummary,
} from "../../utils/utils_trends";

describe("getTrendDirection", () => {
	it("returns 'up' for a positive value", () => {
		expect(getTrendDirection(10)).toBe("up");
	});
	it("returns 'down' for a negative value", () => {
		expect(getTrendDirection(-5)).toBe("down");
	});
	it("returns 'flat' for zero", () => {
		expect(getTrendDirection(0)).toBe("flat");
	});
});

describe("getTrendSymbol", () => {
	it("returns '+' for 'up' direction", () => {
		expect(getTrendSymbol("up")).toBe("+");
	});
	it("returns '-' for 'down' direction", () => {
		expect(getTrendSymbol("down")).toBe("-");
	});
	it("returns '~' for 'flat' direction", () => {
		expect(getTrendSymbol("flat")).toBe("~");
	});
	it("returns '+' for a positive number", () => {
		expect(getTrendSymbol(5)).toBe("+");
	});
	it("returns '-' for a negative number", () => {
		expect(getTrendSymbol(-3)).toBe("-");
	});
	it("returns '~' for zero", () => {
		expect(getTrendSymbol(0)).toBe("~");
	});
});

describe("formatTrendDelta", () => {
	it("prefixes '+' for positive values", () => {
		expect(formatTrendDelta(15)).toBe("+15%");
	});
	it("prefixes '-' for negative values (value retains its sign)", () => {
		// The function prepends '-' to the raw value, so -10 becomes '--10%'
		expect(formatTrendDelta(-10)).toBe("--10%");
	});
	it("prefixes '~' for zero", () => {
		expect(formatTrendDelta(0)).toBe("~0%");
	});
});

describe("getTrendPercent", () => {
	it("formats a positive value as percentage string", () => {
		expect(getTrendPercent(25)).toBe("25%");
	});
	it("formats a negative value as percentage string", () => {
		expect(getTrendPercent(-12)).toBe("-12%");
	});
	it("formats zero as '0%'", () => {
		expect(getTrendPercent(0)).toBe("0%");
	});
});

describe("getTrendSummary", () => {
	it("returns a summary with direction, delta, and percent for a positive value", () => {
		const result = getTrendSummary(20);
		expect(result.direction).toBe("up");
		expect(result.percent).toBe("20%");
	});
	it("returns 'down' direction for a negative value", () => {
		const result = getTrendSummary(-5);
		expect(result.direction).toBe("down");
	});
	it("returns 'flat' direction for zero", () => {
		const result = getTrendSummary(0);
		expect(result.direction).toBe("flat");
	});
});
