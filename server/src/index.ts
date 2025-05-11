import dotenv from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { allRoutes } from "./routes/index.ts";
import { isRemote } from "./utils/env.ts";
dotenv.config();

const SERVER = {
	host: isRemote ? process.env.REMOTE_IP : process.env.API_HOST,
	port: Number(process.env.API_PORT),
};
const CLIENT = {
	host: isRemote ? process.env.REMOTE_IP : process.env.CLIENT_HOST,
	port: Number(process.env.CLIENT_HTTP_PORT),
};

const ORIGIN = {
	prefix: "http://",
	host: CLIENT.host,
	port: CLIENT.port,
};

const origin = ORIGIN.prefix + CLIENT.host + ":" + CLIENT.port;

const corsConfig = {
	origin: origin,
	credentials: true,
};

const app = new Hono().basePath("/api/v1");

app.use(logger());
app.use(cors(corsConfig));

app.route("user", allRoutes.user);
app.route("auth", allRoutes.auth);
app.route("stats", allRoutes.stats);
app.route("history", allRoutes.history);
app.route("workouts", allRoutes.workouts);
app.route("dashboard", allRoutes.dashboard);
app.route("medications", allRoutes.medications);
app.route("recentActivity", allRoutes.recentActivity);

serve({
	fetch: app.fetch,
	hostname: SERVER.host,
	port: SERVER.port,
});

console.log(`\n✅ - Server is running on http://${SERVER.host}:${SERVER.port}`);
