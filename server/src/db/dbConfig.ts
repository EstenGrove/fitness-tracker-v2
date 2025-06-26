import "dotenv/config";
import { type PoolConfig } from "pg";

export interface PgSQLConfig extends PoolConfig {
	user: string | undefined;
	password: string | undefined;
	host: string | undefined;
	database: string | undefined;
	port: number | undefined;
}

const envName = process.env.ENVIRONMENT;

const LOCAL_CONFIG: PgSQLConfig = {
	user: process.env.DB_USER || process.env.POSTGRES_USER,
	password: process.env.DB_USER_PWD || process.env.POSTGRES_PASSWORD,
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "FitnessTracker-v2",
	port: Number(process.env.DB_PORT) || 5432,
};

const PROD_CONFIG = {
	connectionString: process.env.PROD_DB_CONFIG as string,
};

const DB_CONFIG = envName === "production" ? PROD_CONFIG : LOCAL_CONFIG;

export { DB_CONFIG as dbConfig };
