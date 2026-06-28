import { describe, it, expect } from "vitest";
import {
	formatDate,
	formatTime,
	parseDate,
	parseAnyDate,
	parseAnyTime,
	applyTimeStrToDate,
	toBackendFormat,
} from "../../../utils/utils_dates";

describe("formatDate", () => {
	it("returns a formatted date string", () => {
		const date = new Date("09/18/2020");
		const formatted = formatDate(date, "long");
		expect(formatted).toBe("09/18/2020");
	});
	it("returns off-by-one date when initial date is created using 'YYYY-MM-DD' format", () => {
		const date = new Date("2020-09-18");
		const formatted = formatDate(date.toUTCString(), "long");
		expect(formatted).toBe("09/17/2020");
	});
});

describe("formatTime", () => {
	it("returns a formatted time string", () => {
		const time = new Date("2021-01-01 10:00:00");
		const formatted = formatTime(time, "short");
		expect(formatted).toBe("10:00 AM");
	});
});

describe("parseDate", () => {
	it("returns a parsed date object", () => {
		const date = "09/18/2020";
		const parsed = parseDate(date, "long");
		expect(parsed).toBeInstanceOf(Date);
	});
});

describe("parseAnyDate", () => {
	it("parses MM/dd/yyyy", () => {
		const result = parseAnyDate("09/18/2020") as Date;
		expect(result.getMonth()).toBe(8); // 0-indexed
		expect(result.getDate()).toBe(18);
		expect(result.getFullYear()).toBe(2020);
	});

	it("parses yyyy-MM-dd", () => {
		const result = parseAnyDate("2020-09-18") as Date;
		expect(result.getMonth()).toBe(8);
		expect(result.getDate()).toBe(18);
		expect(result.getFullYear()).toBe(2020);
	});

	it("returns the original string when no format matches", () => {
		expect(parseAnyDate("not-a-date")).toBe("not-a-date");
	});
});

describe("parseAnyTime", () => {
	it("parses military time (HH:mm)", () => {
		const result = parseAnyTime("14:30") as Date;
		expect(result.getHours()).toBe(14);
		expect(result.getMinutes()).toBe(30);
	});

	it("parses 12-hour time with AM/PM (hh:mm a)", () => {
		const result = parseAnyTime("02:45 PM") as Date;
		expect(result.getHours()).toBe(14);
		expect(result.getMinutes()).toBe(45);
	});

	it("returns the original string when no format matches", () => {
		expect(parseAnyTime("not-a-time")).toBe("not-a-time");
	});
});

describe("applyTimeStrToDate", () => {
	it("applies hours and minutes to a date", () => {
		const result = applyTimeStrToDate("10:30 AM", new Date("09/18/2020"));
		expect(result.getHours()).toBe(10);
		expect(result.getMinutes()).toBe(30);
	});

	it("preserves the original date parts when applying time", () => {
		const result = applyTimeStrToDate("2:45 PM", new Date("09/18/2020"));
		expect(result.getMonth()).toBe(8);
		expect(result.getDate()).toBe(18);
		expect(result.getFullYear()).toBe(2020);
		expect(result.getHours()).toBe(14);
		expect(result.getMinutes()).toBe(45);
	});
});

describe("toBackendFormat", () => {
	it("converts a date to the backend format", () => {
		const date = new Date("09/18/2020");
		const formatted = toBackendFormat(date);
		expect(formatted).toBe("2020-09-18 00:00");
	});
	it("returns an empty string if the date is not provided", () => {
		const formatted = toBackendFormat(null as unknown as string);
		expect(formatted).toBe("");
	});
	it("returns an empty string if the date is not a date", () => {
		const formatted = toBackendFormat("not-a-date");
		expect(formatted).toBe("");
	});
});
