import dotenv from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { allRoutes } from "./routes/index.ts";
dotenv.config();

const SERVER = {
	host: process.env.API_HOST,
	port: Number(process.env.API_PORT),
};

const app = new Hono().basePath("/api/v1");

app.use(logger());
app.use(cors());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.route("history", allRoutes.history);
app.route("workouts", allRoutes.workouts);

serve({
	fetch: app.fetch,
	hostname: SERVER.host,
	port: SERVER.port,
});

console.log(`\n✅ - Server is running on http://${SERVER.host}:${SERVER.port}`);
