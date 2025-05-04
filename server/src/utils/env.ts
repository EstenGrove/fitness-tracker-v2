import dotenv from "dotenv";
dotenv.config();

const isLocalEnv = process.env.ENVIRONMENT === "local";

const isProd = process.env.ENVIRONMENT === "prod";

export { isLocalEnv, isProd };
