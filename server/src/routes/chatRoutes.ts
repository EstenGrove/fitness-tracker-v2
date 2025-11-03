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

const app = new Hono();

type ChatData = {
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

export default app;
