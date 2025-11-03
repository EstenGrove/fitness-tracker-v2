import { google } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider-v2";
import dotenv from "dotenv";
dotenv.config();

const ollamaModel = createOllama({ baseURL: "http://localhost:11434/api" });
const googleModel = google("gemini-2.0-flash");

const AI_MODELS = {
	google: googleModel,
	ollama: ollamaModel,
} as const;

export { googleModel, AI_MODELS };
