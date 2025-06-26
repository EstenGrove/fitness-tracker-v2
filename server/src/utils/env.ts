import dotenv from "dotenv";
dotenv.config();

// ENV CONDITIONAL BOOLEANS
const isRemote = Boolean(process.env.IS_REMOTE);
const isDocker = Boolean(process.env.IS_DOCKER);

const currentEnv = String(process.env.ENVIRONMENT);
const isProd = currentEnv === "prod";
const isLocalEnv = currentEnv === "local";

const defaultPort = 3004;
const defaultPrefix = "http://";

const SERVERS = {
	local: {
		prefix: defaultPrefix,
		ip: process.env.API_HOST,
		port: Number(process.env.API_PORT) || defaultPort,
	},
	remote: {
		prefix: defaultPrefix,
		ip: process.env.REMOTE_IP,
		port: defaultPort,
	},
	docker: {
		prefix: defaultPrefix,
		ip: process.env.DOCKER_IP,
		port: 3002,
	},
};

const getServer = (envOverride?: "local" | "docker" | "remote") => {
	switch (true) {
		case !!envOverride: {
			return SERVERS[envOverride];
		}
		case isDocker: {
			return SERVERS["docker"];
		}
		case isRemote: {
			return SERVERS["remote"];
		}
		case isLocalEnv: {
			return SERVERS["local"];
		}
		default:
			throw new Error(`Unrecognized ENV!`);
	}
};

export {
	isLocalEnv,
	isProd,
	isRemote,
	SERVERS,
	getServer,
	defaultPort,
	defaultPrefix,
};
