import pg from "pg";
import type { Pool as PGPool, QueryResultRow } from "pg";
import { dbConfig } from "./dbConfig.js";

// PostgreSQL Database Pool
// - A pool of database connections

const { Pool } = pg;

export type TQueryRow<T extends QueryResultRow> = T;

const pool: PGPool = new Pool(dbConfig);

// Log database connection errors (useful for production monitoring)
pool.on("error", (err) => {
	console.error("❌ Database connection error:", err);
});

// Test connection on startup
export async function testDatabaseConnection() {
	try {
		await pool.query("SELECT NOW()");
		console.log("✅ Database connected");
		return true;
	} catch (err: any) {
		console.error("❌ Database connection failed:", err.message);
		return false;
	}
}

export default pool;
