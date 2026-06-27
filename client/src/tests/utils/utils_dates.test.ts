import { describe, it, expect } from "vitest";
import { formatDate, formatTime } from "../../utils/utils_dates";

describe("formatDate", () => {
	it("returns a formatted date string", () => {
		const date = new Date("09/18/2020");
		const formatted = formatDate(date, "long");
		expect(formatted).toBe("09/18/2020");
	});
	it("returns correct format when date is 'YYYY-MM-DD'", () => {
		const date = new Date("2020-09-18");
		const formatted = formatDate(date.toUTCString(), "long");
		expect(formatted).toBe("09/18/2020");
	});
});

describe("formatTime", () => {
	it("returns a formatted time string", () => {
		const time = new Date("2021-01-01 10:00:00");
		const formatted = formatTime(time, "short");
		expect(formatted).toBe("10:00 AM");
	});
});
