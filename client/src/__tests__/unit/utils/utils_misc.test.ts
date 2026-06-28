import { describe, it, expect } from "vitest";
import {
	isEmptyArray,
	isEmptyObj,
	isEmptyStr,
	addEllipsis,
	formatThousand,
	formatLargeNumber,
	groupBy,
	groupByFn,
	sortByNumberOrder,
	sortByDate,
	provideFallbackStr,
} from "../../../utils/utils_misc";

describe("isEmptyArray", () => {
	it("returns true for an empty array", () => {
		expect(isEmptyArray([])).toBe(true);
	});
	it("returns false for a non-empty array", () => {
		expect(isEmptyArray([1, 2, 3])).toBe(false);
	});
	it("returns true for null", () => {
		expect(isEmptyArray(null as unknown as [])).toBe(true);
	});
	it("returns true for undefined", () => {
		expect(isEmptyArray(undefined as unknown as [])).toBe(true);
	});
});

describe("isEmptyObj", () => {
	it("returns true for an empty object", () => {
		expect(isEmptyObj({})).toBe(true);
	});
	it("returns false for a non-empty object", () => {
		expect(isEmptyObj({ a: 1 })).toBe(false);
	});
	it("returns true for null", () => {
		expect(isEmptyObj(null as unknown as object)).toBe(true);
	});
});

describe("isEmptyStr", () => {
	it("returns true for an empty string", () => {
		expect(isEmptyStr("")).toBe(true);
	});
	it("returns false for a non-empty string", () => {
		expect(isEmptyStr("hello")).toBe(false);
	});
	it("returns true for null", () => {
		expect(isEmptyStr(null as unknown as string)).toBe(true);
	});
	it("returns true for undefined", () => {
		expect(isEmptyStr(undefined as unknown as string)).toBe(true);
	});
});

describe("addEllipsis", () => {
	it("returns the string unchanged when under the default limit", () => {
		expect(addEllipsis("short")).toBe("short");
	});
	it("truncates long strings with ellipsis at default 30 chars", () => {
		const long = "this string is definitely longer than thirty characters";
		const result = addEllipsis(long);
		expect(result.length).toBe(30);
		expect(result.endsWith("...")).toBe(true);
	});
	it("truncates at a custom maxLength", () => {
		const result = addEllipsis("hello world", 8);
		expect(result).toBe("hello...");
		expect(result.length).toBe(8);
	});
	it("returns empty string for falsy input", () => {
		expect(addEllipsis("")).toBe("");
	});
	it("returns unchanged string when exactly at the limit", () => {
		const str = "exactly30characters___________";
		expect(addEllipsis(str, 30)).toBe(str);
	});
});

describe("formatThousand", () => {
	it("returns numbers under 1000 as a string", () => {
		expect(formatThousand(500)).toBe("500");
	});
	it("formats 1000 as '1k'", () => {
		expect(formatThousand(1000)).toBe("1k");
	});
	it("formats 1500 as '1.5k'", () => {
		expect(formatThousand(1500)).toBe("1.5k");
	});
	it("formats 10000 as '10k'", () => {
		expect(formatThousand(10000)).toBe("10k");
	});
	it("returns falsy value as-is for 0", () => {
		expect(formatThousand(0)).toBeFalsy();
	});
});

describe("formatLargeNumber", () => {
	it("formats millions with M suffix", () => {
		expect(formatLargeNumber(1_000_000)).toBe("1M");
	});
	it("formats thousands with K suffix", () => {
		expect(formatLargeNumber(1500)).toBe("1.5K");
	});
	it("returns falsy for 0", () => {
		expect(formatLargeNumber(0)).toBeFalsy();
	});
});

describe("groupBy", () => {
	it("groups items by a given key", () => {
		const items = [
			{ type: "cardio", name: "Run" },
			{ type: "strength", name: "Squat" },
			{ type: "cardio", name: "Bike" },
		];
		const result = groupBy("type", items);
		expect(result["cardio"]).toHaveLength(2);
		expect(result["strength"]).toHaveLength(1);
	});
	it("returns empty object for an empty list", () => {
		expect(groupBy("type", [])).toEqual({});
	});
});

describe("groupByFn", () => {
	it("groups items using a custom function", () => {
		const items = [
			{ mins: 30, name: "Run" },
			{ mins: 60, name: "Lift" },
			{ mins: 30, name: "Walk" },
		];
		const result = groupByFn(items, (item) => item.mins);
		expect(result[30]).toHaveLength(2);
		expect(result[60]).toHaveLength(1);
	});
});

describe("sortByNumberOrder", () => {
	it("sorts ascending by default", () => {
		const items = [{ n: 3 }, { n: 1 }, { n: 2 }];
		const result = sortByNumberOrder("n", items);
		expect(result.map((i) => i.n)).toEqual([1, 2, 3]);
	});
	it("sorts descending when specified", () => {
		const items = [{ n: 1 }, { n: 3 }, { n: 2 }];
		const result = sortByNumberOrder("n", items, "DESC");
		expect(result.map((i) => i.n)).toEqual([3, 2, 1]);
	});
	it("returns empty array for empty input", () => {
		expect(sortByNumberOrder("n", [])).toEqual([]);
	});
});

describe("sortByDate", () => {
	it("sorts dates newest-first", () => {
		const items = [
			{ date: "2024-01-01" },
			{ date: "2024-03-15" },
			{ date: "2024-02-10" },
		];
		const result = sortByDate("date", items);
		expect(result[0].date).toBe("2024-03-15");
		expect(result[2].date).toBe("2024-01-01");
	});
});

describe("provideFallbackStr", () => {
	it("returns the target value when it is non-empty", () => {
		expect(provideFallbackStr("hello", "fallback")).toBe("hello");
	});
	it("returns the fallback when target is empty", () => {
		expect(provideFallbackStr("", "fallback")).toBe("fallback");
	});
	it("returns the fallback when target is falsy", () => {
		expect(provideFallbackStr(null as unknown as string, "fallback")).toBe(
			"fallback"
		);
	});
});
