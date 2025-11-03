import { tool } from "ai";
import { z } from "zod";
import { getAIWorkoutSummary } from "./utils.js";

const TOOLS = {
	getWorkoutSummary: tool({
		description: "Gets workout history for a given range for a given user.",
		inputSchema: z.object({
			userID: z.string().uuid().describe("The target user id"),
			startDate: z.string().describe("Start date of the given range"),
			endDate: z.string().describe("End date of the given range"),
		}),
		execute: async ({ userID, startDate, endDate }) => {
			return getAIWorkoutSummary(userID, { startDate, endDate });
		},
	}),
};

export { TOOLS };
