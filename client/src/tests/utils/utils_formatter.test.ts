import { describe, it, expect } from "vitest";
import {
	NumberFormatter,
	numFormatter,
	timerToMinsAndSecs,
	extractHrsAndMins,
	formattedTime,
} from "../../utils/utils_formatter";

describe("NumberFormatter", () => {
	const fmt = new NumberFormatter("en-US");

	describe("currency", () => {
		it("formats a number as USD currency", () => {
			expect(fmt.currency(1000)).toBe("$1,000.00");
		});
		it("formats cents correctly", () => {
			expect(fmt.currency(9.99)).toBe("$9.99");
		});
		it("formats large amounts with commas", () => {
			expect(fmt.currency(1_234_567.5)).toBe("$1,234,567.50");
		});
	});

	describe("percent", () => {
		it("formats 0.86 as a percentage", () => {
			expect(fmt.percent(0.86)).toBe("86%");
		});
		it("formats 1.0 as 100%", () => {
			expect(fmt.percent(1)).toBe("100%");
		});
		it("formats 0.5 as 50%", () => {
			expect(fmt.percent(0.5)).toBe("50%");
		});
	});

	describe("largeNumber", () => {
		it("compacts thousands", () => {
			expect(fmt.largeNumber(1500)).toBe("1.5K");
		});
		it("compacts millions", () => {
			expect(fmt.largeNumber(2_000_000)).toBe("2M");
		});
		it("leaves small numbers as-is", () => {
			expect(fmt.largeNumber(500)).toBe("500");
		});
	});
});

describe("numFormatter (shared instance)", () => {
	it("is a NumberFormatter instance", () => {
		expect(numFormatter).toBeInstanceOf(NumberFormatter);
	});
	it("formats currency correctly", () => {
		expect(numFormatter.currency(100)).toBe("$100.00");
	});
});

describe("timerToMinsAndSecs", () => {
	it("converts 90 seconds to 1 minute and 30 seconds", () => {
		expect(timerToMinsAndSecs(90)).toEqual({ minutes: 1, seconds: 30 });
	});
	it("converts 60 seconds to 1 minute and 0 seconds", () => {
		expect(timerToMinsAndSecs(60)).toEqual({ minutes: 1, seconds: 0 });
	});
	it("converts 0 seconds to 0 minutes and 0 seconds", () => {
		expect(timerToMinsAndSecs(0)).toEqual({ minutes: 0, seconds: 0 });
	});
	it("converts 3661 seconds to 61 minutes and 1 second", () => {
		expect(timerToMinsAndSecs(3661)).toEqual({ minutes: 61, seconds: 1 });
	});
});

describe("extractHrsAndMins", () => {
	it("extracts hours and minutes from total minutes", () => {
		expect(extractHrsAndMins(90)).toEqual({ hrs: 1, mins: 30 });
	});
	it("returns 0 hrs for less than 60 minutes", () => {
		expect(extractHrsAndMins(45)).toEqual({ hrs: 0, mins: 45 });
	});
	it("handles exactly 60 minutes", () => {
		expect(extractHrsAndMins(60)).toEqual({ hrs: 1, mins: 0 });
	});
	it("handles 0 minutes", () => {
		expect(extractHrsAndMins(0)).toEqual({ hrs: 0, mins: 0 });
	});
});

describe("formattedTime", () => {
	it("formats 90 seconds as '01:30'", () => {
		expect(formattedTime(90)).toBe("01:30");
	});
	it("formats 5 seconds as '00:05'", () => {
		expect(formattedTime(5)).toBe("00:05");
	});
	it("formats 0 seconds as '00:00'", () => {
		expect(formattedTime(0)).toBe("00:00");
	});
	it("formats 3600 seconds as '60:00'", () => {
		expect(formattedTime(3600)).toBe("60:00");
	});
});
