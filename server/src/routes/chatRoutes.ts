import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	streamText,
	type ModelMessage,
	type UIMessage,
} from "ai";
import { Hono, type Context } from "hono";
import { AI_MODELS } from "../modules/chat/models.js";
import { formatTimestamp } from "../utils/dates.js";
import { createTools } from "../modules/chat/tools.js";
import { SYSTEM_PROMPTS } from "../modules/chat/system.js";
import { getAIWorkoutSummary } from "../modules/chat/utils.js";
import { sub } from "date-fns";

const app = new Hono();

type ChatData = {
	userID: string;
	messages: UIMessage[];
};

const { google } = AI_MODELS;

app.post("/general", async (ctx: Context) => {
	const body = await ctx.req.json<ChatData>();
	const { messages } = body;

	const modelMsgs: ModelMessage[] = convertToModelMessages(messages);

	const result = streamText({
		model: google,
		messages: modelMsgs,
		system: SYSTEM_PROMPTS.general,
	});

	const stream = result.toUIMessageStream({
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				return { createdAt: formatTimestamp() };
			}
		},
	});

	return createUIMessageStreamResponse({
		stream,
	});
});

app.post("/summarize", async (ctx: Context) => {
	const body = await ctx.req.json<ChatData>();
	const { userID, messages } = body;
	// const userID = "e17e4fa3-bcf8-4332-819c-b5802fd070b1";
	// const userID = ctx.get("userID");

	console.log("userID", userID);

	const modelMsgs: ModelMessage[] = convertToModelMessages(messages);

	const result = streamText({
		model: google,
		messages: modelMsgs,
		tools: createTools(userID),
		system: SYSTEM_PROMPTS.summary,
	});

	const stream = result.toUIMessageStream({
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				return { createdAt: formatTimestamp() };
			}
		},
	});

	return createUIMessageStreamResponse({ stream });
});

export default app;
