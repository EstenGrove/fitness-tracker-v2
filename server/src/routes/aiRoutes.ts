import { Hono, type Context } from "hono";
import { getResponseOk } from "../utils/api.js";

const app = new Hono();

interface AIPromptBody {
	prompt: string; // adjusted custom prompt w/ user's input injected
	message: string; // actual text input from user
}

app.post("/workout-history-chat", async (ctx: Context) => {
	const body = await ctx.req.json<AIPromptBody>();
	const { prompt, message } = body;

	const resp = getResponseOk({
		message: "AI Chat response",
		prompt: prompt,
	});

	return ctx.json(resp);
});

export default app;
