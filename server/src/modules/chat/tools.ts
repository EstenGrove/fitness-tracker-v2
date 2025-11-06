import { tool } from "ai";
import { z } from "zod";
import { getAICaloriesSummary, getAIWorkoutSummary } from "./utils.js";

const isoDate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format");

const createTools = (userID: string) => {
	return {
		getWorkoutSummary: tool({
			description: "Gets workout history for a given range for a given user.",
			inputSchema: z.object({
				startDate: isoDate.describe("Start date of the given range."),
				endDate: isoDate.describe("End date of the given range."),
			}),
			execute: async ({ startDate, endDate }) => {
				const results = await getAIWorkoutSummary(userID, {
					startDate,
					endDate,
				});
				return JSON.stringify(results, null, 2);
			},
		}),
		getCaloriesSummary: tool({
			description:
				"Gets a calories summary by activity type for a given range & user.",
			inputSchema: z.object({
				startDate: isoDate.describe("Start date of the given range."),
				endDate: isoDate.describe("End date of the given range."),
			}),
			execute: async ({ startDate, endDate }) => {
				const results = await getAICaloriesSummary(userID, {
					startDate,
					endDate,
				});
				return JSON.stringify(results, null, 2);
			},
		}),
	};
};

export { createTools };
