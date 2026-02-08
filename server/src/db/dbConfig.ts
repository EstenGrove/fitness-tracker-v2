import "dotenv/config";
import { existsSync } from "fs";
import { type PoolConfig } from "pg";

export interface PgSQLConfig extends PoolConfig {
	user: string | undefined;
	password: string | undefined;
	host: string | undefined;
	database: string | undefined;
	port: number | undefined;
}

const envName = process.env.ENVIRONMENT;
const isDocker = Boolean(process.env.IS_DOCKER) || existsSync("/.dockerenv");
const isProd = envName === "prod" || envName === "PRODUCTION";

// In Docker, default host should be 'db' (the service name), otherwise 'localhost'
const defaultHost = isDocker || isProd ? "db" : "localhost";

const LOCAL_CONFIG: PgSQLConfig = {
	user: process.env.DB_USER || process.env.POSTGRES_USER,
	password: process.env.DB_USER_PWD || process.env.POSTGRES_PASSWORD,
	host: process.env.DB_HOST || defaultHost,
	database:
		process.env.DB_NAME || process.env.POSTGRES_DB || "FitnessTracker-v2",
	port: Number(process.env.DB_PORT) || 5432,
};

const PROD_CONFIG = {
	connectionString: process.env.PROD_DB_CONFIG as string,
};

// Use PROD_CONFIG if we have a connection string (works in Docker too)
// Otherwise fall back to LOCAL_CONFIG with individual environment variables
const useConnectionString = Boolean(process.env.PROD_DB_CONFIG);

const DB_CONFIG = useConnectionString ? PROD_CONFIG : LOCAL_CONFIG;

export { DB_CONFIG as dbConfig };
