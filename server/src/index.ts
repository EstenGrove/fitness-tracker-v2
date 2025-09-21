import dotenv from "dotenv";
import { Hono, type Context } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { allRoutes } from "./routes/index.js";
import { getServer, isRemote } from "./utils/env.js";
dotenv.config();

const target = getServer("local");
console.log("TARGET ENV:", target);

const SERVER = {
	host: target.ip,
	port: target.port,
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
app.route("habits", allRoutes.habits);
app.route("history", allRoutes.history);
app.route("summary", allRoutes.summary);
app.route("workouts", allRoutes.workouts);
app.route("dashboard", allRoutes.dashboard);
app.route("medications", allRoutes.medications);
app.route("recentActivity", allRoutes.recentActivity);

app.get("/test", async (ctx: Context) => {
	return ctx.text("\n✅ SUCCESS! Request was successful!\n\n");
});

serve({
	fetch: app.fetch,
	hostname: SERVER.host,
	port: SERVER.port,
});

console.log(`\n✅ - Server is running on http://${SERVER.host}:${SERVER.port}`);
