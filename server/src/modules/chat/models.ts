import { google } from "@ai-sdk/google";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createOllama } from "ollama-ai-provider-v2";
import dotenv from "dotenv";
dotenv.config();

const ollamaModel = createOllama({ baseURL: "http://localhost:11434/api" });
const googleModel = google("gemini-2.0-flash");
// const googleModel = new GoogleGenerativeAI(
// 	process.env.GOOGLE_GENERATIVE_AI_API_KEY as string
// );

const AI_MODELS = {
	google: googleModel,
	ollama: ollamaModel,
} as const;

export { googleModel, AI_MODELS };
