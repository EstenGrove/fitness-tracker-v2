import dotenv from "dotenv";
import { Hono, type Context, type Next } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { allRoutes } from "./routes/index.js";
import { getServer, isRemote } from "./utils/env.js";
import { withAuth } from "./modules/auth/utils.js";
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
	origin: [origin, "http://localhost:5175"],
	// origin: "http://localhost:5175",
	credentials: true,
};

const app = new Hono().basePath("/api/v1");

const ENABLE_MIDDLEWARE = false;

app.use(logger());
app.use(cors(corsConfig));
app.use("*", async (ctx: Context, next: Next) => {
	if (!ENABLE_MIDDLEWARE) return await next();

	const path = ctx.req.path;
	if (path.includes("/auth/login") || path.includes("/user")) {
		return await next();
	}

	return await withAuth(ctx, next);
});

app.route("user", allRoutes.user);
app.route("auth", allRoutes.auth);
app.route("chat", allRoutes.chat);
app.route("stats", allRoutes.stats);
app.route("habits", allRoutes.habits);
app.route("exports", allRoutes.exports);
app.route("history", allRoutes.history);
app.route("summary", allRoutes.summary);
app.route("settings", allRoutes.settings);
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
