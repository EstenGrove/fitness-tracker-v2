import dotenv from "dotenv";
dotenv.config();

const isRemote = Boolean(process.env.IS_REMOTE);

const isLocalEnv = process.env.ENVIRONMENT === "local";

const isProd = process.env.ENVIRONMENT === "prod";

export { isLocalEnv, isProd, isRemote };
