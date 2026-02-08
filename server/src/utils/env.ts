import dotenv from "dotenv";
import { existsSync } from "fs";
dotenv.config();

// ENV CONDITIONAL BOOLEANS
const isRemote = Boolean(process.env.IS_REMOTE);
// Auto-detect Docker: check env var OR if running in container (has /.dockerenv file)
const isDocker = Boolean(process.env.IS_DOCKER) || existsSync("/.dockerenv");

const currentEnv = String(process.env.ENVIRONMENT);
const isProd = currentEnv === "prod" || currentEnv === "PRODUCTION";
const isLocalEnv = currentEnv === "local";

const defaultPort = 3004;
const defaultPrefix = "http://";

const SERVERS = {
	local: {
		prefix: defaultPrefix,
		ip: process.env.API_HOST,
		// ip: "localhost",
		port: Number(process.env.API_PORT) || defaultPort,
	},
	remote: {
		prefix: defaultPrefix,
		ip: process.env.REMOTE_IP,
		port: defaultPort,
	},
	docker: {
		prefix: defaultPrefix,
		ip: process.env.DOCKER_IP || "0.0.0.0",
		port: 3002,
	},
	production: {
		prefix: "https://",
		ip: process.env.DOCKER_IP || "0.0.0.0",
		port: 3002,
	},
};

const getServer = (
	envOverride?: "local" | "docker" | "remote" | "production"
) => {
	switch (true) {
		case isLocalEnv || envOverride === "local": {
			return SERVERS["local"];
		}
		case !!envOverride: {
			return SERVERS[envOverride];
		}
		case isProd: {
			return SERVERS["production"];
		}
		case isDocker: {
			return SERVERS["docker"];
		}
		case isRemote: {
			return SERVERS["remote"];
		}

		default:
			// Default to docker if we're in a container, otherwise throw error
			if (existsSync("/.dockerenv")) {
				console.warn(
					"⚠️  No environment variables set, defaulting to Docker configuration"
				);
				return SERVERS["docker"];
			}
			throw new Error(
				`Unrecognized ENV! Set one of: IS_DOCKER, IS_REMOTE, or ENVIRONMENT (local/prod/PRODUCTION). Current: IS_DOCKER=${process.env.IS_DOCKER}, IS_REMOTE=${process.env.IS_REMOTE}, ENVIRONMENT=${process.env.ENVIRONMENT}`
			);
	}
};

export {
	isLocalEnv,
	isProd,
	isRemote,
	isDocker,
	SERVERS,
	getServer,
	defaultPort,
	defaultPrefix,
};
