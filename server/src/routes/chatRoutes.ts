import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	stepCountIs,
	streamText,
	type ModelMessage,
	type UIMessage,
} from "ai";
import { Hono, type Context } from "hono";
import { AI_MODELS } from "../modules/chat/models.js";
import { formatTimestamp } from "../utils/dates.js";
import { createTools } from "../modules/chat/tools.js";
import { SYSTEM_PROMPTS } from "../modules/chat/system.js";
import { getResponseOk } from "../utils/api.js";

const app = new Hono();

type ChatData = {
	userID: string;
	messages: UIMessage[];
};

const { google } = AI_MODELS;

app.get("/suggestions", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	// get suggestions from db
	const resp = getResponseOk({
		suggestions: [],
	});

	return ctx.json(resp);
});

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
	const modelMsgs: ModelMessage[] = convertToModelMessages(messages);

	const result = streamText({
		model: google,
		messages: modelMsgs,
		tools: createTools(userID),
		system: SYSTEM_PROMPTS.summary,
		stopWhen: stepCountIs(10),
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
